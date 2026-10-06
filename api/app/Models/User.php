<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Locale;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property int $id
 * @property string|null $name
 * @property string|null $email
 * @property string|null $apple_id
 * @property string|null $google_id
 * @property Carbon|null $anonymous_at
 * @property Locale $locale
 * @property array<string, mixed>|null $preferences
 */
#[Fillable(['name', 'email', 'apple_id', 'google_id', 'anonymous_at', 'locale', 'preferences'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory;

    /** @return HasMany<Prayer, $this> */
    public function prayers(): HasMany
    {
        return $this->hasMany(Prayer::class);
    }

    public function isAnonymous(): bool
    {
        return $this->anonymous_at !== null;
    }

    protected function casts(): array
    {
        return [
            'anonymous_at' => 'datetime',
            'locale' => Locale::class,
            'preferences' => 'array',
        ];
    }
}
