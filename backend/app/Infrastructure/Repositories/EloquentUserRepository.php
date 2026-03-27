<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\UserEntity;
use App\Domain\Repositories\UserRepositoryInterface;
use App\Models\User;

class EloquentUserRepository implements UserRepositoryInterface
{
    public function findByEmail(string $email): ?UserEntity
    {
        $user = User::where('email', $email)->first();

        if (!$user) return null;

        return new UserEntity(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            password: $user->password
        );
    }

    public function create(UserEntity $user): UserEntity
    {
        $created = User::create([
            'name' => $user->name,
            'email' => $user->email,
            'password' => $user->password
        ]);

        return new UserEntity(
            id: $created->id,
            name: $created->name,
            email: $created->email,
            password: $created->password
        );
    }
}
