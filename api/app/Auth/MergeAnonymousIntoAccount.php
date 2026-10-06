<?php

declare(strict_types=1);

namespace App\Auth;

use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Hands everything an anonymous device recorded to the account it just signed into, then
 * removes the anonymous user so the same history never lives in two places.
 */
final class MergeAnonymousIntoAccount
{
    public function handle(User $anonymous, User $account): User
    {
        return DB::transaction(function () use ($anonymous, $account): User {
            $anonymous->prayers()->withTrashed()->update(['user_id' => $account->id]);

            if ($account->preferences === null && $anonymous->preferences !== null) {
                $account->preferences = $anonymous->preferences;
                $account->save();
            }

            $anonymous->tokens()->delete();
            $anonymous->delete();

            return $account;
        });
    }
}
