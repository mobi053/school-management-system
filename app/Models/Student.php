<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'admission_no',
        'admission_date',
        'first_name',
        'last_name',
        'father_name',
        'gender',
        'date_of_birth',
        'blood_group',
        'class_id',
        'section_id',
        'phone',
        'email',
        'address',
        'guardian_name',
        'guardian_relation',
        'guardian_phone',
        'guardian_cnic',
        'guardian_occupation',
        'guardian_email',
        'guardian_address',
        'photo',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'admission_date' => 'date',
            'date_of_birth' => 'date',
        ];
    }

    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(StudentAttendance::class);
    }

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }
}