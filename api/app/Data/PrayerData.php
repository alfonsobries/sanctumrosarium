<?php

declare(strict_types=1);

namespace App\Data;

use App\Enums\Locale;
use App\Enums\MysterySet;
use App\Enums\PrayerKind;
use App\Models\Prayer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class PrayerData extends Data
{
    /**
     * @param  array<string, string>|null  $readings  mystery id => scripture reference read
     */
    public function __construct(
        public string $id,
        public PrayerKind $kind,
        public MysterySet $mysterySet,
        public Locale $locale,
        public string $prayedOn,
        public string $startedAt,
        public ?string $completedAt,
        public int $decades,
        public int $durationSeconds,
        public ?array $readings,
        public string $clientUpdatedAt,
        public ?string $deletedAt,
    ) {}

    public static function fromModel(Prayer $prayer): self
    {
        return new self(
            id: $prayer->id,
            kind: $prayer->kind,
            mysterySet: $prayer->mystery_set,
            locale: $prayer->locale,
            prayedOn: $prayer->prayed_on->toDateString(),
            startedAt: $prayer->started_at->toIso8601ZuluString(),
            completedAt: $prayer->completed_at?->toIso8601ZuluString(),
            decades: $prayer->decades,
            durationSeconds: $prayer->duration_seconds,
            readings: $prayer->readings,
            clientUpdatedAt: $prayer->client_updated_at->toIso8601ZuluString('millisecond'),
            deletedAt: $prayer->deleted_at?->toIso8601ZuluString(),
        );
    }
}
