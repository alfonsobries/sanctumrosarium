<?php

declare(strict_types=1);

namespace App\Auth;

final readonly class VerifiedIdentity
{
    public function __construct(
        public IdentityProvider $provider,
        public string $subject,
        public ?string $email,
    ) {}
}
