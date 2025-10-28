<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivity;

class Calificacion extends Model
{
    use HasFactory, LogsActivity;

    protected $table = 'calificaciones';

    protected $fillable = [
        'inscripcion_id',
        'unidad_id',
        'valor_calificacion',
    ];

    protected $casts = [
        'valor_calificacion' => 'decimal:2',
    ];

    public function inscripcion(): BelongsTo
    {
        return $this->belongsTo(Inscripcion::class);
    }

    public function unidad(): BelongsTo
    {
        return $this->belongsTo(Unidad::class);
    }
}
