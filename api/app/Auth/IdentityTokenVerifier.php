<?php

declare(strict_types=1);

namespace App\Auth;

use DateTimeImmutable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Jose\Component\Checker\AudienceChecker;
use Jose\Component\Checker\ClaimCheckerManager;
use Jose\Component\Checker\ExpirationTimeChecker;
use Jose\Component\Checker\IssuedAtChecker;
use Jose\Component\Checker\IssuerChecker;
use Jose\Component\Core\AlgorithmManager;
use Jose\Component\Core\JWKSet;
use Jose\Component\Signature\Algorithm\RS256;
use Jose\Component\Signature\JWSVerifier;
use Jose\Component\Signature\Serializer\CompactSerializer;
use Psr\Clock\ClockInterface;
use Throwable;

/**
 * Verifies an OpenID Connect identity token issued by Apple or Google: signature against
 * the provider's published keys, issuer, audience (our own client ids) and lifetime.
 */
class IdentityTokenVerifier
{
    public function verify(IdentityProvider $provider, string $token): VerifiedIdentity
    {
        try {
            $jws = (new CompactSerializer)->unserialize($token);
            $verifier = new JWSVerifier(new AlgorithmManager([new RS256]));

            if (! $verifier->verifyWithKeySet($jws, $this->keys($provider), 0)) {
                throw new InvalidIdentityToken('Signature does not match.');
            }

            /** @var array<string, mixed> $claims */
            $claims = json_decode((string) $jws->getPayload(), true, flags: JSON_THROW_ON_ERROR);

            $clock = new class implements ClockInterface
            {
                public function now(): DateTimeImmutable
                {
                    return new DateTimeImmutable;
                }
            };

            $audiences = $provider->audiences();

            if ($audiences === []) {
                throw new InvalidIdentityToken("No client ids configured for {$provider->value}.");
            }

            $audienceOk = false;
            foreach ($audiences as $audience) {
                try {
                    (new ClaimCheckerManager([new AudienceChecker($audience)]))->check($claims);
                    $audienceOk = true;
                    break;
                } catch (Throwable) {
                    continue;
                }
            }

            if (! $audienceOk) {
                throw new InvalidIdentityToken('Audience does not match.');
            }

            (new ClaimCheckerManager([
                new IssuedAtChecker($clock, 60),
                new ExpirationTimeChecker($clock, 60),
                new IssuerChecker($provider->issuers()),
            ]))->check($claims, ['iss', 'exp', 'sub']);
        } catch (InvalidIdentityToken $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            throw new InvalidIdentityToken($exception->getMessage(), previous: $exception);
        }

        $subject = $claims['sub'] ?? null;
        $email = $claims['email'] ?? null;

        if (! is_string($subject) || $subject === '') {
            throw new InvalidIdentityToken('Missing subject.');
        }

        return new VerifiedIdentity($provider, $subject, is_string($email) && $email !== '' ? $email : null);
    }

    private function keys(IdentityProvider $provider): JWKSet
    {
        $json = Cache::remember(
            "oidc-keys:{$provider->value}",
            now()->addHours(6),
            fn (): string => Http::timeout(5)->get($provider->keysUrl())->throw()->body(),
        );

        return JWKSet::createFromJson($json);
    }
}
