<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\AnonymousController;
use App\Http\Controllers\Auth\IdentityController;
use App\Http\Controllers\Auth\TokenController;
use App\Http\Controllers\MeController;
use App\Http\Controllers\SyncController;
use Illuminate\Support\Facades\Route;

Route::name('api.')->group(function (): void {
    Route::middleware('throttle:10,1')->group(function (): void {
        Route::post('auth/anonymous', AnonymousController::class)->name('auth.anonymous');
        Route::post('auth/{provider}', IdentityController::class)
            ->whereIn('provider', ['apple', 'google'])
            ->name('auth.identity');
    });

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::delete('auth/token', [TokenController::class, 'destroy'])->name('auth.logout');

        Route::get('me', [MeController::class, 'show'])->name('me.show');
        Route::patch('me', [MeController::class, 'update'])->name('me.update');
        Route::delete('me', [MeController::class, 'destroy'])->name('me.destroy');

        Route::post('sync', SyncController::class)->middleware('throttle:60,1')->name('sync');
    });
});
