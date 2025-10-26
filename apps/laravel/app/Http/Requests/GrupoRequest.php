<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GrupoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'materia_id' => ['required', 'integer', 'exists:materias,id'],
            'profesor_id' => ['required', 'integer', 'exists:profesores,id'],
            'periodo_id' => ['required', 'integer', 'exists:periodos,id'],
            'carrera_id' => ['nullable', 'integer', 'exists:carreras,id'],
            'horario' => ['nullable', 'string'],
            'aula' => ['nullable', 'string', 'max:50'],
        ];
    }
}
