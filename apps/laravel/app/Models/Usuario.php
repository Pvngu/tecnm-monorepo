<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Usuario extends Model
{
    use HasFactory;

    protected $table = 'usuarios';

    protected $hidden = ['password_hash'];

    protected $fillable = [
        'email',
        'password_hash',
        'rol',
    ];

    public function profesor(): HasOne
    {
        return $this->hasOne(Profesor::class);
    }

    public function alumno(): HasOne
    {
        return $this->hasOne(Alumno::class);
    }
}
