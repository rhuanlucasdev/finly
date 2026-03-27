<?php

namespace App\Infrastructure\Providers;

use App\Domain\Repositories\TransactionRepositoryInterface;
use App\Domain\Repositories\UserRepositoryInterface;
use App\Infrastructure\Repositories\EloquentTransactionRepository;
use App\Infrastructure\Repositories\EloquentUserRepository;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            UserRepositoryInterface::class,
            EloquentUserRepository::class,
        );

        $this->app->bind(
            TransactionRepositoryInterface::class,
            EloquentTransactionRepository::class,
        );
    }
}
