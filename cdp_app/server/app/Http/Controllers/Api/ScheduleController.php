<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Schedule;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    /**
     * GET /api/schedules
     * List all schedules with today's attendance
     */
    public function index()
    {
        $today = now()->toDateString();
        $schedules = Schedule::with([
            'teacher.user', 'classroom', 'subject',
            'attendances' => function ($q) use ($today) {
                $q->where('date', $today);
            }
        ])->get();

        return response()->json($schedules);
    }

    /**
     * POST /api/schedules
     * Store a single schedule
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'teacher_id'   => 'required|exists:teachers,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id'   => 'required|exists:subjects,id',
            'day'          => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
            'start_time'   => 'required|date_format:H:i',
            'end_time'     => 'required|date_format:H:i|after:start_time',
        ]);

        $schedule = Schedule::create($data);
        return response()->json($schedule->load('teacher.user', 'classroom', 'subject'), 201);
    }

    /**
     * POST /api/schedules/recurring
     * Store weekly recurring schedules until a certain date
     */
    public function storeRecurring(Request $request)
    {
        $data = $request->validate([
            'teacher_id'   => 'required|exists:teachers,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id'   => 'required|exists:subjects,id',
            'day'          => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
            'start_time'   => 'required|date_format:H:i',
            'end_time'     => 'required|date_format:H:i|after:start_time',
            'repeat_until' => 'required|date|after:today',
        ]);

        $repeatUntil = Carbon::parse($data['repeat_until']);
        $day = ucfirst(strtolower($data['day']));
        $schedules = [];

        for ($date = Carbon::now(); $date->lte($repeatUntil); $date->addWeek()) {
            if ($date->format('l') === $day) {
                $schedules[] = Schedule::create([
                    'teacher_id'   => $data['teacher_id'],
                    'classroom_id' => $data['classroom_id'],
                    'subject_id'   => $data['subject_id'],
                    'day'          => $day,
                    'start_time'   => $data['start_time'],
                    'end_time'     => $data['end_time'],
                    'created_at'   => $date,
                ]);
            }
        }

        return response()->json($schedules);
    }

    /**
     * PUT /api/schedules/{id}
     * Update a single schedule
     */
    public function update(Request $request, $id)
    {
        $schedule = Schedule::findOrFail($id);

        $data = $request->validate([
            'start_time' => 'nullable|date_format:H:i',
            'end_time'   => 'nullable|date_format:H:i|after:start_time',
            'day'        => 'nullable|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        ]);

        $schedule->update($data);
        return response()->json($schedule->load('teacher.user', 'classroom', 'subject'));
    }

    /**
     * PUT /api/schedules/recurring
     * Update all recurring schedules based on matching attributes
     */
    public function updateRecurring(Request $request)
    {
        $data = $request->validate([
            'teacher_id'   => 'required|exists:teachers,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id'   => 'required|exists:subjects,id',
            'day'          => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
            'start_time'   => 'required|date_format:H:i',
            'end_time'     => 'required|date_format:H:i|after:start_time',
        ]);

        $affected = Schedule::where('teacher_id', $data['teacher_id'])
            ->where('classroom_id', $data['classroom_id'])
            ->where('subject_id', $data['subject_id'])
            ->where('day', $data['day'])
            ->update([
                'start_time' => $data['start_time'],
                'end_time'   => $data['end_time'],
            ]);

        return response()->json(['updated' => $affected]);
    }

    /**
     * DELETE /api/schedules/recurring
     * Delete all recurring schedules
     */
    public function deleteRecurring(Request $request)
    {
        $data = $request->validate([
            'teacher_id'   => 'required|exists:teachers,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id'   => 'required|exists:subjects,id',
            'day'          => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        ]);

        $deleted = Schedule::where('teacher_id', $data['teacher_id'])
            ->where('classroom_id', $data['classroom_id'])
            ->where('subject_id', $data['subject_id'])
            ->where('day', $data['day'])
            ->delete();

        return response()->json(['deleted' => $deleted]);
    }

    /**
     * GET /api/schedules/upcoming
     * Get all schedules within the next 7 days
     */
    public function upcomingWeek()
    {
        $today = Carbon::today();
        $end = Carbon::today()->addDays(6);

        $schedules = Schedule::whereBetween('created_at', [$today, $end])
            ->with('teacher.user', 'classroom', 'subject')
            ->get();

        return response()->json($schedules);
    }

    /**
     * GET /api/schedules/classroom/{id}
     * Get schedules for a specific classroom
     */
    public function getByClassroom($id)
    {
        $schedules = Schedule::where('classroom_id', $id)
            ->with('teacher.user', 'subject')
            ->get();

        return response()->json($schedules);
    }

    /**
     * GET /api/schedules/teacher/{id}
     * Get schedules for a specific teacher
     */
    public function getByTeacher($id)
    {
        $schedules = Schedule::where('teacher_id', $id)
            ->with('classroom', 'subject')
            ->get();

        return response()->json($schedules);
    }

    /**
     * DELETE /api/schedules/{id}
     * Delete a single schedule
     */
    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();

        return response()->json(null, 204);
    }

    /**
     * GET /api/schedules/today
     * Get today's active schedules (if current time is between start_time and end_time)
     */
    public function today()
    {
        $today = Carbon::now()->englishDayOfWeek;
        $todayDate = Carbon::now()->toDateString();

        $schedules = Schedule::where('day', $today)
            ->with(['teacher.user', 'classroom', 'subject'])
            ->get();

        return response()->json([
            'date' => $todayDate,
            'weekday' => $today,
            'schedules' => $schedules
        ]);
    }
    public function week()
{
    $start = Carbon::today()->startOfWeek();
    $end   = Carbon::today()->endOfWeek();
    $schedules = Schedule::whereBetween('created_at', [$start, $end])
        ->with(['teacher.user','classroom','subject','attendances'])
        ->get();
    return response()->json($schedules);
}

public function nextWeek()
{
    $start = Carbon::today()->addWeek()->startOfWeek();
    $end   = Carbon::today()->addWeek()->endOfWeek();
    $schedules = Schedule::whereBetween('created_at', [$start, $end])
        ->with(['teacher.user','classroom','subject','attendances'])
        ->get();
    return response()->json($schedules);
}


public function byPeriod(Request $request)
{
    $period = $request->query('period','today');

    return match($period) {
        'this_week' => $this->week(),
        'next_week' => $this->nextWeek(),
        default     => $this->today(),
    };
}




}
