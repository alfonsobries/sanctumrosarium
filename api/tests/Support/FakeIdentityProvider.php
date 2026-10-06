<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Auth\IdentityProvider;
use Illuminate\Support\Facades\Http;
use Jose\Component\Core\AlgorithmManager;
use Jose\Component\Core\JWK;
use Jose\Component\KeyManagement\JWKFactory;
use Jose\Component\Signature\Algorithm\RS256;
use Jose\Component\Signature\JWSBuilder;
use Jose\Component\Signature\Serializer\CompactSerializer;

/**
 * Stands in for Apple's or Google's key server and mints identity tokens signed with a
 * throwaway key, so the real verifier runs end to end.
 */
final class FakeIdentityProvider
{
    private JWK $key;

    public function __construct(private readonly IdentityProvider $provider)
    {
        $this->key = JWKFactory::createRSAKey(2048, ['alg' => 'RS256', 'use' => 'sig', 'kid' => 'test']);

        Http::fake([
            $provider->keysUrl() => Http::response(['keys' => [$this->key->toPublic()->all()]]),
        ]);
    }

    /**
     * @param  array<string, mixed>  $claims
     */
    public function token(array $claims = [], bool $forged = false): string
    {
        $key = $forged
            ? JWKFactory::createRSAKey(2048, ['alg' => 'RS256', 'use' => 'sig', 'kid' => 'test'])
            : $this->key;

        $payload = [
            'iss' => $this->provider->issuers()[0],
            'aud' => $this->provider->audiences()[0] ?? 'missing',
            'sub' => 'subject-1',
            'email' => 'maria@example.com',
            'iat' => time(),
            'exp' => time() + 600,
            ...$claims,
        ];

        $jws = (new JWSBuilder(new AlgorithmManager([new RS256])))
            ->create()
            ->withPayload(json_encode($payload, JSON_THROW_ON_ERROR))
            ->addSignature($key, ['alg' => 'RS256', 'kid' => 'test'])
            ->build();

        return (new CompactSerializer)->serialize($jws, 0);
    }
}
