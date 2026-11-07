<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SectionController extends Controller
{
    /**
     * Display sections.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $sections = Section::with([
                'schoolClass:id,name'
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhereHas('schoolClass', function ($classQuery) use ($search) {
                            $classQuery->where(
                                'name',
                                'like',
                                "%{$search}%"
                            );
                        });
                });
            })
            ->when($status && $status !== 'all', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Sections/Index', [
            'sections' => $sections,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show create form.
     */
    public function create(): Response
    {
        return Inertia::render('Sections/Create', [
            'classes' => SchoolClass::orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Store new section.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'class_id' => [
                'required',
                'integer',
                'exists:school_classes,id',
            ],

            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('sections', 'name')
                    ->where('class_id', $request->input('class_id')),
            ],

            'capacity' => [
                'required',
                'integer',
                'min:1',
                'max:1000',
            ],

            'status' => [
                'required',
                Rule::in(['active', 'inactive']),
            ],
        ]);

        Section::create($validated);

        return redirect()
            ->route('sections.index')
            ->with('success', 'Section created successfully.');
    }

    /**
     * Show edit form.
     */
    public function edit(Section $section): Response
    {
        return Inertia::render('Sections/Edit', [
            'section' => $section->load('schoolClass'),
            'classes' => SchoolClass::orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Update section.
     */
    public function update(
        Request $request,
        Section $section
    ): RedirectResponse {
        $validated = $request->validate([
            'class_id' => [
                'required',
                'integer',
                'exists:school_classes,id',
            ],

            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('sections', 'name')
                    ->where('class_id', $request->input('class_id'))
                    ->ignore($section->id),
            ],

            'capacity' => [
                'required',
                'integer',
                'min:1',
                'max:1000',
            ],

            'status' => [
                'required',
                Rule::in(['active', 'inactive']),
            ],
        ]);

        $section->update($validated);

        return redirect()
            ->route('sections.index')
            ->with('success', 'Section updated successfully.');
    }

    /**
     * Delete section.
     */
    public function destroy(Section $section): RedirectResponse
    {
        $section->delete();

        return redirect()
            ->route('sections.index')
            ->with('success', 'Section deleted successfully.');
    }
}