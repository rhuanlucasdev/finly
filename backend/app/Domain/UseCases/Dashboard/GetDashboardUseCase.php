<?php

namespace App\Domain\UseCases\Dashboard;

use App\Domain\Repositories\TransactionRepositoryInterface;
use Carbon\Carbon;

class GetDashboardUseCase
{
    public function __construct(
        private readonly TransactionRepositoryInterface $transactionRepository,
    ) {}

    public function execute(int $userId): array
    {
        $now        = Carbon::now();
        $startMonth = $now->copy()->startOfMonth()->format('Y-m-d');
        $endMonth   = $now->copy()->endOfMonth()->format('Y-m-d');

        // Todas as transações do mês atual
        $monthlyTransactions = $this->transactionRepository->listByUser($userId, [
            'date_from' => $startMonth,
            'date_to'   => $endMonth,
        ]);

        // KPIs
        $monthlyIncome   = 0;
        $monthlyExpenses = 0;

        foreach ($monthlyTransactions as $tx) {
            if ($tx->type === 'income')  $monthlyIncome   += $tx->amount;
            if ($tx->type === 'expense') $monthlyExpenses += $tx->amount;
        }

        $totalBalance = $this->calculateTotalBalance($userId);
        $savingsRate  = $monthlyIncome > 0
            ? round((($monthlyIncome - $monthlyExpenses) / $monthlyIncome) * 100)
            : 0;

        // Cash flow — últimos 6 meses
        $cashFlow = [];
        for ($i = 5; $i >= 0; $i--) {
            $month      = $now->copy()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth()->format('Y-m-d');
            $monthEnd   = $month->copy()->endOfMonth()->format('Y-m-d');

            $transactions = $this->transactionRepository->listByUser($userId, [
                'date_from' => $monthStart,
                'date_to'   => $monthEnd,
            ]);

            $income   = 0;
            $expenses = 0;
            foreach ($transactions as $tx) {
                if ($tx->type === 'income')  $income   += $tx->amount;
                if ($tx->type === 'expense') $expenses += $tx->amount;
            }

            $cashFlow[] = [
                'month'   => strtoupper($month->format('M')),
                'income'  => $income,
                'expense' => $expenses,
            ];
        }

        // Expense breakdown por categoria
        $expensesByCategory = [];
        foreach ($monthlyTransactions as $tx) {
            if ($tx->type !== 'expense') continue;
            $expensesByCategory[$tx->category] = ($expensesByCategory[$tx->category] ?? 0) + $tx->amount;
        }

        $breakdown = [];
        foreach ($expensesByCategory as $category => $amount) {
            $breakdown[] = [
                'category'   => $category,
                'amount'     => $amount,
                'percentage' => $monthlyExpenses > 0
                    ? round(($amount / $monthlyExpenses) * 100)
                    : 0,
            ];
        }
        usort($breakdown, fn($a, $b) => $b['amount'] <=> $a['amount']);

        // Transações recentes
        $allTransactions = $this->transactionRepository->listByUser($userId, []);
        $recent = array_slice($allTransactions, 0, 5);
        $recentFormatted = array_map(fn($tx) => [
            'id'          => $tx->id,
            'description' => $tx->description,
            'category'    => $tx->category,
            'amount'      => $tx->amount,
            'type'        => $tx->type,
            'date'        => $tx->date->format('M d'),
        ], $recent);

        return [
            'kpis' => [
                'total_balance'    => $totalBalance,
                'monthly_income'   => $monthlyIncome,
                'monthly_expenses' => $monthlyExpenses,
                'savings_rate'     => $savingsRate,
            ],
            'cash_flow'            => $cashFlow,
            'expense_breakdown'    => $breakdown,
            'recent_transactions'  => $recentFormatted,
        ];
    }

    private function calculateTotalBalance(int $userId): float
    {
        $all    = $this->transactionRepository->listByUser($userId, []);
        $income = 0;
        $expenses = 0;
        foreach ($all as $tx) {
            if ($tx->type === 'income')  $income   += $tx->amount;
            if ($tx->type === 'expense') $expenses += $tx->amount;
        }
        return $income - $expenses;
    }
}
