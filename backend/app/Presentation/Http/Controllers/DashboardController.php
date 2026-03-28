<?php

namespace App\Presentation\Http\Controllers;

use App\Domain\UseCases\Dashboard\GetDashboardUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class DashboardController extends Controller
{
    public function __construct(
        private readonly GetDashboardUseCase $getDashboardUseCase,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $data = $this->getDashboardUseCase->execute($request->user()->id);
        return response()->json($data);
    }
}
