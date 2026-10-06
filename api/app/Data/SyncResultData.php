<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class SyncResultData extends Data
{
    /**
     * @param  list<PrayerData>  $prayers  every prayer changed on the server after the client's cursor
     */
    public function __construct(
        #[DataCollectionOf(PrayerData::class)]
        public array $prayers,
        public string $cursor,
    ) {}
}
