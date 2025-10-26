<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Carrera extends Model
{
    use HasFactory;

    protected $table = 'carreras';

    protected $fillable = [
        'nombre',
        'clave',
    ];

    public function alumnos(): HasMany
    {
        return $this->hasMany(Alumno::class);
    }

    public function grupos(): HasMany
    {
        return $this->hasMany(Grupo::class);
    }
}
