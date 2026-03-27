<?php

namespace App\Domain\Entities;

class UserEntity
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,
        public readonly string $email,
        public readonly string $password,
    ) {}
}
