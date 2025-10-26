<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MateriaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('materia')?->id ?? null;

        return [
            'nombre' => ['required', 'string', 'max:255'],
            'codigo_materia' => ['nullable', 'string', 'max:50', Rule::unique('materias', 'codigo_materia')->ignore($id)],
            'creditos' => ['nullable', 'integer'],
        ];
    }
}
