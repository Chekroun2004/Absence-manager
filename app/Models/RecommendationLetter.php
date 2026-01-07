<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecommendationLetter extends Model
{
    use HasFactory;

    protected $fillable = [
        'recommendation_request_id',  // ✅ Utiliser le vrai nom
        'file_path',
        'mention_used',
        'generated_at',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
    ];

    // ✅ CORRIGER : Spécifier la clé étrangère exacte
    public function request(): BelongsTo
    {
        return $this->belongsTo(RecommendationRequest::class, 'recommendation_request_id');
    }
}