<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\Classroom;
use App\Models\Schedule;
use App\Models\Attendance;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserController extends Controller
{
    // GET /api/users
    public function index()
    {
        $users = User::with('roles')->get();
    
        $users = $users->map(function($user) {
            return [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->roles->pluck('name')->first(), // get first role
            ];
        });
    
        return response()->json($users);
    }





    // GET /api/users/{id}

public function show($id)
{
    $user = User::with(['roles', 'teacher.user', 'teacher.subjects', 'teacher.classrooms'])->findOrFail($id);
    $role = $user->roles->pluck('name')->first();

    $response = [
        'id'    => $user->id,
        'name'  => $user->name,
        'email' => $user->email,
        'role'  => $role,
    ];

    if ($role === 'teacher' && $user->teacher) {
        $response['teacher'] = $user->teacher;
        $response['hourly_rate'] = $user->teacher->hourly_rate;
        $response['payment_method'] = $user->teacher->payment_method;
        $response['subjects'] = $user->teacher->subjects;
        $response['classrooms'] = $user->teacher->classrooms;
    }


    return response()->json($response);
}
    // POST /api/users


    public function store(Request $request)
{
    $data = $request->validate([
      'name'            => 'required|string|max:255',
      'email'           => 'required|email|unique:users,email',
      'password'        => 'required|string|min:6',
      'role'            => ['required', Rule::in(['admin','teacher','student'])],

      // new shape: expect classroom_subjects exactly like TeacherController
      'hourly_rate'     => 'nullable|numeric',
      'payment_method'  => 'nullable|string|in:cash,bank,check',
      'subjects'        => 'nullable|array',
      'subjects.*'      => 'exists:subjects,id',
      'classroom_subjects'            => 'nullable|array',
      'classroom_subjects.*.classroom_id' => 'required_with:classroom_subjects|exists:classrooms,id',
      'classroom_subjects.*.subject_ids'  => 'required_with:classroom_subjects|array',
      'classroom_subjects.*.subject_ids.*'=> 'exists:subjects,id',
    ]);

    // 1) create the user + role
    $user = User::create([
      'name'     => $data['name'],
      'email'    => $data['email'],
      'password' => Hash::make($data['password']),
    ]);
    $user->assignRole($data['role']);

    // 2) if teacher, create Teacher record & attach all pivots
    if ($data['role'] === 'teacher') {
      $teacher = Teacher::create([
        'user_id'        => $user->id,
        'hourly_rate'    => $data['hourly_rate']    ?? 0,
        'payment_method' => $data['payment_method'] ?? 'cash',
      ]);

      // sync subjects
      $teacher->subjects()->sync($data['subjects'] ?? []);

      // use same loop shape as your TeacherController
      if (!empty($data['classroom_subjects'])) {
        foreach ($data['classroom_subjects'] as $item) {
          foreach ($item['subject_ids'] as $subjectId) {
            $teacher->classrooms()->attach($item['classroom_id'], [
              'subject_id' => $subjectId,
            ]);
          }
        }
      }
    }

    // 3) return everything
    return response()->json([
      'id'             => $user->id,
      'name'           => $user->name,
      'email'          => $user->email,
      'role'           => $data['role'],
      'teacher'        => $user->teacher ? [
         'hourly_rate'    => $user->teacher->hourly_rate,
         'payment_method' => $user->teacher->payment_method,
         'subjects'       => $user->teacher->subjects,
         'classrooms'     => $user->teacher->classrooms,
      ] : null,
    ], 201);
}



    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'role'     => ['required', Rule::in(['admin', 'teacher', 'student'])],
        ]);
    
        $user->name = $data['name'];
        $user->email = $data['email'];
    
        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
    
        $user->save();
    
        // Update roles
        $user->syncRoles([$data['role']]);
    
        return response()->json($user);
    }
    



    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
    
        return response()->json(null, 204);
    }



    public function schedule($id)
    {
        $schedule = Schedule::with(['classroom', 'subject'])
            ->where('teacher_id', $id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get()
            ->map(function ($entry) {
                return [
                    'day' => $entry->day_of_week,
                    'start' => $entry->start_time,
                    'end' => $entry->end_time,
                    'classroom' => $entry->classroom->name,
                    'subject' => $entry->subject->name,
                ];
            });
    
        return response()->json($schedule);
    }

    public function payments($id)
    {
        try {
            $user = User::findOrFail($id);
            $payments = Payment::where('user_id', $user->id)
                ->orderBy('date', 'desc')
                ->get(['id','amount','status','date']);
            
            return response()->json($payments);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch payments.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
