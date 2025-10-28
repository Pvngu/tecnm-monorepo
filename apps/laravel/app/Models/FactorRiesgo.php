<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\LogsActivity;

class FactorRiesgo extends Model
{
    use HasFactory, LogsActivity;

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
