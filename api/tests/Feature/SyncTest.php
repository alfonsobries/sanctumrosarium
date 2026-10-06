<?php

declare(strict_types=1);

use App\Models\Prayer;
use App\Models\User;
use Illuminate\Support\Str;

function prayerPayload(array $overrides = []): array
{
    return [
        'id' => (string) Str::uuid(),
        'kind' => 'rosary',
        'mysterySet' => 'sorrowful',
        'locale' => 'es-MX',
        'prayedOn' => '2026-10-06',
        'startedAt' => '2026-10-07T04:30:00Z',
        'completedAt' => '2026-10-07T04:52:00Z',
        'decades' => 5,
        'durationSeconds' => 1320,
        'readings' => ['agony-in-the-garden' => 'Lk 22:39-46'],
        'clientUpdatedAt' => '2026-10-07T04:52:00.000Z',
        'deletedAt' => null,
        ...$overrides,
    ];
}

beforeEach(function (): void {
    $this->user = User::factory()->create();
    $this->withToken($this->user->createToken('iPhone')->plainTextToken);
});

it('stores prayers pushed from the device with their local date', function (): void {
    $payload = prayerPayload();

    $this->postJson(route('api.sync'), ['prayers' => [$payload]])
        ->assertOk()
        ->assertJsonPath('prayers.0.id', $payload['id'])
        ->assertJsonPath('prayers.0.prayedOn', '2026-10-06')
        ->assertJsonPath('prayers.0.readings.agony-in-the-garden', 'Lk 22:39-46');

    expect($this->user->prayers()->count())->toBe(1);
});

it('is idempotent when the same push is replayed', function (): void {
    $payload = prayerPayload();

    $this->postJson(route('api.sync'), ['prayers' => [$payload]])->assertOk();
    $this->postJson(route('api.sync'), ['prayers' => [$payload]])->assertOk();

    expect($this->user->prayers()->count())->toBe(1);
});

it('keeps the newest edit when two devices disagree', function (): void {
    $payload = prayerPayload(['decades' => 3, 'clientUpdatedAt' => '2026-10-07T05:00:00Z']);
    $this->postJson(route('api.sync'), ['prayers' => [$payload]]);

    $stale = [...$payload, 'decades' => 1, 'clientUpdatedAt' => '2026-10-07T04:00:00Z'];
    $this->postJson(route('api.sync'), ['prayers' => [$stale]]);

    expect($this->user->prayers()->first()->decades)->toBe(3);

    $newer = [...$payload, 'decades' => 5, 'clientUpdatedAt' => '2026-10-07T06:00:00Z'];
    $this->postJson(route('api.sync'), ['prayers' => [$newer]]);

    expect($this->user->prayers()->first()->decades)->toBe(5);
});

it('propagates deletions as tombstones', function (): void {
    $payload = prayerPayload();
    $this->postJson(route('api.sync'), ['prayers' => [$payload]]);

    $this->postJson(route('api.sync'), ['prayers' => [[
        ...$payload,
        'deletedAt' => '2026-10-08T10:00:00Z',
        'clientUpdatedAt' => '2026-10-08T10:00:00Z',
    ]]])->assertOk();

    expect($this->user->prayers()->count())->toBe(0);

    $this->postJson(route('api.sync'), ['prayers' => []])
        ->assertJsonPath('prayers.0.deletedAt', '2026-10-08T10:00:00Z');
});

it('returns only what changed since the cursor', function (): void {
    Prayer::factory()->for($this->user)->create(['updated_at' => now()->subDay()]);
    $fresh = Prayer::factory()->for($this->user)->create();

    $this->postJson(route('api.sync'), ['prayers' => [], 'cursor' => now()->subHour()->toIso8601ZuluString()])
        ->assertOk()
        ->assertJsonCount(1, 'prayers')
        ->assertJsonPath('prayers.0.id', $fresh->id);
});

it('never touches prayers of another person', function (): void {
    $other = Prayer::factory()->create(['decades' => 2]);

    $this->postJson(route('api.sync'), ['prayers' => [prayerPayload([
        'id' => $other->id,
        'decades' => 5,
        'clientUpdatedAt' => now()->addDay()->toIso8601ZuluString(),
    ])]])->assertOk()->assertJsonCount(0, 'prayers');

    expect($other->refresh()->decades)->toBe(2)
        ->and($other->user_id)->not->toBe($this->user->id);
});

it('validates the payload', function (): void {
    $this->postJson(route('api.sync'), ['prayers' => [prayerPayload(['decades' => 9, 'mysterySet' => 'happy'])]])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['prayers.0.decades', 'prayers.0.mysterySet']);
});

it('requires a token', function (): void {
    $this->withoutToken()->postJson(route('api.sync'), ['prayers' => []])->assertUnauthorized();
});
