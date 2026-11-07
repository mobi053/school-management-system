<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Student;
use App\Models\StudentAttendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StudentAttendanceController extends Controller
{
    /**
     * Attendance page.
     */
    public function index(Request $request)
    {
        $date = $request->input('date', now()->toDateString());

        $students = Student::with([
            'schoolClass:id,name',
            'section:id,name',
        ])
            ->where('status', 'active')
            ->when($request->class_id, fn ($q, $id) =>
                $q->where('class_id', $id)
            )
            ->when($request->section_id, fn ($q, $id) =>
                $q->where('section_id', $id)
            )
            ->orderBy('first_name')
            ->get();

        $attendance = StudentAttendance::whereDate(
            'attendance_date',
            $date
        )
            ->whereIn('student_id', $students->pluck('id'))
            ->get()
            ->keyBy('student_id');

        $rows = $students->map(function ($student) use ($attendance) {
            $record = $attendance->get($student->id);

            return [
                'id' => $student->id,
                'admission_no' => $student->admission_no,
                'name' => $student->full_name,
                'class' => $student->schoolClass?->name,
                'section' => $student->section?->name,
                'status' => $record?->status,
                'remarks' => $record?->remarks,
            ];
        });

        return inertia('Students/Attendance', [
            'students' => $rows,
            'classes' => SchoolClass::select('id', 'name')->get(),
            'sections' => Section::select('id', 'class_id', 'name')->get(),
            'filters' => [
                'date' => $date,
                'class_id' => $request->class_id,
                'section_id' => $request->section_id,
            ],
        ]);
    }

    /**
     * Save daily attendance.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],

            'class_id' => ['required', 'exists:classes,id'],

            'section_id' => [
                'required',
                Rule::exists('sections', 'id')
                    ->where('class_id', $request->class_id),
            ],

            'attendance' => ['required', 'array', 'min:1'],

            'attendance.*.student_id' => [
                'required',
                'distinct',
                'exists:students,id',
            ],

            'attendance.*.status' => [
                'required',
                Rule::in(['present', 'absent', 'leave', 'late']),
            ],

            'attendance.*.remarks' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        DB::transaction(function () use ($validated, $request) {

            foreach ($validated['attendance'] as $record) {

                $student = Student::where('id', $record['student_id'])
                    ->where('class_id', $validated['class_id'])
                    ->where('section_id', $validated['section_id'])
                    ->where('status', 'active')
                    ->firstOrFail();

                StudentAttendance::updateOrCreate(
                    [
                        'student_id' => $student->id,
                        'attendance_date' => $validated['date'],
                    ],
                    [
                        'status' => $record['status'],
                        'remarks' => $record['remarks'] ?? null,
                        'marked_by' => $request->user()->id,
                    ]
                );
            }
        });

        return back()->with(
            'success',
            'Student attendance saved successfully.'
        );
    }
}