<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prayers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('kind', 16);
            $table->string('mystery_set', 16);
            $table->string('locale', 8);
            $table->date('prayed_on');
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->unsignedTinyInteger('decades');
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->json('readings')->nullable();
            $table->timestamp('client_updated_at');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'updated_at']);
            $table->index(['user_id', 'prayed_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prayers');
    }
};
