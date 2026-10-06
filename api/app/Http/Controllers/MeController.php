<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Data\UserData;
use App\Http\Requests\UpdateMeRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

final class MeController extends Controller
{
    public function show(Request $request): UserData
    {
        return UserData::fromModel($this->user($request));
    }

    public function update(UpdateMeRequest $request): UserData
    {
        $user = $this->user($request);
        $validated = $request->validated();

        if (array_key_exists('preferences', $validated)) {
            /** @var array<string, mixed> $incoming */
            $incoming = $validated['preferences'];
            $validated['preferences'] = [...($user->preferences ?? []), ...$incoming];
        }

        $user->update($validated);

        return UserData::fromModel($user);
    }

    public function destroy(Request $request): Response
    {
        $user = $this->user($request);
        $user->tokens()->delete();
        $user->delete();

        return response()->noContent();
    }

    private function user(Request $request): User
    {
        /** @var User */
        return $request->user();
    }
}
