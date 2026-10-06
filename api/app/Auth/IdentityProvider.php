<?php

declare(strict_types=1);

namespace App\Auth;

enum IdentityProvider: string
{
    case Apple = 'apple';
    case Google = 'google';

    public function keysUrl(): string
    {
        return match ($this) {
            self::Apple => 'https://appleid.apple.com/auth/keys',
            self::Google => 'https://www.googleapis.com/oauth2/v3/certs',
        };
    }

    /** @return list<string> */
    public function issuers(): array
    {
        return match ($this) {
            self::Apple => ['https://appleid.apple.com'],
            self::Google => ['https://accounts.google.com', 'accounts.google.com'],
        };
    }

    /** @return list<string> */
    public function audiences(): array
    {
        /** @var list<string> $audiences */
        $audiences = config("services.{$this->value}.client_ids", []);

        return $audiences;
    }

    public function column(): string
    {
        return "{$this->value}_id";
    }
}
