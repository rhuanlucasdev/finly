<?php

namespace App\Domain\UseCases\Transaction;

use App\Application\DTOs\UpdateTransactionDTO;
use App\Domain\Entities\TransactionEntity;
use App\Domain\Repositories\TransactionRepositoryInterface;
use Carbon\Carbon;

class UpdateTransactionUseCase
{
    public function __construct(
        private readonly TransactionRepositoryInterface $transactionRepository,
    ) {}

    public function execute(UpdateTransactionDTO $dto): TransactionEntity
    {
        $existing = $this->transactionRepository->findById($dto->id, $dto->userId);

        if (!$existing) {
            throw new \DomainException('Transação não encontrada.');
        }

        if ($dto->amount <= 0) {
            throw new \DomainException('O valor deve ser maior que zero.');
        }

        $transaction = new TransactionEntity(
            id: $dto->id,
            userId: $dto->userId,
            type: $dto->type,
            amount: $dto->amount,
            description: $dto->description,
            category: $dto->category,
            date: Carbon::parse($dto->date),
            notes: $dto->notes,
        );

        return $this->transactionRepository->update($transaction);
    }
}
