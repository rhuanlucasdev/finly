<?php

namespace App\Application\DTOs;

class ListTransactionsFilterDTO
{
    public function __construct(
        public readonly int $userId,
        public readonly ?string $type = null,
        public readonly ?string $category = null,
        public readonly ?string $dateFrom = null,
        public readonly ?string $dateTo = null,
    ) {}

    public static function fromArray(int $userId, array $data): self
    {
        return new self(
            userId: $userId,
            type: $data['type'] ?? null,
            category: $data['category'] ?? null,
            dateFrom: $data['date_from'] ?? null,
            dateTo: $data['date_to'] ?? null,
        );
    }
}
