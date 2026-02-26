<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interview extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'applicant_id',
        'interviewer_id',
        'scheduled_at',
        'location',
        'type', // phone, video, in-person
        'status', // scheduled, completed, cancelled
        'feedback',
        'rating',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'feedback' => 'array',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(Applicant::class);
    }

    public function interviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'interviewer_id');
    }
}
