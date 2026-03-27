<?php

namespace App\Domain\UseCases\Auth;

use App\Application\DTOs\LoginUserDTO;
use App\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class LoginUserUseCase 
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function execute(LoginUserDTO $dto): string
    {
        $user = $this->userRepository->findByEmail($dto->email);

        if (!$user || !Hash::check($dto->password, $user->password)){
            throw new \DomainException('Credenciais inválidas');
        }

        // Busca o model Eloquent pata gerar o token via Sanctum
        $eloquentUser = \App\Models\User::find($user->id);
        $eloquentUser->tokens()->delete(); // Revoga tokens anteriores

        return $eloquentUser->createToken('api-token')->plainTextToken;
    }
}