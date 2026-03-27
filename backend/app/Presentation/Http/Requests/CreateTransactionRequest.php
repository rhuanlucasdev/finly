<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type'        => ['required', 'in:income,expense'],
            'amount'      => ['required', 'numeric', 'min:0.01'],
            'description' => ['required', 'string', 'max:255'],
            'category'    => ['required', 'string', 'max:100'],
            'date'        => ['required', 'date_format:Y-m-d'],
            'notes'       => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required'        => 'O tipo é obrigatório.',
            'type.in'              => 'O tipo deve ser income ou expense.',
            'amount.required'      => 'O valor é obrigatório.',
            'amount.min'           => 'O valor deve ser maior que zero.',
            'description.required' => 'A descrição é obrigatória.',
            'category.required'    => 'A categoria é obrigatória.',
            'date.required'        => 'A data é obrigatória.',
            'date.date_format'     => 'A data deve estar no formato YYYY-MM-DD.',
        ];
    }
}
