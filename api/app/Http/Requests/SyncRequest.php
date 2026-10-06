<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Locale;
use App\Enums\MysterySet;
use App\Enums\PrayerKind;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class SyncRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'cursor' => ['nullable', 'date'],
            'prayers' => ['present', 'array', 'max:500'],
            'prayers.*.id' => ['required', 'uuid'],
            'prayers.*.kind' => ['required', Rule::enum(PrayerKind::class)],
            'prayers.*.mysterySet' => ['required', Rule::enum(MysterySet::class)],
            'prayers.*.locale' => ['required', Rule::enum(Locale::class)],
            'prayers.*.prayedOn' => ['required', 'date_format:Y-m-d'],
            'prayers.*.startedAt' => ['required', 'date'],
            'prayers.*.completedAt' => ['nullable', 'date'],
            'prayers.*.decades' => ['required', 'integer', 'between:0,5'],
            'prayers.*.durationSeconds' => ['required', 'integer', 'between:0,86400'],
            'prayers.*.readings' => ['nullable', 'array', 'max:20'],
            'prayers.*.readings.*' => ['string', 'max:40'],
            'prayers.*.clientUpdatedAt' => ['required', 'date'],
            'prayers.*.deletedAt' => ['nullable', 'date'],
        ];
    }
}
