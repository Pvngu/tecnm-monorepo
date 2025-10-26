<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Profesor extends Model
{
    use HasFactory;

    protected $table = 'profesores';

    protected $fillable = [
        'usuario_id',
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'rfc',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }

    public function grupos(): HasMany
    {
        return $this->hasMany(Grupo::class);
    }
}
