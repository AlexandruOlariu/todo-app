<?php
namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function index()
    {
        return Todo::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|integer',
        ]);

        $todo = Todo::create($validated);

        return response()->json($todo, 201);
    }

    public function show(Todo $todo)
    {
        return $todo;
    }

    public function update(Request $request, Todo $todo)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|integer',
        ]);

        $todo->update($validated);

        return response()->json($todo);
    }

    public function destroy(Todo $todo)
    {
        $todo->delete();

        return response()->json(null, 204);
    }
}
