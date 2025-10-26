<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FactorRiesgo extends Model
{
    use HasFactory;

    protected $table = 'factores_riesgo';

    protected $fillable = [
        'nombre',
        'categoria',
    ];

    public function alumnosFactores(): HasMany
    {
        return $this->hasMany(AlumnoFactor::class, 'factor_id');
    }
}
