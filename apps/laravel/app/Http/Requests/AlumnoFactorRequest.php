<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AlumnoFactorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('alumno_factor')?->id ?? null;
        $inscripcionId = $this->input('inscripcion_id');

        return [
            'inscripcion_id' => ['required', 'integer', 'exists:inscripciones,id'],
            'factor_id' => [
                'required',
                'integer',
                'exists:factores_riesgo,id',
                Rule::unique('alumnos_factores', 'factor_id')
                    ->ignore($id)
                    ->where(fn ($q) => $q->where('inscripcion_id', $inscripcionId)),
            ],
            'fecha_registro' => ['sometimes', 'date'],
            'observaciones' => ['nullable', 'string'],
        ];
    }
}
