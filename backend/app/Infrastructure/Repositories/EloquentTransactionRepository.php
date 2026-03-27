<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\TransactionEntity;
use App\Domain\Repositories\TransactionRepositoryInterface;
use App\Models\Transaction;
use Carbon\Carbon;

class EloquentTransactionRepository implements TransactionRepositoryInterface
{
    public function create(TransactionEntity $transaction): TransactionEntity
    {
        $created = Transaction::create([
            'user_id'     => $transaction->userId,
            'type'        => $transaction->type,
            'amount'      => $transaction->amount,
            'description' => $transaction->description,
            'category'    => $transaction->category,
            'date'        => $transaction->date->format('Y-m-d'),
            'notes'       => $transaction->notes,
        ]);

        return $this->toEntity($created);
    }

    public function findById(int $id, int $userId): ?TransactionEntity
    {
        $transaction = Transaction::where('id', $id)
            ->where('user_id', $userId)
            ->first();

        return $transaction ? $this->toEntity($transaction) : null;
    }

    public function update(TransactionEntity $transaction): TransactionEntity
    {
        $model = Transaction::where('id', $transaction->id)
            ->where('user_id', $transaction->userId)
            ->firstOrFail();

        $model->update([
            'type'        => $transaction->type,
            'amount'      => $transaction->amount,
            'description' => $transaction->description,
            'category'    => $transaction->category,
            'date'        => $transaction->date->format('Y-m-d'),
            'notes'       => $transaction->notes,
        ]);

        return $this->toEntity($model->fresh());
    }

    public function delete(int $id, int $userId): bool
    {
        return Transaction::where('id', $id)
            ->where('user_id', $userId)
            ->delete() > 0;
    }

    public function listByUser(int $userId, array $filters = []): array
    {
        $query = Transaction::where('user_id', $userId);

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('date', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('date', '<=', $filters['date_to']);
        }

        return $query->orderBy('date', 'desc')
            ->get()
            ->map(fn($t) => $this->toEntity($t))
            ->toArray();
    }

    private function toEntity(Transaction $model): TransactionEntity
    {
        return new TransactionEntity(
            id: $model->id,
            userId: $model->user_id,
            type: $model->type,
            amount: $model->amount,
            description: $model->description,
            category: $model->category,
            date: Carbon::parse($model->date),
            notes: $model->notes,
            createdAt: $model->created_at,
        );
    }
}
