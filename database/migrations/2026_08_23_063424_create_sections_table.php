<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();

            $table->foreignId('class_id')
                ->constrained('school_classes')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('name', 100);
            $table->unsignedInteger('capacity')->default(40);

            $table->enum('status', ['active', 'inactive'])
                ->default('active');

            $table->timestamps();

            // Section name must be unique within each class.
            $table->unique(['class_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};