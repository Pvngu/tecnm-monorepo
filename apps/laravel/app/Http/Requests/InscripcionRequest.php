<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InscripcionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('inscripcion')?->id ?? null;
        $alumnoId = $this->input('alumno_id');
        $grupoId = $this->input('grupo_id');

        return [
            'alumno_id' => ['required', 'integer', 'exists:alumnos,id'],
            'grupo_id' => [
                'required',
                'integer',
                'exists:grupos,id',
                Rule::unique('inscripciones')
                    ->ignore($id)
                    ->where(fn ($q) => $q->where('alumno_id', $alumnoId)),
            ],
            'calificacion_final' => ['nullable', 'numeric', 'between:0,100'],
        ];
    }
}
