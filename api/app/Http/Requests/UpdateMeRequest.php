<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Locale;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateMeRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'nullable', 'string', 'max:120'],
            'locale' => ['sometimes', Rule::enum(Locale::class)],
            'preferences' => ['sometimes', 'array'],
            'preferences.voice' => ['sometimes', 'string', 'max:40'],
            'preferences.skin' => ['sometimes', 'string', 'max:40'],
            'preferences.gospel' => ['sometimes', Rule::in(['rotate', 'matthew', 'mark', 'luke', 'john'])],
            'preferences.audio' => ['sometimes', 'boolean'],
            'preferences.pauseSeconds' => ['sometimes', 'integer', 'between:0,60'],
            'preferences.form' => ['sometimes', 'string', 'max:40'],
        ];
    }
}
