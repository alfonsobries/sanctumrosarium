<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Auth\IdentityProvider;
use App\Auth\IdentityTokenVerifier;
use App\Auth\InvalidIdentityToken;
use App\Auth\MergeAnonymousIntoAccount;
use App\Data\TokenData;
use App\Data\UserData;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

/**
 * Signs in with Apple or Google. When the request carries the token of an anonymous
 * device, its history moves to the account: to a new one it simply becomes that account,
 * to an existing one it is merged.
 */
final class IdentityController extends Controller
{
    public function __invoke(
        Request $request,
        IdentityProvider $provider,
        IdentityTokenVerifier $verifier,
        MergeAnonymousIntoAccount $merge,
    ): JsonResponse {
        $validated = $request->validate([
            'identityToken' => ['required', 'string'],
            'device' => ['required', 'string', 'max:255'],
            'name' => ['nullable', 'string', 'max:120'],
        ]);

        try {
            $identity = $verifier->verify($provider, $validated['identityToken']);
        } catch (InvalidIdentityToken) {
            throw ValidationException::withMessages(['identityToken' => __('auth.failed')]);
        }

        $current = Auth::guard('sanctum')->user();
        $current = $current instanceof User && $current->isAnonymous() ? $current : null;

        $account = User::query()->where($provider->column(), $identity->subject)->first();

        if ($account === null && $identity->email !== null) {
            $account = User::query()->where('email', $identity->email)->whereNull('anonymous_at')->first();
        }

        if ($account === null) {
            $account = $current ?? new User;
            $account->forceFill([
                'anonymous_at' => null,
                'name' => $validated['name'] ?? $account->name,
                'email' => $identity->email,
            ]);
        } elseif ($current !== null) {
            $account = $merge->handle($current, $account);
        }

        $account->forceFill([$provider->column() => $identity->subject])->save();

        return response()->json(new TokenData(
            token: $account->createToken($validated['device'])->plainTextToken,
            user: UserData::fromModel($account->refresh()),
        ));
    }
}
