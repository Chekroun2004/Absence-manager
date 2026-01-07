<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class RecommendationRequest extends Model
{
    use HasFactory;

    protected $fillable = [ 
        'student_id',
        'professor_id',
        'mention',
        'status',
        'rejection_reason',
        'responded_at',
    ];

    protected $casts = [
        'responded_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function professor(): BelongsTo
    {
        return $this->belongsTo(Professor::class);
    }

    // ✅ CORRIGER : Spécifier la clé étrangère exacte
    public function letter(): HasOne
    {
        return $this->hasOne(RecommendationLetter::class, 'recommendation_request_id');
    }
}