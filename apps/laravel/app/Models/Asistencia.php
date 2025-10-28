<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivity;

class Asistencia extends Model
{
    use HasFactory, LogsActivity;

    protected $table = 'asistencias';

    protected $fillable = [
        'inscripcion_id',
        'fecha',
        'estatus',
    ];

    protected $casts = [
        'fecha' => 'date',
    ];

    public function inscripcion(): BelongsTo
    {
        return $this->belongsTo(Inscripcion::class);
    }
}
