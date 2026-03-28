"use client";

import { useAuth } from "@/presentation/providers/AuthProvider";
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
  Plus,
} from "lucide-react";

const cashFlowData = [
  { month: "MAY", income: 9000, expense: 4000 },
  { month: "JUN", income: 10500, expense: 5200 },
  { month: "JUL", income: 9800, expense: 4100 },
  { month: "AUG", income: 11000, expense: 3800 },
  { month: "SEP", income: 10200, expense: 4500 },
  { month: "OCT", income: 12500, expense: 8120 },
];

const recentTransactions = [
  {
    icon: Tv,
    label: "Netflix Subscription",
    sub: "Entertainment • Oct 22",
    amount: "-R$ 55,90",
    positive: false,
  },
  {
    icon: ShoppingCart,
    label: "Pão de Açúcar",
    sub: "Food & Grocery • Oct 21",
    amount: "-R$ 412,30",
    positive: false,
  },
  {
    icon: Home,
    label: "Monthly Rent",
    sub: "Housing • Oct 20",
    amount: "-R$ 3.200,00",
    positive: false,
  },
  {
    icon: TrendingUp,
    label: "Freelance Design",
    sub: "Income • Oct 18",
    amount: "+R$ 2.400,00",
    positive: true,
  },
];

const expenseBreakdown = [
  { label: "Housing", pct: 45, color: "#C0C1FF" },
  { label: "Food", pct: 25, color: "#FFB94A" },
  { label: "Entertainment", pct: 20, color: "#8083FF" },
  { label: "Transport", pct: 10, color: "#464554" },
];

const kpiCards = [
  {
    label: "Total Balance",
    value: "R$ 45.230,00",
    sub: "+2.4% this month",
    subPositive: true,
    icon: Building2,
  },
  {
    label: "Monthly Income",
    value: "R$ 12.500,00",
    sub: "Expected: R$ 12.000",
    subPositive: true,
    icon: ArrowDownLeft,
  },
  {
    label: "Monthly Expenses",
    value: "R$ 8.120,00",
    sub: "12% lower than last month",
    subPositive: false,
    icon: ArrowUpRight,
  },
  {
    label: "Savings Rate",
    value: "35%",
    sub: null,
    progress: 35,
    icon: PiggyBank,
  },
];

function DonutChart() {
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
        {expenseBreakdown.map((seg) => {
          const dash = (seg.pct / 100) * circ;
          const gap = circ - dash;
          const el = (
            <circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[11px] text-on-surface-variant">Total Spent</span>
        <span className="text-lg font-bold tabular-nums text-on-surface leading-tight">
          R$ 8.120
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] ?? "";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-[2.5rem] font-bold tracking-tight text-on-surface leading-tight">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-on-surface-variant text-label-md mt-1">{today}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="rounded-card p-5"
            style={{ background: "var(--surface-container-high)" }}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">
                {card.label}
              </span>
              <div
                className="rounded-full p-2"
                style={{ background: "var(--surface-container-highest)" }}
              >
                <card.icon className="h-4 w-4 text-on-surface-variant" />
              </div>
            </div>

            <p className="text-[1.6rem] font-bold tabular-nums text-on-surface leading-none mb-3">
              {card.value}
            </p>

            {card.progress !== undefined ? (
              <div
                className="h-1 rounded-full"
                style={{ background: "var(--surface-container-highest)" }}
              >
                <div
                  className="h-1 rounded-full"
                  style={{
                    width: `${card.progress}%`,
                    background: "var(--primary)",
                  }}
                />
              </div>
            ) : (
              <p
                className={`text-label-sm font-medium ${card.subPositive ? "text-success" : "text-tertiary"}`}
              >
                {card.subPositive ? "↗ " : "↘ "}
                {card.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Cash Flow Chart */}
      <div
        className="rounded-card p-6"
        style={{ background: "var(--surface-container)" }}
      >
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-title-lg font-semibold text-on-surface">
              Cash Flow Analytics
            </h2>
            <p className="text-label-sm text-on-surface-variant mt-0.5">
              Comparative analysis of earnings vs spending (last 6 months)
            </p>
          </div>
          <div className="flex items-center gap-4 text-label-sm text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full inline-block"
                style={{ background: "var(--primary)" }}
              />
              Income
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full inline-block"
                style={{ background: "var(--tertiary)" }}
              />
              Expenses
            </span>
          </div>
        </div>

        <div className="mt-6 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashFlowData} barGap={4} barCategoryGap="30%">
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--on-surface-variant)", fontSize: 11 }}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  background: "var(--surface-container-highest)",
                  border: "none",
                  borderRadius: "0.75rem",
                  color: "var(--on-surface)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="income" radius={[6, 6, 0, 0]}>
                {cashFlowData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      i === cashFlowData.length - 1
                        ? "var(--primary)"
                        : "var(--surface-container-highest)"
                    }
                    fillOpacity={i === cashFlowData.length - 1 ? 1 : 0.8}
                  />
                ))}
              </Bar>
              <Bar dataKey="expense" radius={[6, 6, 0, 0]}>
                {cashFlowData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      i === cashFlowData.length - 1
                        ? "var(--tertiary)"
                        : "var(--tertiary-container)"
                    }
                    fillOpacity={i === cashFlowData.length - 1 ? 1 : 0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-[1fr_380px] gap-4">
        {/* Recent Transactions */}
        <div
          className="rounded-card p-6"
          style={{ background: "var(--surface-container)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-title-lg font-semibold text-on-surface">
              Recent Transactions
            </h2>
            <button className="text-label-sm text-primary hover:opacity-70 transition-opacity">
              View All
            </button>
          </div>

          <div className="space-y-2">
            {recentTransactions.map((tx) => (
              <div
                key={tx.label}
                className="flex items-center gap-4 rounded-[1rem] px-4 py-3 hover:bg-surface-highest transition-colors cursor-pointer"
                style={{ "--tw-bg-opacity": 1 } as React.CSSProperties}
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
                  style={{ background: "var(--surface-container-highest)" }}
                >
                  <tx.icon className="h-4 w-4 text-on-surface-variant" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-label-md font-medium text-on-surface truncate">
                    {tx.label}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">
                    {tx.sub}
                  </p>
                </div>
                <p
                  className={`text-label-md font-semibold tabular-nums shrink-0 ${tx.positive ? "text-success" : "text-on-surface"}`}
                >
                  {tx.amount}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div
          className="rounded-card p-6 relative"
          style={{ background: "var(--surface-container)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-title-lg font-semibold text-on-surface">
              Expense Breakdown
            </h2>
            <button className="text-on-surface-variant hover:text-on-surface transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* FAB */}
          <button
            className="absolute top-14 right-6 h-10 w-10 rounded-full flex items-center justify-center shadow-float z-10"
            style={{
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
            }}
          >
            <Plus className="h-4 w-4 text-on-primary" />
          </button>

          <div className="flex justify-center mb-6">
            <DonutChart />
          </div>

          <div className="space-y-3">
            {expenseBreakdown.map((seg) => (
              <div
                key={seg.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ background: seg.color }}
                  />
                  <span className="text-label-md text-on-surface-variant">
                    {seg.label}
                  </span>
                </div>
                <span className="text-label-md font-semibold tabular-nums text-on-surface">
                  {seg.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
