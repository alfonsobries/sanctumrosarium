<?php

declare(strict_types=1);

namespace App\Enums;

enum PrayerKind: string
{
    case Rosary = 'rosary';
    case Decade = 'decade';
}
