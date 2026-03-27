<?php

namespace App\Application\DTOs;

class RegisterUserDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $password
    ) {}

    public static function fromArray(array $data)
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            password: $data['password']
        );
    }
}
