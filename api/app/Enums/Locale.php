<?php

declare(strict_types=1);

namespace App\Enums;

enum Locale: string
{
    case SpanishMexico = 'es-MX';
    case SpanishSpain = 'es-ES';
    case English = 'en-US';
    case Latin = 'la';
}
