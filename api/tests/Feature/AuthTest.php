<?php

declare(strict_types=1);

use App\Auth\IdentityProvider;
use App\Models\Prayer;
use App\Models\User;
use Tests\Support\FakeIdentityProvider;

beforeEach(function (): void {
    config([
        'services.apple.client_ids' => ['app.sanctamaria'],
        'services.google.client_ids' => ['google-client.apps.googleusercontent.com'],
    ]);
});

it('creates an anonymous account for a device', function (): void {
    $response = $this->postJson(route('api.auth.anonymous'), ['device' => 'iPhone', 'locale' => 'en-US'])
        ->assertCreated()
        ->assertJsonPath('user.anonymous', true)
        ->assertJsonPath('user.locale', 'en-US');

    $this->withToken($response->json('token'))
        ->getJson(route('api.me.show'))
        ->assertOk()
        ->assertJsonPath('anonymous', true);
});

it('turns the anonymous device into the account on first sign in', function (): void {
    $fake = new FakeIdentityProvider(IdentityProvider::Apple);
    $anonymous = User::factory()->anonymous()->create();
    Prayer::factory()->for($anonymous)->count(2)->create();
    $token = $anonymous->createToken('iPhone')->plainTextToken;

    $this->withToken($token)
        ->postJson(route('api.auth.identity', 'apple'), [
            'identityToken' => $fake->token(),
            'device' => 'iPhone',
            'name' => 'María',
        ])
        ->assertOk()
        ->assertJsonPath('user.anonymous', false)
        ->assertJsonPath('user.apple', true)
        ->assertJsonPath('user.name', 'María');

    expect(User::query()->count())->toBe(1)
        ->and($anonymous->refresh()->apple_id)->toBe('subject-1')
        ->and($anonymous->prayers()->count())->toBe(2);
});

it('merges the anonymous history into an existing account', function (): void {
    $fake = new FakeIdentityProvider(IdentityProvider::Google);
    $account = User::factory()->create(['google_id' => 'subject-1', 'apple_id' => null]);
    Prayer::factory()->for($account)->create();
    $anonymous = User::factory()->anonymous()->create();
    Prayer::factory()->for($anonymous)->count(3)->create();

    $this->withToken($anonymous->createToken('Pixel')->plainTextToken)
        ->postJson(route('api.auth.identity', 'google'), [
            'identityToken' => $fake->token(),
            'device' => 'Pixel',
        ])
        ->assertOk()
        ->assertJsonPath('user.id', $account->id);

    expect($account->prayers()->count())->toBe(4)
        ->and(User::query()->find($anonymous->id))->toBeNull();
});

it('links a provider to the account that already has the same email', function (): void {
    $fake = new FakeIdentityProvider(IdentityProvider::Google);
    $account = User::factory()->create(['email' => 'maria@example.com']);

    $this->postJson(route('api.auth.identity', 'google'), [
        'identityToken' => $fake->token(),
        'device' => 'Pixel',
    ])->assertOk()->assertJsonPath('user.id', $account->id)->assertJsonPath('user.google', true);
});

it('rejects identity tokens meant for another app', function (): void {
    $fake = new FakeIdentityProvider(IdentityProvider::Apple);

    $this->postJson(route('api.auth.identity', 'apple'), [
        'identityToken' => $fake->token(['aud' => 'com.someone.else']),
        'device' => 'iPhone',
    ])->assertUnprocessable()->assertJsonValidationErrors('identityToken');

    expect(User::query()->count())->toBe(0);
});

it('rejects expired identity tokens', function (): void {
    $fake = new FakeIdentityProvider(IdentityProvider::Apple);

    $this->postJson(route('api.auth.identity', 'apple'), [
        'identityToken' => $fake->token(['exp' => time() - 3600, 'iat' => time() - 7200]),
        'device' => 'iPhone',
    ])->assertUnprocessable();
});

it('rejects tokens from an unknown signer', function (): void {
    $fake = new FakeIdentityProvider(IdentityProvider::Apple);
    $token = $fake->token(forged: true);

    $this->postJson(route('api.auth.identity', 'apple'), [
        'identityToken' => $token,
        'device' => 'iPhone',
    ])->assertUnprocessable();
});

it('signs out only the current device', function (): void {
    $user = User::factory()->create();
    $phone = $user->createToken('iPhone')->plainTextToken;
    $user->createToken('Watch');

    $this->withToken($phone)->deleteJson(route('api.auth.logout'))->assertNoContent();

    expect($user->tokens()->pluck('name')->all())->toBe(['Watch']);
});

it('deletes the account with its history', function (): void {
    $user = User::factory()->create();
    Prayer::factory()->for($user)->count(2)->create();

    $this->withToken($user->createToken('iPhone')->plainTextToken)
        ->deleteJson(route('api.me.destroy'))
        ->assertNoContent();

    expect(User::query()->count())->toBe(0)
        ->and(Prayer::query()->withTrashed()->count())->toBe(0);
});

it('merges preferences instead of replacing them', function (): void {
    $user = User::factory()->create(['preferences' => ['skin' => 'manuscript', 'audio' => true]]);

    $this->withToken($user->createToken('iPhone')->plainTextToken)
        ->patchJson(route('api.me.update'), ['locale' => 'la', 'preferences' => ['audio' => false]])
        ->assertOk()
        ->assertJsonPath('locale', 'la')
        ->assertJsonPath('preferences', ['skin' => 'manuscript', 'audio' => false]);
});
