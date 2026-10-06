<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Data\TokenData;
use App\Data\UserData;
use App\Enums\Locale;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class AnonymousController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'device' => ['required', 'string', 'max:255'],
            'locale' => ['nullable', Rule::enum(Locale::class)],
        ]);

        $user = User::query()->create([
            'anonymous_at' => now(),
            'locale' => $validated['locale'] ?? Locale::SpanishMexico->value,
        ]);

        return response()->json(new TokenData(
            token: $user->createToken($validated['device'])->plainTextToken,
            user: UserData::fromModel($user),
        ), 201);
    }
}
