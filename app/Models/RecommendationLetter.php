<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecommendationLetter extends Model
{
    use HasFactory;

    protected $fillable = [
        'recommendation_request_id',
        'file_path',
        'mention_used',
        'generated_at',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
    ];

    public function recommendationRequest(): BelongsTo
    {
        return $this->belongsTo(RecommendationRequest::class);
    }
}