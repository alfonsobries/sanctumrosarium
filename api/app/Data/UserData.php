<?php

declare(strict_types=1);

namespace App\Data;

use App\Enums\Locale;
use App\Models\User;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class UserData extends Data
{
    /**
     * @param  array<string, mixed>  $preferences
     */
    public function __construct(
        public int $id,
        public ?string $name,
        public ?string $email,
        public bool $anonymous,
        public bool $apple,
        public bool $google,
        public Locale $locale,
        public array $preferences,
    ) {}

    public static function fromModel(User $user): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            anonymous: $user->isAnonymous(),
            apple: $user->apple_id !== null,
            google: $user->google_id !== null,
            locale: $user->locale,
            preferences: $user->preferences ?? [],
        );
    }
}
