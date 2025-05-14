<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;

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

        $teacher = Teacher::create([
            'user_id' => $data['user_id'],
            'hourly_rate' => $data['hourly_rate'],
            'payment_method' => $data['payment_method'],
        ]);

        // Sync basic subjects
        $teacher->subjects()->sync($data['subjects'] ?? []);

        // Handle classroom-subjects pivot
        $attach = [];
        foreach ($data['classroom_subjects'] as $item) {
            foreach ($item['subject_ids'] as $subjectId) {
                $attach[] = [
                    'classroom_id' => $item['classroom_id'],
                    'subject_id' => $subjectId,
                ];
            }
        }

        // Sync classroom_subject_teacher pivot
        $teacher->classrooms()->detach();
        foreach ($attach as $pivot) {
            $teacher->classrooms()->attach($pivot['classroom_id'], [
                'subject_id' => $pivot['subject_id'],
            ]);
        }

        return response()->json($teacher->load('user', 'subjects', 'classrooms'), 201);
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
            'hourly_rate' => 'sometimes|numeric',
            'payment_method' => 'sometimes|in:check,cash,bank',
            'subjects' => 'sometimes|array',
            'subjects.*' => 'exists:subjects,id',
            'classroom_subjects' => 'sometimes|array',
            'classroom_subjects.*.classroom_id' => 'required|exists:classrooms,id',
            'classroom_subjects.*.subject_ids' => 'required|array',
            'classroom_subjects.*.subject_ids.*' => 'exists:subjects,id',
        ]);

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

        return response()->json($teacher->load('user', 'subjects', 'classrooms'));
    }

    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->subjects()->detach();
        $teacher->classrooms()->detach();
        $teacher->delete();

        return response()->json(null, 204);
    }
}
