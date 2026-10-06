<?php

declare(strict_types=1);

return [

    /*
    | IPv4 the phone uses to reach this machine. Set by `pnpm play`; without it the
    | simulator and emulator still work on localhost.
    */
    'host' => env('DEV_HOST'),

    /*
    | Port of the `artisan serve` the app talks to, bound to every interface.
    */
    'port' => (int) env('DEV_PORT', 8020),

    /*
    | Metro, off the Expo default so the app can run next to other Expo projects.
    */
    'metro_port' => (int) env('DEV_METRO_PORT', 8083),

];
