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
    $user = User::with('roles')->findOrFail($id);
    $role = $user->roles->pluck('name')->first();

    $base = [
        'id'    => $user->id,
        'name'  => $user->name,
        'email' => $user->email,
        'role'  => $role,
    ];

    // If it’s a teacher, build their detailed breakdown
    if ($role === 'teacher') {
        $teacher    = $user->teacher;
        $hourlyRate = $teacher->hourly_rate;
        $today      = Carbon::now()->startOfMonth();

        // Eager‑load schedules and their attendances
        $schedules = Schedule::with('attendances')
            ->where('teacher_id', $teacher->id)
            ->whereDate('day_of_week','>=',$today) // only this month
            ->get();

        // Group schedules by subject
        $bySubject = $schedules->groupBy('subject_id');

        $modules = [];
        $total   = 0;

        foreach ($bySubject as $subjectId => $group) {
            $sub = $group->first()->subject;
            
            // 1) total scheduled hours for this subject
            $scheduledHours = $group->sum(function($sch){
                $start = Carbon::parse($sch->start_time);
                $end   = Carbon::parse($sch->end_time);
                return $end->diffInMinutes($start) / 60;
            });

            // 2) total *attended* hours (via attendance records)
            $attendedHours = Attendance::whereIn('schedule_id', $group->pluck('id'))
                ->whereMonth('date', $today->month)
                ->whereYear('date', $today->year)
                ->sum('hours');

            $due = $attendedHours * $hourlyRate;
            $total += $due;

            $modules[] = [
                'id'               => $sub->id,
                'name'             => $sub->name,
                'hours_required'   => round($scheduledHours,2),
                'hours_done'       => round($attendedHours,2),
                'price_per_hour'   => $hourlyRate,
                'price_due'        => round($due,2),
            ];
        }

        // pull in any manual payments they’ve received
        $payments = Payment::where('user_id', $user->id)
                            ->orderBy('date','desc')
                            ->get(['id','amount','status','date']);

        return response()->json(array_merge($base, [
            'payment_method' => $teacher->payment_method,
            'modules'        => $modules,
            'total_due'      => round($total,2),
            'payments'       => $payments,
        ]));
    }

    // student or admin — just basic info
    return response()->json($base);
}

    // POST /api/users
    
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'            => 'required|string|max:255',
            'email'           => 'required|email|unique:users,email',
            'password'        => 'required|string|min:6',
            'role'            => ['required', Rule::in(['admin','teacher','student'])],
            // Only for teachers
            'hourly_rate'     => 'nullable|numeric',
            'payment_method'  => 'nullable|string|in:cash,bank,check',
            'subjects'        => 'nullable|array',
            'subjects.*'      => 'exists:subjects,id',
            'classrooms'      => 'nullable|array',
            'classrooms.*'    => 'exists:classrooms,id',
        ]);
    
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    
        $user->assignRole($data['role']);
    
        if ($data['role'] === 'teacher') {
            $teacher = Teacher::create([
                'user_id'        => $user->id,
                'hourly_rate'    => $data['hourly_rate'] ?? 0,
                'payment_method' => $data['payment_method'] ?? 'cash',
            ]);
    
            $teacher->subjects()->sync($data['subjects'] ?? []);
            $teacher->classrooms()->sync($data['classrooms'] ?? []);
        }
    
        return response()->json($user->load('teacher.subjects', 'teacher.classrooms'), 201);
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

}
