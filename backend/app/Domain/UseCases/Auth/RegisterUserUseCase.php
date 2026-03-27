<?php

namespace App\Domain\UseCases\Auth;

use App\Application\DTOs\RegisterUserDTO;
use App\Domain\Entities\UserEntity;
use App\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class RegisterUserUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function execute(RegisterUserDTO $dto): UserEntity
    {
        $existing = $this->userRepository->findByEmail($dto->email);

        if ($existing) {
            throw new \DomainException('E-mail ja cadastrado');
        }

        $user = new UserEntity(
            id: null,
            name: $dto->name,
            email: $dto->email,
            password: Hash::make($dto->password)
        );

        return $this->userRepository->create($user);
    }
}
