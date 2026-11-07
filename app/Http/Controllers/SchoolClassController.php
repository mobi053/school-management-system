<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SchoolClassController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $schoolClasses = SchoolClass::withCount('sections')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('SchoolClasses/Index', [
            'schoolClasses' => $schoolClasses,
            'activeClasses' => SchoolClass::where('status', 'active')->count(),
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
        
    }

    public function create()
    {
        return Inertia::render('SchoolClasses/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:school_classes,name',
            ],
            'status' => [
                'required',
                Rule::in(['active', 'inactive']),
            ],
        ]);

        SchoolClass::create($validated);

        return redirect()
            ->route('school-classes.index')
            ->with('success', 'School class created successfully.');
    }

    public function edit(SchoolClass $schoolClass)
    {
        return Inertia::render('SchoolClasses/Edit', [
            'schoolClass' => $schoolClass,
        ]);
    }

    public function update(Request $request, SchoolClass $schoolClass)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('school_classes', 'name')
                    ->ignore($schoolClass->id),
            ],
            'status' => [
                'required',
                Rule::in(['active', 'inactive']),
            ],
        ]);

        $schoolClass->update($validated);

        return redirect()
            ->route('school-classes.index')
            ->with('success', 'School class updated successfully.');
    }

    public function destroy(SchoolClass $schoolClass)
    {
        if ($schoolClass->sections()->exists()) {
            return redirect()
                ->route('school-classes.index')
                ->with('error', 'This class cannot be deleted because it has associated sections.');
        }

        $schoolClass->delete();

        return redirect()
            ->route('school-classes.index')
            ->with('success', 'School class deleted successfully.');
    }
}

