<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\LogsActivity;

class Materia extends Model
{
    use HasFactory, LogsActivity;

    protected $table = 'materias';

    protected $fillable = [
        'nombre',
        'codigo_materia',
        'creditos',
    ];

    public function unidades(): HasMany
    {
        return $this->hasMany(Unidad::class);
    }

    public function grupos(): HasMany
    {
        return $this->hasMany(Grupo::class);
    }
}
