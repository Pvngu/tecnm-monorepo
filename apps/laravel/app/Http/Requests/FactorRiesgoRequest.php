<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FactorRiesgoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'categoria' => ['required', Rule::in(['académicos', 'psicosociales', 'económicos', 'institucionales', 'tecnológicos', 'contextuales'])],
        ];
    }
}
