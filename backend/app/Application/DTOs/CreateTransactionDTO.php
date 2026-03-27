<?php

namespace App\Application\DTOs;

class CreateTransactionDTO
{
    public function __construct(
        public readonly int $userId,
        public readonly string $type,
        public readonly float $amount,
        public readonly string $description,
        public readonly string $category,
        public readonly string $date,
        public readonly ?string $notes = null,
    ) {}

    public static function fromArray(int $userId, array $data): self
    {
        return new self(
            userId: $userId,
            type: $data['type'],
            amount: $data['amount'],
            description: $data['description'],
            category: $data['category'],
            date: $data['date'],
            notes: $data['notes'] ?? null,
        );
    }
}
