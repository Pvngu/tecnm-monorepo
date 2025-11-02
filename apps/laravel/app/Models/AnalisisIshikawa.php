<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalisisIshikawa extends Model
{
    protected $table = 'analisis_ishikawa';

    protected $fillable = [
        'grupo_id',
        'user_id',
        'tasa_reprobacion',
        'observaciones',
    ];

    protected $casts = [
        'observaciones' => 'array',
        'tasa_reprobacion' => 'decimal:2',
    ];

    /**
     * Relación con el grupo
     */
    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class);
    }

    /**
     * Relación con el usuario que realizó el análisis
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
