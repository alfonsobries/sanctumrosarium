<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\MysterySet;
use App\Enums\PrayerKind;
use App\Models\Prayer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Prayer>
 */
class PrayerFactory extends Factory
{
    public function definition(): array
    {
        $started = fake()->dateTimeBetween('-30 days');

        return [
            'id' => fake()->uuid(),
            'user_id' => User::factory(),
            'kind' => PrayerKind::Rosary,
            'mystery_set' => fake()->randomElement(MysterySet::cases()),
            'locale' => 'es-MX',
            'prayed_on' => $started->format('Y-m-d'),
            'started_at' => $started,
            'completed_at' => (clone $started)->modify('+20 minutes'),
            'decades' => 5,
            'duration_seconds' => 1200,
            'client_updated_at' => $started,
        ];
    }
}
