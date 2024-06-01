<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Project::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');

        if (request("name")) {
            $query->where('name', "like", "%" . request("name") . "%");
        }
        if (request("status")) {
            $query->where('status', request("status"));
        }

        $projects = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        return Inertia::render("Project/Index", [
            'projects' => ProjectResource::collection($projects),
            'queryParams' => request()->query() ?: null,
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Project/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();

        $imageName =  $request->file('image')->getClientOriginalName();
        $filename = pathinfo($imageName, PATHINFO_FILENAME);
        $extension = $request->file('image')->getClientOriginalExtension();

        $data['image_path'] = $filename . '_' . time() . '.' . $extension;

        Storage::disk('local')->putFileAs('public', $request->file('image'), $data['image_path']);

        $data['created_by'] = Auth::user()->id;
        $data['updated_by'] = Auth::user()->id;

        Project::create($data);

        return to_route("project.index")->with('success', 'Project was created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $query = $project->tasks();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "asc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("status")) {
            $query->where("status", request("status"));
        }

        $tasks = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return Inertia::render('Project/Show', [
            'project' => new ProjectResource($project),
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return Inertia::render('Project/Edit', [
            'project' => new ProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $data = $request->validated();

        if ($data['image']) {
            $imageName =  $request->file('image')->getClientOriginalName();
            $filename = pathinfo($imageName, PATHINFO_FILENAME);
            $extension = $request->file('image')->getClientOriginalExtension();

            $data['image_path'] = $filename . '_' . time() . '.' . $extension;

            Storage::disk('public')->delete($project->image_path);

            Storage::disk('local')->putFileAs('public', $request->file('image'), $data['image_path']);
        } else {
            $data['image_path'] = $project->image_path;
        }

        $data['created_by'] = Auth::user()->id;
        $data['updated_by'] = Auth::user()->id;

        $project->update($data);

        return to_route("project.index")->with('success', 'Project was updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return to_route('project.index')->with('success', 'Project was deleted');
    }
}
