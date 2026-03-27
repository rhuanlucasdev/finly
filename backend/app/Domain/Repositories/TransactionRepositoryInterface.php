<?php

namespace App\Domain\Repositories;

use App\Domain\Entities\TransactionEntity;

interface TransactionRepositoryInterface
{
    public function create(TransactionEntity $transaction): TransactionEntity;
    public function findById(int $id, int $userId): ?TransactionEntity;
    public function update(TransactionEntity $transaction): TransactionEntity;
    public function delete(int $id, int $userId): bool;
    public function listByUser(int $userId, array $filters = []): array;
}
