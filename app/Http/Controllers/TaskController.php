<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Task::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'asc');

        if (request("name")) {
            $query->where('name', "like", "%" . request("name") . "%");
        }
        if (request("status")) {
            $query->where('status', request("status"));
        }

        $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        return Inertia::render("Task/Index", [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = Project::all();

        return Inertia::render('Task/Create', [
            'projects' => ProjectResource::collection($projects)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();

        $imageName =  $request->file('image')->getClientOriginalName();
        $filename = pathinfo($imageName, PATHINFO_FILENAME);
        $extension = $request->file('image')->getClientOriginalExtension();

        $data['image_path'] = $filename . '_' . time() . '.' . $extension;

        Storage::disk('local')->putFileAs('public', $request->file('image'), $data['image_path']);

        $data['assigned_user_id'] = Auth::user()->id;
        $data['created_by'] = Auth::user()->id;
        $data['updated_by'] = Auth::user()->id;

        Task::create($data);

        return to_route("task.index")->with('success', 'Task was created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $projects = Project::all();

        return Inertia::render('Task/Edit', [
            'task' => new TaskResource($task),
            'projects' => ProjectResource::collection($projects)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $data = $request->validated();

        if ($data['image']) {
            $imageName =  $request->file('image')->getClientOriginalName();
            $filename = pathinfo($imageName, PATHINFO_FILENAME);
            $extension = $request->file('image')->getClientOriginalExtension();

            $data['image_path'] = $filename . '_' . time() . '.' . $extension;

            Storage::disk('public')->delete($task->image_path);

            Storage::disk('local')->putFileAs('public', $request->file('image'), $data['image_path']);
        } else {
            $data['image_path'] = $task->image_path;
        }

        $data['assigned_user_id'] = Auth::user()->id;
        $data['created_by'] = Auth::user()->id;
        $data['updated_by'] = Auth::user()->id;

        $task->update($data);

        return to_route("task.index")->with('success', 'Task was updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return to_route('task.index')->with('success', 'Task was deleted');
    }
}
