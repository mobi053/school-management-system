<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();

            // Admission details
            $table->string('admission_no')->unique();
            $table->date('admission_date');

            // Personal information
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('father_name')->nullable();
            $table->enum('gender', ['male', 'female', 'other']);
            $table->date('date_of_birth')->nullable();
            $table->string('blood_group', 5)->nullable();

            // Academic assignment
            $table->foreignId('class_id')
                ->constrained('school_classes')
                ->restrictOnDelete();

            $table->foreignId('section_id')
                ->constrained('sections')
                ->restrictOnDelete();

            // Contact information
            $table->string('phone', 30)->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();

            // Guardian information
            $table->string('guardian_name');
            $table->string('guardian_relation')->default('Father');
            $table->string('guardian_phone', 30);
            $table->string('guardian_cnic', 20)->nullable();
            $table->string('guardian_occupation')->nullable();
            $table->string('guardian_email')->nullable();
            $table->text('guardian_address')->nullable();

            // Photograph
            $table->string('photo')->nullable();

            // Status
            $table->enum('status', [
                'active',
                'inactive',
                'graduated',
                'transferred'
            ])->default('active');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};