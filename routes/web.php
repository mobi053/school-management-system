<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentAttendanceController;
use App\Http\Controllers\SchoolClassController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Student Management
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // Admissions and attendance must come before resource routes.
    Route::get('/students/admissions', [StudentController::class, 'create'])
        ->name('students.admissions');
    Route::get('/students/attendance', [StudentAttendanceController::class, 'index'])
        ->name('students.attendance');
    Route::post('/students/attendance', [StudentAttendanceController::class, 'store'])
        ->name('students.attendance.store');
    // Student CRUD
    Route::resource('students', StudentController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    Route::resource('sections', SectionController::class)
        ->except(['show']);
    Route::resource('school-classes', SchoolClassController::class)
        ->except(['show']);
});



require __DIR__.'/auth.php';
