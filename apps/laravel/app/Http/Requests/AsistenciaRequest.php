<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AsistenciaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('asistencia')?->id ?? null;
        $inscripcionId = $this->input('inscripcion_id');

        return [
            'inscripcion_id' => ['required', 'integer', 'exists:inscripciones,id'],
            'fecha' => [
                'required',
                'date',
                Rule::unique('asistencias', 'fecha')
                    ->ignore($id)
                    ->where(fn ($q) => $q->where('inscripcion_id', $inscripcionId)),
            ],
            'estatus' => ['required', Rule::in(['presente', 'ausente', 'retardo'])],
        ];
    }
}
