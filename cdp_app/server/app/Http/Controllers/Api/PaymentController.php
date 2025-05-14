<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PaymentController extends Controller
{
    // 🧾 Store a payment (for teacher or student)
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:student,teacher',
            'method' => 'required|in:cash,check,bank',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'status' => 'nullable|in:pending,paid',
        ]);

        $payment = Payment::create([
            ...$data,
            'status' => $data['status'] ?? 'pending',
        ]);

        return response()->json([
            'message' => ucfirst($data['type']) . ' payment recorded.',
            'data' => $payment,
        ], 201);
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
