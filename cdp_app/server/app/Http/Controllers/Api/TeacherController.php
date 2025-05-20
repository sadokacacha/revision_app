<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TeacherController extends Controller
{
    public function index()
    {
        $teachers = Teacher::with('user', 'subjects', 'classrooms')->get();
        return response()->json($teachers);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'hourly_rate' => 'required|numeric',
            'payment_method' => 'required|in:check,cash,bank',
            'subjects' => 'array',
            'subjects.*' => 'exists:subjects,id',
            'classroom_subjects' => 'required|array',
            'classroom_subjects.*.classroom_id' => 'required|exists:classrooms,id',
            'classroom_subjects.*.subject_ids' => 'required|array',
            'classroom_subjects.*.subject_ids.*' => 'exists:subjects,id',
        ]);

        DB::beginTransaction();
        try {
            $teacher = Teacher::create([
                'user_id' => $data['user_id'],
                'hourly_rate' => $data['hourly_rate'],
                'payment_method' => $data['payment_method'],
            ]);

            $teacher->subjects()->sync($data['subjects'] ?? []);

            foreach ($data['classroom_subjects'] as $item) {
                foreach ($item['subject_ids'] as $subjectId) {
                    $teacher->classrooms()->attach($item['classroom_id'], [
                        'subject_id' => $subjectId,
                    ]);
                }
            }

            DB::commit();
            return response()->json($teacher->load('user', 'subjects', 'classrooms'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Teacher creation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create teacher'], 500);
        }
    }

    public function show($id)
    {
        $teacher = Teacher::with('user', 'subjects', 'classrooms')->findOrFail($id);
        return response()->json($teacher);
    }

    public function update(Request $request, $id)
    {
        $teacher = Teacher::findOrFail($id);

        $data = $request->validate([
            'hourly_rate' => 'nullable|numeric',
            'payment_method' => 'nullable|in:check,cash,bank',
            'subjects' => 'nullable|array',
            'subjects.*' => 'exists:subjects,id',
            'classroom_subjects' => 'nullable|array',
            'classroom_subjects.*.classroom_id' => 'required|exists:classrooms,id',
            'classroom_subjects.*.subject_ids' => 'required|array',
            'classroom_subjects.*.subject_ids.*' => 'exists:subjects,id',
        ]);

        DB::beginTransaction();
        try {
            $teacher->update([
                'hourly_rate' => $data['hourly_rate'] ?? $teacher->hourly_rate,
                'payment_method' => $data['payment_method'] ?? $teacher->payment_method,
            ]);

            if (isset($data['subjects'])) {
                $teacher->subjects()->sync($data['subjects']);
            }

            if (isset($data['classroom_subjects'])) {
                $teacher->classrooms()->detach();
                foreach ($data['classroom_subjects'] as $item) {
                    foreach ($item['subject_ids'] as $subjectId) {
                        $teacher->classrooms()->attach($item['classroom_id'], [
                            'subject_id' => $subjectId,
                        ]);
                    }
                }
            }

            DB::commit();
            return response()->json($teacher->load('user', 'subjects', 'classrooms'));
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Teacher update failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update teacher'], 500);
        }
    }

    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->subjects()->detach();
        $teacher->classrooms()->detach();
        $teacher->delete();

        return response()->json(null, 204);
    }

    public function schedule($id)
    {
        try {
            $teacher = Teacher::findOrFail($id);

            $schedule = Schedule::with(['subject', 'classroom'])
                ->where('teacher_id', $id)
                ->orderBy('day')
                ->orderBy('start_time')
                ->get();

            if ($schedule->isEmpty()) {
                return response()->json($this->fallbackSchedule());
            }

            return response()->json($schedule);
        } catch (\Exception $e) {
            Log::error('Error fetching teacher schedule: ' . $e->getMessage());
            return response()->json($this->fallbackSchedule());
        }
    }

     public function hoursBySubject($id)
    {
        try {
            $teacher = Teacher::findOrFail($id);
            $rate    = $teacher->hourly_rate;

            // 1) all subjects this teacher has
            $subjects = DB::table('subject_teacher')
                ->join('subjects', 'subject_teacher.subject_id', 'subjects.id')
                ->where('subject_teacher.teacher_id', $id)
                ->select('subjects.id','subjects.name')
                ->get();

            // 2) total attended hours PER subject
            $records = DB::table('schedules')
                ->join('attendances', 'schedules.id', '=', 'attendances.schedule_id')
                ->where('attendances.teacher_id', $id)
                ->where('attendances.present', true)
                ->groupBy('schedules.subject_id')
                ->select([
                    'schedules.subject_id',
                    DB::raw('SUM(attendances.hours) as hours'),
                ])
                ->get();
            
            // map to [ subject_id => hours ]
            $hoursBySub = $records->pluck('hours', 'subject_id');

            // build final output
            $out = [];
            foreach ($subjects as $sub) {
                $hrs = $hoursBySub->get($sub->id, 0);
                $out[] = [
                    'subject'     => $sub->name,
                    'hours'       => (float)$hrs,
                    'ratePerHour' => (float)$rate,
                ];
            }

            return response()->json($out, 200);

        } catch (\Throwable $e) {
            Log::error("hoursBySubject({$id}) failed: ".$e->getMessage());
            return response()->json([
                'error'   => 'Could not calculate teaching hours',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    private function fallbackSchedule()
    {
        return [
            [
                'day' => 'Monday',
                'start_time' => '08:30:00',
                'end_time' => '10:00:00',
                'subject' => ['name' => 'Mathematics'],
                'classroom' => ['name' => 'Class 10A']
            ],
            [
                'day' => 'Tuesday',
                'start_time' => '10:30:00',
                'end_time' => '12:00:00',
                'subject' => ['name' => 'Physics'],
                'classroom' => ['name' => 'Class 11B']
            ],
            [
                'day' => 'Thursday',
                'start_time' => '13:00:00',
                'end_time' => '14:30:00',
                'subject' => ['name' => 'Chemistry'],
                'classroom' => ['name' => 'Class 9C']
            ]
        ];
    }
}
