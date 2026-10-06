<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Data\PrayerData;
use App\Data\SyncResultData;
use App\Http\Requests\SyncRequest;
use App\Models\Prayer;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Two-way sync of the prayer journal. The client pushes what changed on the device since
 * its last sync and receives everything that changed on the server since its cursor.
 * Each prayer is resolved by last write wins on the device's own update time, so
 * replaying a push is harmless.
 */
final class SyncController extends Controller
{
    public function __invoke(SyncRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $cursor = now();

        /** @var list<array<string, mixed>> $incoming */
        $incoming = $request->validated('prayers');

        DB::transaction(function () use ($incoming, $user): void {
            foreach ($incoming as $row) {
                $this->apply($user, $row);
            }
        });

        $since = $request->validated('cursor');

        $changed = Prayer::query()
            ->withTrashed()
            ->whereBelongsTo($user)
            ->when($since !== null, fn ($query) => $query->where('updated_at', '>=', Carbon::parse($since)))
            ->orderBy('updated_at')
            ->get();

        return response()->json(new SyncResultData(
            prayers: array_values($changed->map(fn (Prayer $prayer): PrayerData => PrayerData::fromModel($prayer))->all()),
            cursor: $cursor->toIso8601ZuluString(),
        ));
    }

    /**
     * @param  array<string, mixed>  $row
     */
    private function apply(User $user, array $row): void
    {
        $id = $row['id'];

        if (! is_string($id)) {
            return;
        }

        $existing = Prayer::query()->withTrashed()->whereKey($id)->first();

        if ($existing !== null && $existing->user_id !== $user->id) {
            return;
        }

        $clientUpdatedAt = Carbon::parse($row['clientUpdatedAt']);

        if ($existing !== null && $existing->client_updated_at->gte($clientUpdatedAt)) {
            return;
        }

        $prayer = $existing ?? new Prayer(['id' => $id]);
        $prayer->user()->associate($user);
        $prayer->fill([
            'kind' => $row['kind'],
            'mystery_set' => $row['mysterySet'],
            'locale' => $row['locale'],
            'prayed_on' => $row['prayedOn'],
            'started_at' => Carbon::parse($row['startedAt']),
            'completed_at' => isset($row['completedAt']) ? Carbon::parse($row['completedAt']) : null,
            'decades' => $row['decades'],
            'duration_seconds' => $row['durationSeconds'],
            'readings' => $row['readings'] ?? null,
            'client_updated_at' => $clientUpdatedAt,
            'deleted_at' => isset($row['deletedAt']) ? Carbon::parse($row['deletedAt']) : null,
        ]);
        $prayer->save();
    }
}
