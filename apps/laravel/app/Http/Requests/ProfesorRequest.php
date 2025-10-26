<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfesorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('profesor')?->id ?? null;

        return [
            'usuario_id' => ['nullable', 'integer', 'exists:usuarios,id', Rule::unique('profesores', 'usuario_id')->ignore($id)],
            'nombre' => ['required', 'string', 'max:100'],
            'apellido_paterno' => ['required', 'string', 'max:100'],
            'apellido_materno' => ['nullable', 'string', 'max:100'],
            'rfc' => ['nullable', 'string', 'max:13', Rule::unique('profesores', 'rfc')->ignore($id)],
        ];
    }
}
