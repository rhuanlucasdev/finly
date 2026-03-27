<?php

namespace App\Domain\Entities;

use DateTimeInterface;

class TransactionEntity
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $userId,
        public readonly string $type,
        public readonly float $amount,
        public readonly string $description,
        public readonly string $category,
        public readonly DateTimeInterface $date,
        public readonly ?string $notes,
        public readonly ?DateTimeInterface $createdAt = null,
    ) {}
}
