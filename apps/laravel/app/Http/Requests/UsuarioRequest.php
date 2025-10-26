<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('usuario')?->id ?? null;

        return [
            'email' => ['required', 'email', 'max:255', Rule::unique('usuarios', 'email')->ignore($id)],
            'password_hash' => [$this->isMethod('post') ? 'required' : 'sometimes', 'string', 'min:8'],
            'rol' => ['required', Rule::in(['admin', 'profesor', 'alumno'])],
        ];
    }
}
