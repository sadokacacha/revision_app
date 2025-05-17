<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Payment;
use Illuminate\Http\Request;
use App\Models\Schedule;
use App\Models\User;


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
    $data = $request->validate([
        'schedule_id' => 'required|exists:schedules,id',
        'teacher_id'  => 'required|exists:teachers,id',
        'date'        => 'required|date',
        'status'      => 'required|in:present,absent',
        'hours'       => 'required_if:status,present|numeric|min:0',
    ]);

    // Get the schedule to access related data
    $schedule = Schedule::with('teacher.user', 'subject', 'classroom')
        ->findOrFail($data['schedule_id']);
    
    // Get the teacher info to calculate payment
    $teacher = $schedule->teacher;
    
    // Build the payload for updateOrCreate
    $payload = [
        'present' => $data['status'] === 'present',
        'hours'   => $data['status'] === 'present' 
                     ? ($data['hours'] ?? 0) 
                     : 0,
    ];

    // Upsert the attendance record
    $attendance = Attendance::updateOrCreate(
        [
          'schedule_id' => $data['schedule_id'],
          'teacher_id'  => $data['teacher_id'],
          'date'        => $data['date'],
        ],
        $payload
    );
    
    // If teacher is present, create or update payment record
    if ($data['status'] === 'present' && $data['hours'] > 0) {
        // Calculate payment amount
        $hourlyRate = $teacher->hourly_rate ?? 0;
        $paymentAmount = $hourlyRate * $data['hours'];
        
        // Create payment record for the teacher
        Payment::updateOrCreate(
            [
                'user_id' => $teacher->user_id,
                'date' => $data['date'],
                'type' => 'teacher_attendance',
                'reference_id' => $attendance->id
            ],
            [
                'amount' => $paymentAmount,
                'method' => $teacher->payment_method ?? 'bank',
                'status' => 'pending',
                'description' => "Payment for {$schedule->subject->name} class on {$data['date']}"
            ]
        );
        
        // Add payment info to response
        $attendance->payment_amount = $paymentAmount;
        $attendance->hourly_rate = $hourlyRate;
    }

    return response()->json($attendance);
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
