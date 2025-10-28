<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivity;

class AlumnoFactor extends Model
{
    use HasFactory, LogsActivity;

    protected $table = 'alumnos_factores';

    protected $fillable = [
        'inscripcion_id',
        'factor_id',
        'fecha_registro',
        'observaciones',
    ];

    protected $casts = [
        'fecha_registro' => 'datetime',
    ];

    public function inscripcion(): BelongsTo
    {
        return $this->belongsTo(Inscripcion::class);
    }

    public function factor(): BelongsTo
    {
        return $this->belongsTo(FactorRiesgo::class, 'factor_id');
    }
}
