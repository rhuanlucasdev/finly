<?php

namespace App\Presentation\Http\Controllers;

use App\Application\DTOs\LoginUserDTO;
use App\Application\DTOs\RegisterUserDTO;
use App\Domain\UseCases\Auth\LoginUserUseCase;
use App\Domain\UseCases\Auth\RegisterUserUseCase;
use App\Presentation\Http\Requests\LoginRequest;
use App\Presentation\Http\Requests\RegisterRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AuthController extends Controller
{
    public function __construct(
        private readonly RegisterUserUseCase $registerUseCase,
        private readonly LoginUserUseCase $loginUseCase,
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $user = $this->registerUseCase->execute(
                RegisterUserDTO::fromArray($request->validated())
            );

            return response()->json([
                'message' => 'Usuário criado com sucesso.',
                'user'    => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                ],
            ], 201);
        } catch (\DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $token = $this->loginUseCase->execute(
                LoginUserDTO::fromArray($request->validated())
            );

            return response()->json([
                'message' => 'Login realizado com sucesso.',
                'token'   => $token,
            ]);
        } catch (\DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logout realizado com sucesso.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
        ]);
    }
}
