<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Student;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    /**
     * Student listing.
     */
    public function index(Request $request)
    {
        $students = Student::with([
            'schoolClass:id,name',
            'section:id,name',
        ])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('admission_no', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('father_name', 'like', "%{$search}%")
                        ->orWhere('guardian_phone', 'like', "%{$search}%");
                });
            })
            ->when($request->class_id, fn ($q, $id) =>
                $q->where('class_id', $id)
            )
            ->when($request->section_id, fn ($q, $id) =>
                $q->where('section_id', $id)
            )
            ->when($request->status, fn ($q, $status) =>
                $q->where('status', $status)
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Students/Index', [
            'students' => $students,
            'classes' => SchoolClass::select('id', 'name')->get(),
            'sections' => Section::select('id', 'class_id', 'name')->get(),
            'filters' => $request->only([
                'search',
                'class_id',
                'section_id',
                'status',
            ]),
        ]);
    }

    /**
     * Admission form.
     */
    public function create()
    {
        return inertia('Students/Create', [
            'classes' => SchoolClass::select('id', 'name')->get(),
            'sections' => Section::select('id', 'class_id', 'name')->get(),
            'nextAdmissionNo' => $this->generateAdmissionNo(),
        ]);
    }

    /**
     * Store new student.
     */
    public function store(Request $request)
    {
        $validated = $this->validateStudent($request);
        unset($validated['remove_photo']);
        DB::transaction(function () use ($request, &$validated) {

            if (empty($validated['admission_no'])) {
                $validated['admission_no'] = $this->generateAdmissionNo();
            }

            if ($request->hasFile('photo')) {
                $validated['photo'] = $request->file('photo')
                    ->store('students', 'public');
            }

            Student::create($validated);
        });

        return redirect()
            ->route('students.index')
            ->with('success', 'Student admitted successfully.');
    }

    /**
     * Student profile.
     */

    public function show(Student $student)
    {
        
        $student->load([
            'schoolClass',
            'section',
            'attendances' => fn ($query) =>
                $query->latest('attendance_date')->limit(20),
        ]);

        return inertia('Students/Show', [
            'student' => $student,
            'photoUrl' => $student->photo
                ? Storage::disk('public')->url($student->photo)
                : null,
        ]);
    }

    /**
     * Edit admission.
     */
    public function edit(Student $student)
    {
        return inertia('Students/Edit', [
            'student' => $student,
            'photoUrl' => $student->photo
                ? Storage::disk('public')->url($student->photo)
                : null,
            'classes' => SchoolClass::select('id', 'name')->get(),
            'sections' => Section::select('id', 'class_id', 'name')->get(),
        ]);
    }

    /**
     * Update student.
     */
    public function update(Request $request, Student $student)
    {
        $validated = $this->validateStudent($request, $student);

        DB::transaction(function () use ($request, $student, &$validated) {

            if ($request->boolean('remove_photo') && $student->photo) {
                Storage::disk('public')->delete($student->photo);
                $validated['photo'] = null;
            }

            if ($request->hasFile('photo')) {

                if ($student->photo) {
                    Storage::disk('public')->delete($student->photo);
                }

                $validated['photo'] = $request->file('photo')
                    ->store('students', 'public');
            }
            
            unset($validated['remove_photo']);
            $student->update($validated);
        });

        return redirect()
            ->route('students.index')
            ->with('success', 'Student information updated successfully.');
    }

    /**
     * Delete student.
     */
    public function destroy(Student $student)
    {

        $student->delete();

        return redirect()
            ->route('students.index')
            ->with('success', 'Student deleted successfully.');
    }

    /**
     * Validate admission information.
     */
    private function validateStudent(
        Request $request,
        ?Student $student = null
    ): array {
        return $request->validate([
            'admission_no' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('students', 'admission_no')
                    ->ignore($student?->id),
            ],

            'admission_date' => ['required', 'date'],

            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['nullable', 'string', 'max:100'],
            'father_name' => ['nullable', 'string', 'max:150'],

            'gender' => [
                'required',
                Rule::in(['male', 'female', 'other']),
            ],

            'date_of_birth' => ['nullable', 'date', 'before:today'],

            'blood_group' => [
                'nullable',
                Rule::in([
                    'A+', 'A-', 'B+', 'B-',
                    'AB+', 'AB-', 'O+', 'O-',
                ]),
            ],

            'class_id' => [
                'required',
                'exists:school_classes,id',
            ],

            'section_id' => [
                'required',
                Rule::exists('sections', 'id')
                    ->where('class_id', $request->class_id),
            ],

            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:150'],
            'address' => ['nullable', 'string'],

            'guardian_name' => ['required', 'string', 'max:150'],
            'guardian_relation' => ['required', 'string', 'max:50'],
            'guardian_phone' => ['required', 'string', 'max:30'],
            'guardian_cnic' => ['nullable', 'string', 'max:20'],
            'guardian_occupation' => ['nullable', 'string', 'max:100'],
            'guardian_email' => ['nullable', 'email', 'max:150'],
            'guardian_address' => ['nullable', 'string'],

            'photo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                    'graduated',
                    'transferred',
                ]),
            ],

            'remove_photo' => ['nullable', 'boolean'],
        ]);
    }

    /**
     * Generate admission number.
     */
    private function generateAdmissionNo(): string
    {
        do {
            $number = 'STU-' . date('Y') . '-' .
                str_pad((string) random_int(1, 99999), 5, '0', STR_PAD_LEFT);
        } while (Student::where('admission_no', $number)->exists());

        return $number;
    }
}