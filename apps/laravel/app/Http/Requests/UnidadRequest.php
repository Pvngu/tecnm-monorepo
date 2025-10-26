<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UnidadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('unidad')?->id ?? null;
        $materiaId = $this->input('materia_id');

        return [
            'materia_id' => ['required', 'integer', 'exists:materias,id'],
            'numero_unidad' => [
                'required',
                'integer',
                Rule::unique('unidades', 'numero_unidad')
                    ->ignore($id)
                    ->where(fn ($q) => $q->where('materia_id', $materiaId)),
            ],
            'nombre_unidad' => ['nullable', 'string', 'max:255'],
        ];
    }
}
