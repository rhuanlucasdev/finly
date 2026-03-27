<?php

namespace App\Presentation\Http\Controllers;

use App\Application\DTOs\CreateTransactionDTO;
use App\Application\DTOs\ListTransactionsFilterDTO;
use App\Application\DTOs\UpdateTransactionDTO;
use App\Domain\UseCases\Transaction\CreateTransactionUseCase;
use App\Domain\UseCases\Transaction\DeleteTransactionUseCase;
use App\Domain\UseCases\Transaction\ListTransactionsUseCase;
use App\Domain\UseCases\Transaction\UpdateTransactionUseCase;
use App\Presentation\Http\Requests\CreateTransactionRequest;
use App\Presentation\Http\Requests\UpdateTransactionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class TransactionController extends Controller
{
    public function __construct(
        private readonly CreateTransactionUseCase $createUseCase,
        private readonly ListTransactionsUseCase $listUseCase,
        private readonly UpdateTransactionUseCase $updateUseCase,
        private readonly DeleteTransactionUseCase $deleteUseCase,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $transactions = $this->listUseCase->execute(
            ListTransactionsFilterDTO::fromArray(
                $request->user()->id,
                $request->query()
            )
        );

        return response()->json($transactions);
    }

    public function store(CreateTransactionRequest $request): JsonResponse
    {
        try {
            $transaction = $this->createUseCase->execute(
                CreateTransactionDTO::fromArray(
                    $request->user()->id,
                    $request->validated()
                )
            );

            return response()->json($transaction, 201);
        } catch (\DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function update(UpdateTransactionRequest $request, int $id): JsonResponse
    {
        try {
            $transaction = $this->updateUseCase->execute(
                UpdateTransactionDTO::fromArray(
                    $id,
                    $request->user()->id,
                    $request->validated()
                )
            );

            return response()->json($transaction);
        } catch (\DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $this->deleteUseCase->execute($id, $request->user()->id);

            return response()->json(['message' => 'Transação deletada com sucesso.']);
        } catch (\DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }
}
