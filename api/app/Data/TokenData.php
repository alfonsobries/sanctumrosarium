<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class TokenData extends Data
{
    public function __construct(
        public string $token,
        public UserData $user,
    ) {}
}
