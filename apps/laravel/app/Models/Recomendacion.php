<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Recomendacion extends Model
{
    protected $table = 'recomendaciones';

    protected $fillable = [
        'factor_riesgo_id',
        'titulo',
        'descripcion',
        'nivel',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Obtener el factor de riesgo asociado a esta recomendación.
     */
    public function factorRiesgo(): BelongsTo
    {
        return $this->belongsTo(FactorRiesgo::class);
    }
}
