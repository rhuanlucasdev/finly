"use client";

import { useDashboard } from "@/presentation/hooks/useDashboard";
import { useAuth } from "@/presentation/providers/AuthProvider";
import { formatCurrency } from "@/lib/format";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import {
  Building2,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  MoreHorizontal,
  TrendingUp,
  ShoppingCart,
  Home,
  Tv,
  Wallet,
  Plus,
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  Trabalho: TrendingUp,
  Freelance: TrendingUp,
  Moradia: Home,
  Alimentação: ShoppingCart,
  Entretenimento: Tv,
  Saúde: Wallet,
};

function SkeletonCard() {
  return (
    <div
      className="rounded-card p-5 animate-pulse"
      style={{ background: "var(--surface-container-high)" }}
    >
      <div
        className="h-3 w-24 rounded-full mb-4"
        style={{ background: "var(--surface-container-highest)" }}
      />
      <div
        className="h-8 w-32 rounded-full mb-3"
        style={{ background: "var(--surface-container-highest)" }}
      />
      <div
        className="h-3 w-20 rounded-full"
        style={{ background: "var(--surface-container-highest)" }}
      />
    </div>
  );
}

function DonutChart({
  data,
  total,
}: {
  data: { category: string; percentage: number }[];
  total: number;
}) {
  const colors = [
    "var(--primary)",
    "var(--tertiary)",
    "var(--primary-container)",
    "var(--surface-bright)",
    "var(--outline)",
  ];

  const size = 180;
  const stroke = 28;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {data.map((seg, i) => {
          const dash = (seg.percentage / 100) * circ;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="text-[11px]"
          style={{ color: "var(--on-surface-variant)" }}
        >
          Total Gasto
        </span>
        <span
          className="text-base font-bold tabular-nums"
          style={{ color: "var(--on-surface)", letterSpacing: "-0.02em" }}
        >
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useDashboard();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const firstName = user?.name?.split(" ")[0] ?? "";

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const colors = [
    "var(--primary)",
    "var(--tertiary)",
    "var(--primary-container)",
    "var(--surface-bright)",
    "var(--outline)",
  ];

  const kpiCards = [
    {
      label: "Saldo Total",
      value: data ? formatCurrency(data.kpis.total_balance) : "—",
      sub: "saldo acumulado",
      subPositive: true,
      icon: Building2,
    },
    {
      label: "Receitas do Mês",
      value: data ? formatCurrency(data.kpis.monthly_income) : "—",
      sub: "mês atual",
      subPositive: true,
      icon: ArrowDownLeft,
    },
    {
      label: "Despesas do Mês",
      value: data ? formatCurrency(data.kpis.monthly_expenses) : "—",
      sub: "mês atual",
      subPositive: false,
      icon: ArrowUpRight,
    },
    {
      label: "Taxa de Economia",
      value: data ? `${data.kpis.savings_rate}%` : "—",
      progress: data?.kpis.savings_rate,
      icon: PiggyBank,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1
          className="font-bold tracking-tight"
          style={{
            fontSize: "2.25rem",
            letterSpacing: "-0.02em",
            color: "var(--on-surface)",
          }}
        >
          {greeting}, {firstName} 👋
        </h1>
        <p
          className="mt-1 text-sm capitalize"
          style={{ color: "var(--on-surface-variant)" }}
        >
          {today}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : kpiCards.map((card) => (
              <div
                key={card.label}
                className="rounded-card p-5"
                style={{ background: "var(--surface-container-high)" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    {card.label}
                  </span>
                  <div
                    className="rounded-full p-2"
                    style={{ background: "var(--surface-container-highest)" }}
                  >
                    <card.icon
                      className="h-3.5 w-3.5"
                      style={{ color: "var(--on-surface-variant)" }}
                    />
                  </div>
                </div>
                <p
                  className="font-bold tabular-nums mb-3"
                  style={{
                    fontSize: "1.5rem",
                    letterSpacing: "-0.02em",
                    color: "var(--on-surface)",
                  }}
                >
                  {card.value}
                </p>
                {card.progress !== undefined ? (
                  <div
                    className="h-1 rounded-full"
                    style={{ background: "var(--surface-container-highest)" }}
                  >
                    <div
                      className="h-1 rounded-full transition-all"
                      style={{
                        width: `${card.progress}%`,
                        background: "var(--primary)",
                      }}
                    />
                  </div>
                ) : (
                  <p
                    className="text-xs font-medium"
                    style={{
                      color: card.subPositive
                        ? "var(--success)"
                        : "var(--tertiary)",
                    }}
                  >
                    {card.sub}
                  </p>
                )}
              </div>
            ))}
      </div>

      {/* Cash Flow */}
      <div
        className="rounded-card p-6"
        style={{ background: "var(--surface-container)" }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2
              className="font-semibold"
              style={{ fontSize: "1.1rem", color: "var(--on-surface)" }}
            >
              Fluxo de Caixa
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Receitas vs despesas nos últimos 6 meses
            </p>
          </div>
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full inline-block"
                style={{ background: "var(--primary)" }}
              />
              Receitas
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full inline-block"
                style={{ background: "var(--tertiary)" }}
              />
              Despesas
            </span>
          </div>
        </div>

        <div className="h-52">
          {isLoading ? (
            <div
              className="h-full rounded-xl animate-pulse"
              style={{ background: "var(--surface-container-high)" }}
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.cash_flow ?? []}
                barGap={4}
                barCategoryGap="30%"
              >
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--on-surface-variant)", fontSize: 11 }}
                />
                <Tooltip
                  cursor={false}
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{
                    background: "var(--surface-container-highest)",
                    border: "none",
                    borderRadius: "0.75rem",
                    color: "var(--on-surface)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="income" radius={[6, 6, 0, 0]}>
                  {(data?.cash_flow ?? []).map((_, i, arr) => (
                    <Cell
                      key={i}
                      fill={
                        i === arr.length - 1
                          ? "var(--primary)"
                          : "var(--surface-container-highest)"
                      }
                    />
                  ))}
                </Bar>
                <Bar dataKey="expense" radius={[6, 6, 0, 0]}>
                  {(data?.cash_flow ?? []).map((_, i, arr) => (
                    <Cell
                      key={i}
                      fill={
                        i === arr.length - 1
                          ? "var(--tertiary)"
                          : "var(--tertiary-container)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        {/* Recent Transactions */}
        <div
          className="rounded-card p-6"
          style={{ background: "var(--surface-container)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-semibold"
              style={{ fontSize: "1.1rem", color: "var(--on-surface)" }}
            >
              Transações Recentes
            </h2>
            <button
              className="text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--primary)" }}
            >
              Ver todas
            </button>
          </div>

          <div className="space-y-1">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-4 py-3 animate-pulse"
                  >
                    <div
                      className="h-10 w-10 rounded-full shrink-0"
                      style={{ background: "var(--surface-container-highest)" }}
                    />
                    <div className="flex-1 space-y-2">
                      <div
                        className="h-3 w-32 rounded-full"
                        style={{
                          background: "var(--surface-container-highest)",
                        }}
                      />
                      <div
                        className="h-2 w-20 rounded-full"
                        style={{
                          background: "var(--surface-container-highest)",
                        }}
                      />
                    </div>
                    <div
                      className="h-3 w-16 rounded-full"
                      style={{ background: "var(--surface-container-highest)" }}
                    />
                  </div>
                ))
              : (data?.recent_transactions ?? []).map((tx) => {
                  const Icon = categoryIcons[tx.category] ?? Wallet;
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center gap-4 rounded-xl px-4 py-3 cursor-pointer transition-colors"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--surface-container-highest)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: "var(--surface-container-highest)",
                        }}
                      >
                        <Icon
                          className="h-4 w-4"
                          style={{ color: "var(--on-surface-variant)" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: "var(--on-surface)" }}
                        >
                          {tx.description}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--on-surface-variant)" }}
                        >
                          {tx.category} • {tx.date}
                        </p>
                      </div>
                      <p
                        className="text-sm font-semibold tabular-nums shrink-0"
                        style={{
                          color:
                            tx.type === "income"
                              ? "var(--success)"
                              : "var(--on-surface)",
                        }}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </p>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div
          className="rounded-card p-6 relative"
          style={{ background: "var(--surface-container)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-semibold"
              style={{ fontSize: "1.1rem", color: "var(--on-surface)" }}
            >
              Gastos por Categoria
            </h2>
            <button
              className="transition-colors hover:opacity-70"
              style={{ color: "var(--on-surface-variant)" }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <button
            className="absolute top-14 right-6 h-10 w-10 rounded-full flex items-center justify-center z-10"
            style={{
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
            }}
          >
            <Plus className="h-4 w-4" style={{ color: "var(--on-primary)" }} />
          </button>

          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div
                className="h-44 w-44 rounded-full animate-pulse"
                style={{ background: "var(--surface-container-highest)" }}
              />
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <DonutChart
                  data={data?.expense_breakdown ?? []}
                  total={data?.kpis.monthly_expenses ?? 0}
                />
              </div>
              <div className="space-y-3">
                {(data?.expense_breakdown ?? []).map((seg, i) => (
                  <div
                    key={seg.category}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ background: colors[i % colors.length] }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: "var(--on-surface-variant)" }}
                      >
                        {seg.category}
                      </span>
                    </div>
                    <span
                      className="text-sm font-semibold tabular-nums"
                      style={{ color: "var(--on-surface)" }}
                    >
                      {seg.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
