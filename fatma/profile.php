<?php

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

    // (Optional: add your modules/payments logic here if needed)

    return response()->json($response);
}

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'role'     => ['required', Rule::in(['admin', 'teacher', 'student'])],
        ])
    
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
