<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AlumnoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('alumno')?->id ?? null;

        return [
            'usuario_id' => ['nullable', 'integer', 'exists:usuarios,id', Rule::unique('alumnos', 'usuario_id')->ignore($id)],
            'carrera_id' => ['required', 'integer', 'exists:carreras,id'],
            'matricula' => ['required', 'string', 'max:50', Rule::unique('alumnos', 'matricula')->ignore($id)],
            'nombre' => ['required', 'string', 'max:100'],
            'apellido_paterno' => ['required', 'string', 'max:100'],
            'apellido_materno' => ['nullable', 'string', 'max:100'],
            'semestre' => ['required', 'integer'],
            'genero' => ['nullable', Rule::in(['masculino', 'femenino', 'otro'])],
            'modalidad' => ['nullable', Rule::in(['presencial', 'virtual', 'híbrida'])],
        ];
    }
}
