<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Payment;
use Illuminate\Http\Request;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Support\Facades\Log;


class AttendanceController extends Controller
{










    
    public function today()
    {
        $today = now()->toDateString();
        return Attendance::with('schedule.teacher.user','schedule.classroom','schedule.subject')
            ->where('date', $today)
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'schedule_id'=>'required|exists:schedules,id',
            'date'=>'required|date',
            'status'=>'required|in:present,absent',
            'hours'=>'required_if:status,present|numeric|min:0'
        ]);

        $attendance = Attendance::updateOrCreate(
            ['schedule_id'=>$data['schedule_id'],'date'=>$data['date']],
            $data
        );

        // Optional: create payment if present
        if ($data['status'] === 'present') {
            $rate = $attendance->schedule->teacher->hourly_rate;
            Payment::create([
                'user_id' => $attendance->schedule->teacher->user_id,
                'amount'  => $rate * $data['hours'],
                'date'    => $data['date'],
                'status'  => 'pending'
            ]);
        }

        return response()->json($attendance, 201);
    }

    public function update(Request $request, Attendance $attendance)
    {
        $data = $request->validate([
            'status'=>'sometimes|in:present,absent',
            'hours'=>'sometimes|numeric|min:0'
        ]);

        $attendance->update($data);

        return response()->json($attendance);
    }


public function mark(Request $request)
{
    try {
        Log::info('Attendance mark request received:', $request->all());
        
        $data = $request->validate([
            'schedule_id' => 'required|exists:schedules,id',
            'teacher_id'  => 'required|exists:teachers,id',
            'date'        => 'required|date',
            'status'      => 'required|in:present,absent',
            'hours'       => 'required_if:status,present|numeric|min:0',
        ]);

        // Get the schedule to access related data
        $schedule = Schedule::findOrFail($data['schedule_id']);
        Log::info('Schedule found:', ['schedule_id' => $schedule->id]);
        
        // Get the teacher info to calculate payment
        $teacher = $schedule->teacher;
        Log::info('Teacher found:', ['teacher_id' => $teacher->id]);
        
        // Build the payload for updateOrCreate - match fields to fillable array
        $payload = [
            'schedule_id' => $data['schedule_id'],
            'teacher_id'  => $data['teacher_id'],
            'date'        => $data['date'],
            'present'     => $data['status'] === 'present',
            'hours'       => $data['status'] === 'present' ? ($data['hours'] ?? 0) : 0,
        ];
        
        Log::info('Creating attendance with payload:', $payload);

        try {
            // Upsert the attendance record
            $attendance = Attendance::updateOrCreate(
                [
                  'schedule_id' => $data['schedule_id'],
                  'date'        => $data['date'],
                ],
                $payload
            );
            
            Log::info('Attendance record created/updated:', ['id' => $attendance->id]);
        } catch (\Exception $e) {
            Log::error('Failed to create/update attendance:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
        
        // Skip payment creation for now to isolate the issue
        return response()->json([
            'message' => 'Attendance marked successfully',
            'attendance' => $attendance
        ]);
    
    } catch (\Illuminate\Validation\ValidationException $e) {
        Log::warning('Validation failed for attendance marking:', [
            'errors' => $e->errors()
        ]);
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        Log::error('Attendance marking error:', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'message' => 'Failed to mark attendance',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function index(Request $request)
{
    $from = $request->input('from');
    $to = $request->input('to');

    $teachers = User::where('role', 'teacher')->with(['schedules' => function ($q) use ($from, $to) {
        $q->whereBetween('start_time', [$from, $to])
          ->with('attendance', 'subject', 'classroom');
    }])->get();

    return response()->json($teachers);
}
}
