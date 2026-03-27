<?php

namespace App\Domain\UseCases\Transaction;

use App\Application\DTOs\ListTransactionsFilterDTO;
use App\Domain\Repositories\TransactionRepositoryInterface;

class ListTransactionsUseCase
{
    public function __construct(
        private readonly TransactionRepositoryInterface $transactionRepository,
    ) {}

    public function execute(ListTransactionsFilterDTO $dto): array
    {
        return $this->transactionRepository->listByUser($dto->userId, [
            'type'      => $dto->type,
            'category'  => $dto->category,
            'date_from' => $dto->dateFrom,
            'date_to'   => $dto->dateTo,
        ]);
    }
}
