<?php

namespace App\Domain\Repositories;

use App\Domain\Entities\UserEntity;

interface UserRepositoryInterface
{
    public function findByEmail(string $email): ?UserEntity;
    public function create(UserEntity $user): UserEntity;
}
