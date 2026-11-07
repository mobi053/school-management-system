<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_attendances', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();

            $table->date('attendance_date');

            $table->enum('status', [
                'present',
                'absent',
                'leave',
                'late'
            ]);

            $table->text('remarks')->nullable();

            $table->foreignId('marked_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            $table->unique(
                ['student_id', 'attendance_date'],
                'student_attendance_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_attendances');
    }
};