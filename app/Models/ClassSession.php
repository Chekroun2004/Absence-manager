<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassSession extends Model
{
    protected $fillable = [
        'module_id',
        'code',
        'professor_id',
        'started_at',
        'expires_at',
        'status',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}