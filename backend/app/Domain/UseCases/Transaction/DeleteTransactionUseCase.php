<?php

namespace App\Domain\UseCases\Transaction;

use App\Domain\Repositories\TransactionRepositoryInterface;

class DeleteTransactionUseCase
{
    public function __construct(
        private readonly TransactionRepositoryInterface $transactionRepository,
    ) {}

    public function execute(int $id, int $userId): void
    {
        $existing = $this->transactionRepository->findById($id, $userId);

        if (!$existing) {
            throw new \DomainException('Transação não encontrada.');
        }

        $this->transactionRepository->delete($id, $userId);
    }
}
