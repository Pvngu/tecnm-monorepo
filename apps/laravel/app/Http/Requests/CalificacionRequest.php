<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CalificacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('calificacion')?->id ?? null;
        $inscripcionId = $this->input('inscripcion_id');

        return [
            'inscripcion_id' => ['required', 'integer', 'exists:inscripciones,id'],
            'unidad_id' => [
                'required',
                'integer',
                'exists:unidades,id',
                Rule::unique('calificaciones', 'unidad_id')
                    ->ignore($id)
                    ->where(fn ($q) => $q->where('inscripcion_id', $inscripcionId)),
            ],
            'valor_calificacion' => ['required', 'numeric'],
        ];
    }
}
