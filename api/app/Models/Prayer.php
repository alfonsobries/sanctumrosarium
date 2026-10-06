<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Locale;
use App\Enums\MysterySet;
use App\Enums\PrayerKind;
use Database\Factories\PrayerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property int $user_id
 * @property PrayerKind $kind
 * @property MysterySet $mystery_set
 * @property Locale $locale
 * @property Carbon $prayed_on
 * @property Carbon $started_at
 * @property Carbon|null $completed_at
 * @property int $decades
 * @property int $duration_seconds
 * @property array<string, string>|null $readings
 * @property Carbon $client_updated_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'id', 'kind', 'mystery_set', 'locale', 'prayed_on', 'started_at', 'completed_at',
    'decades', 'duration_seconds', 'readings', 'client_updated_at', 'deleted_at',
])]
class Prayer extends Model
{
    /** @use HasFactory<PrayerFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function casts(): array
    {
        return [
            'kind' => PrayerKind::class,
            'mystery_set' => MysterySet::class,
            'locale' => Locale::class,
            'prayed_on' => 'date',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'client_updated_at' => 'datetime',
            'readings' => 'array',
        ];
    }
}
