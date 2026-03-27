<?php

namespace App\Domain\UseCases\Transaction;

use App\Application\DTOs\CreateTransactionDTO;
use App\Domain\Entities\TransactionEntity;
use App\Domain\Repositories\TransactionRepositoryInterface;
use Carbon\Carbon;

class CreateTransactionUseCase
{
    public function __construct(
        private readonly TransactionRepositoryInterface $transactionRepository,
    ) {}

    public function execute(CreateTransactionDTO $dto): TransactionEntity
    {
        if ($dto->amount <= 0) {
            throw new \DomainException('O valor deve ser maior que zero.');
        }

        if (!in_array($dto->type, ['income', 'expense'])) {
            throw new \DomainException('Tipo inválido. Use income ou expense.');
        }

        $transaction = new TransactionEntity(
            id: null,
            userId: $dto->userId,
            type: $dto->type,
            amount: $dto->amount,
            description: $dto->description,
            category: $dto->category,
            date: Carbon::parse($dto->date),
            notes: $dto->notes,
        );

        return $this->transactionRepository->create($transaction);
    }
}
