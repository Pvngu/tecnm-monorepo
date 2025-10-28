<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\LogsActivity;

class Alumno extends Model
{
    use HasFactory, LogsActivity;
    

    protected $table = 'alumnos';

    protected $fillable = [
        'usuario_id',
        'carrera_id',
        'matricula',
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'semestre',
        'genero',
        'modalidad',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function carrera(): BelongsTo
    {
        return $this->belongsTo(Carrera::class);
    }

    public function inscripciones(): HasMany
    {
        return $this->hasMany(Inscripcion::class);
    }
}
