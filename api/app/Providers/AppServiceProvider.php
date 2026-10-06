<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Foundation\DevCommands;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->registerDevProcesses();
        }
    }

    /**
     * `composer dev`: the API on the local network and Metro with the app pointed at it.
     */
    private function registerDevProcesses(): void
    {
        $host = config('dev.host');
        $host = is_string($host) && $host !== '' ? $host : '127.0.0.1';
        $port = (int) config('dev.port');
        $metroPort = (int) config('dev.metro_port');
        $app = escapeshellarg(dirname(base_path()).'/app');

        DevCommands::except('vite', 'queue');
        DevCommands::artisan("serve --host=0.0.0.0 --port={$port}", 'server')->blue();
        DevCommands::register(
            "cd {$app} && EXPO_PUBLIC_API_URL=http://{$host}:{$port} REACT_NATIVE_PACKAGER_HOSTNAME={$host} pnpm exec expo start --port {$metroPort}",
            'expo',
        )->yellow();
    }
}
