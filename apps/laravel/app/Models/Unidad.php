<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unidad extends Model
{
    use HasFactory;

    protected $table = 'unidades';

    protected $fillable = [
        'materia_id',
        'numero_unidad',
        'nombre_unidad',
    ];

    public function materia(): BelongsTo
    {
        return $this->belongsTo(Materia::class);
    }

    public function calificaciones(): HasMany
    {
        return $this->hasMany(Calificacion::class);
    }
}
