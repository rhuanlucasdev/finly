export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  userId: number;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
  notes: string | null;
  createdAt: string;
}
