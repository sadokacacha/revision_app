<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    public function index()
    {
        return response()->json(Classroom::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:classrooms,name',
        ]);

        $classroom = Classroom::create($validated);

        return response()->json($classroom, 201);
    }

    public function show(Classroom $classroom)
    {
        return response()->json($classroom);
    }

    public function update(Request $request, Classroom $classroom)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:classrooms,name,' . $classroom->id,
        ]);

        $classroom->update($validated);

        return response()->json($classroom);
    }

    public function destroy(Classroom $classroom)
    {
        $classroom->delete();

        return response()->json(['message' => 'Classroom deleted']);
    }
}
