<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CarreraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('carrera')?->id ?? null;

        return [
            'nombre' => ['required', 'string', 'max:255', Rule::unique('carreras', 'nombre')->ignore($id)],
            'clave' => ['nullable', 'string', 'max:20', Rule::unique('carreras', 'clave')->ignore($id)],
        ];
    }
}
