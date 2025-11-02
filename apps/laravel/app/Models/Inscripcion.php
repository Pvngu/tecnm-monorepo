<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\LogsActivity;

class Inscripcion extends Model
{
    use HasFactory, LogsActivity;

    protected $table = 'inscripciones';

    protected $fillable = [
        'alumno_id',
        'grupo_id',
        'calificacion_final',
    ];

    protected $casts = [
        'calificacion_final' => 'decimal:2',
    ];

    public function alumno(): BelongsTo
    {
        return $this->belongsTo(Alumno::class);
    }

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class);
    }

    public function calificaciones(): HasMany
    {
        return $this->hasMany(Calificacion::class);
    }

    public function asistencias(): HasMany
    {
        return $this->hasMany(Asistencia::class);
    }

    public function alumnosFactores(): HasMany
    {
        return $this->hasMany(AlumnoFactor::class);
    }

    public function factores(): HasMany
    {
        return $this->hasMany(AlumnoFactor::class);
    }
}
