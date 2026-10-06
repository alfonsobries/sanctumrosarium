<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'apple_id' => fake()->unique()->uuid(),
            'locale' => 'es-MX',
        ];
    }

    public function anonymous(): static
    {
        return $this->state(fn (): array => [
            'name' => null,
            'email' => null,
            'apple_id' => null,
            'anonymous_at' => now(),
        ]);
    }
}
