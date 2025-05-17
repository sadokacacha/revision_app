<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PaymentController extends Controller
{
    // 📝 Get all payments with pagination
    public function index(Request $request)
    {
        try {
            $query = Payment::with('user');
            
            // Filter by type if provided
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }
            
            // Filter by user if provided
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }
            
            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            $payments = $query->latest()->paginate(15);
            
            return response()->json($payments);
        } catch (\Exception $e) {
            Log::error('Error in payments index: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve payments.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 🧾 Store a payment (for teacher or student)
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'userId' => 'required|exists:users,id',
                'method' => 'required|in:cash,check,bank',
                'amount' => 'required|numeric|min:0',
                'date' => 'required|date',
                'status' => 'nullable|in:pending,paid',
                'period' => 'nullable|string',
                'paymentStyle' => 'nullable|string'
            ]);
            
            // Get user to determine type
            $user = User::findOrFail($data['userId']);
            $type = strtolower($user->role);
            
            if (!in_array($type, ['student', 'teacher'])) {
                return response()->json([
                    'message' => 'Payment can only be created for student or teacher.'
                ], 422);
            }
            
            $payment = Payment::create([
                'user_id' => $data['userId'],
                'type' => $type,
                'method' => $data['method'],
                'amount' => $data['amount'],
                'date' => $data['date'],
                'status' => $data['status'] ?? 'paid',
                'period' => $data['period'] ?? null,
                'payment_style' => $data['paymentStyle'] ?? null
            ]);
            
            return response()->json([
                'message' => ucfirst($type) . ' payment recorded.',
                'data' => $payment,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating payment: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create payment.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 📜 Get payment history for a user (student or teacher)
    public function history($userId)
    {
        $user = User::findOrFail($userId);

        $payments = Payment::where('user_id', $userId)->get();

        return response()->json([
            'user' => $user->only(['id', 'name', 'email']),
            'payments' => $payments,
        ]);
    }

    // 🧮 Calculate teacher payment summary for current month
    public function teacherSummary()
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $teachers = Teacher::with(['user'])->get();

        $summary = [];

        foreach ($teachers as $teacher) {
            $totalHours = Attendance::whereHas('schedule', function ($query) use ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                })
                ->whereMonth('date', $currentMonth)
                ->whereYear('date', $currentYear)
                ->sum('hours');

            $hourlyRate = $teacher->hourly_rate ?? 0;
            $paymentDue = $totalHours * $hourlyRate;

            $summary[] = [
                'teacher_id' => $teacher->id,
                'teacher_name' => $teacher->user->name,
                'hourly_rate' => $hourlyRate,
                'total_hours' => $totalHours,
                'payment_due' => $paymentDue,
            ];
        }

        return response()->json([
            'month' => Carbon::now()->format('F Y'),
            'teacher_payments' => $summary,
        ]);
    }

    // ✅ Mark teacher payment as paid (based on total for the month)
    public function markTeacherPaid(Request $request, $teacherId)
    {
        $teacher = Teacher::with('user')->findOrFail($teacherId);
        $month = Carbon::now()->format('Y-m');

        // Calculate total due
        $totalHours = Attendance::whereHas('schedule', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })
            ->whereMonth('date', Carbon::now()->month)
            ->whereYear('date', Carbon::now()->year)
            ->sum('hours');

        $amount = $totalHours * ($teacher->hourly_rate ?? 0);

        $payment = Payment::create([
            'user_id' => $teacher->user_id,
            'type' => 'teacher',
            'method' => $request->input('method', 'cash'),
            'amount' => $amount,
            'date' => Carbon::now()->toDateString(),
            'status' => 'paid',
        ]);

        return response()->json([
            'message' => 'Teacher marked as paid for ' . $month,
            'payment' => $payment,
        ]);
    }
}
