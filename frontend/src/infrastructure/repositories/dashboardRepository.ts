import { httpClient } from "@/infrastructure/http/client";

export interface DashboardKPIs {
  total_balance: number;
  monthly_income: number;
  monthly_expenses: number;
  savings_rate: number;
}

export interface CashFlowItem {
  month: string;
  income: number;
  expense: number;
}

export interface ExpenseBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
}

export interface RecentTransaction {
  id: number;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  cash_flow: CashFlowItem[];
  expense_breakdown: ExpenseBreakdownItem[];
  recent_transactions: RecentTransaction[];
}

export async function fetchDashboard(): Promise<DashboardData> {
  const { data } = await httpClient.get("/dashboard");
  return data;
}
