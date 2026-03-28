"use client";

import { useAuth } from "@/presentation/providers/AuthProvider";
import { httpClient } from "@/infrastructure/http/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Wallet, ArrowRight } from "lucide-react";

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: "var(--on-surface-variant)" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
        style={{
          background: "var(--surface-container-high)",
          color: "var(--on-surface)",
          border: "1px solid transparent",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
      />
    </div>
  );
}

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [sliding, setSliding] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, isLoading, router]);

  const switchMode = () => {
    if (sliding) return;
    setSliding(true);
    setError("");
    setTimeout(() => {
      setMode((m) => (m === "login" ? "register" : "login"));
      setSliding(false);
    }, 600);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data: authData } = await httpClient.post("/auth/login", {
        email,
        password,
      });
      const { data: meData } = await httpClient.get("/auth/me", {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      login(authData.token, meData);
      setTimeout(() => router.replace("/dashboard"), 50);
    } catch {
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== passwordConfirm) {
      setError("As senhas não conferem.");
      return;
    }
    setLoading(true);
    try {
      await httpClient.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirm,
      });
      const { data: authData } = await httpClient.post("/auth/login", {
        email,
        password,
      });
      const { data: meData } = await httpClient.get("/auth/me", {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      login(authData.token, meData);
      setTimeout(() => router.replace("/dashboard"), 50);
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return null;

  const isLogin = mode === "login";

  return (
    <>
      {/* ══════════════════════════════════════════
          MOBILE — só formulário, sem painel lateral
      ══════════════════════════════════════════ */}
      <div
        className="md:hidden min-h-screen flex flex-col items-center justify-center px-6 py-12"
        style={{ background: "var(--surface-lowest)" }}
      >
        {/* Textura */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--outline-variant) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.2,
          }}
        />

        <div className="relative z-10 w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
              }}
            >
              <Wallet
                className="h-4 w-4"
                style={{ color: "var(--on-primary)" }}
              />
            </div>
            <span
              className="font-bold text-lg tracking-tight"
              style={{ color: "var(--on-surface)" }}
            >
              Finly
            </span>
          </div>

          {/* Form Login */}
          <div
            style={{
              display: isLogin ? "block" : "none",
            }}
          >
            <h2
              className="font-bold mb-1"
              style={{
                fontSize: "1.75rem",
                letterSpacing: "-0.02em",
                color: "var(--on-surface)",
              }}
            >
              Bem-vindo de volta
            </h2>
            <p
              className="mb-8 text-sm"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Entre na sua conta Finly
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <InputField
                label="E-mail"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="joao@finly.com"
              />
              <InputField
                label="Senha"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
              />
              {error && (
                <p className="text-xs" style={{ color: "var(--error)" }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-3 text-sm font-semibold disabled:opacity-50 transition-opacity"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
                  color: "var(--on-primary)",
                }}
              >
                {loading ? "Entrando..." : "Entrar →"}
              </button>
            </form>
            <p
              className="mt-6 text-center text-sm"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Não tem conta?{" "}
              <button
                onClick={switchMode}
                className="font-semibold"
                style={{ color: "var(--primary)" }}
              >
                Criar conta
              </button>
            </p>
          </div>

          {/* Form Register */}
          <div style={{ display: !isLogin ? "block" : "none" }}>
            <h2
              className="font-bold mb-1"
              style={{
                fontSize: "1.75rem",
                letterSpacing: "-0.02em",
                color: "var(--on-surface)",
              }}
            >
              Criar conta
            </h2>
            <p
              className="mb-6 text-sm"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Comece sua jornada financeira com o Finly
            </p>
            <form onSubmit={handleRegister} className="space-y-3">
              <InputField
                label="Nome completo"
                value={name}
                onChange={setName}
                placeholder="João Silva"
              />
              <InputField
                label="E-mail"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="joao@finly.com"
              />
              <InputField
                label="Senha"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
              />
              <InputField
                label="Confirmar senha"
                type="password"
                value={passwordConfirm}
                onChange={setPasswordConfirm}
                placeholder="••••••••"
              />
              {error && (
                <p className="text-xs" style={{ color: "var(--error)" }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-3 text-sm font-semibold disabled:opacity-50 transition-opacity"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
                  color: "var(--on-primary)",
                }}
              >
                {loading ? "Criando..." : "Criar conta →"}
              </button>
            </form>
            <p
              className="mt-6 text-center text-sm"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Já tem conta?{" "}
              <button
                onClick={switchMode}
                className="font-semibold"
                style={{ color: "var(--primary)" }}
              >
                Entrar
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP — layout com painel deslizante
      ══════════════════════════════════════════ */}
      <div
        className="hidden md:flex relative min-h-screen overflow-hidden"
        style={{ background: "var(--surface-lowest)" }}
      >
        {/* Textura */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--outline-variant) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.25,
          }}
        />

        {/* Form Login — fixo na direita */}
        <div className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-center px-16 z-10">
          <div
            className="w-full max-w-sm"
            style={{
              opacity: isLogin ? 1 : 0,
              transform: isLogin ? "translateX(0)" : "translateX(40px)",
              transition: "opacity 400ms ease, transform 400ms ease",
              pointerEvents: isLogin ? "auto" : "none",
            }}
          >
            <h2
              className="font-bold mb-1"
              style={{
                fontSize: "1.75rem",
                letterSpacing: "-0.02em",
                color: "var(--on-surface)",
              }}
            >
              Bem-vindo de volta
            </h2>
            <p
              className="mb-8 text-sm"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Entre na sua conta Finly
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <InputField
                label="E-mail"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="joao@finly.com"
              />
              <InputField
                label="Senha"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
              />
              {error && (
                <p className="text-xs" style={{ color: "var(--error)" }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-3 text-sm font-semibold disabled:opacity-50 transition-opacity"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
                  color: "var(--on-primary)",
                }}
              >
                {loading ? "Entrando..." : "Entrar →"}
              </button>
            </form>
          </div>
        </div>

        {/* Form Register — fixo na esquerda */}
        <div className="absolute inset-y-0 left-0 w-1/2 flex items-center justify-center px-16 z-10">
          <div
            className="w-full max-w-sm"
            style={{
              opacity: !isLogin ? 1 : 0,
              transform: !isLogin ? "translateX(0)" : "translateX(-40px)",
              transition: "opacity 400ms ease, transform 400ms ease",
              pointerEvents: !isLogin ? "auto" : "none",
            }}
          >
            <h2
              className="font-bold mb-1"
              style={{
                fontSize: "1.75rem",
                letterSpacing: "-0.02em",
                color: "var(--on-surface)",
              }}
            >
              Criar conta
            </h2>
            <p
              className="mb-6 text-sm"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Comece sua jornada financeira com o Finly
            </p>
            <form onSubmit={handleRegister} className="space-y-3">
              <InputField
                label="Nome completo"
                value={name}
                onChange={setName}
                placeholder="João Silva"
              />
              <InputField
                label="E-mail"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="joao@finly.com"
              />
              <InputField
                label="Senha"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
              />
              <InputField
                label="Confirmar senha"
                type="password"
                value={passwordConfirm}
                onChange={setPasswordConfirm}
                placeholder="••••••••"
              />
              {error && (
                <p className="text-xs" style={{ color: "var(--error)" }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-3 text-sm font-semibold disabled:opacity-50 transition-opacity"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
                  color: "var(--on-primary)",
                }}
              >
                {loading ? "Criando..." : "Criar conta →"}
              </button>
            </form>
          </div>
        </div>

        {/* Painel deslizante */}
        <div
          className="absolute inset-y-0 z-20 w-1/2 flex items-center justify-center px-12"
          style={{
            left: isLogin ? "0%" : "50%",
            transition: "left 600ms cubic-bezier(0.4, 0, 0.2, 1)",
            background:
              "linear-gradient(145deg, var(--surface-container-high) 0%, var(--surface-container-highest) 100%)",
          }}
        >
          {/* Blobs */}
          <div
            className="absolute rounded-full blur-3xl pointer-events-none"
            style={{
              width: 350,
              height: 350,
              background: "var(--primary)",
              opacity: 0.12,
              top: "-10%",
              left: "-10%",
            }}
          />
          <div
            className="absolute rounded-full blur-3xl pointer-events-none"
            style={{
              width: 250,
              height: 250,
              background: "var(--primary-container)",
              opacity: 0.08,
              bottom: "5%",
              right: "-5%",
            }}
          />

          {/* Conteúdo do painel */}
          <div
            className="relative z-10 flex flex-col items-center text-center max-w-xs"
            style={{
              opacity: sliding ? 0 : 1,
              transform: sliding ? "scale(0.96)" : "scale(1)",
              transition: "opacity 250ms ease, transform 250ms ease",
            }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-10">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
                }}
              >
                <Wallet
                  className="h-5 w-5"
                  style={{ color: "var(--on-primary)" }}
                />
              </div>
              <span
                className="font-bold tracking-tight"
                style={{ fontSize: "1.4rem", color: "var(--on-surface)" }}
              >
                Finly
              </span>
            </div>

            {isLogin ? (
              <>
                <div className="mb-8 w-full flex justify-center">
                  <svg width="180" height="80" viewBox="0 0 180 80" fill="none">
                    {[
                      {
                        x: 10,
                        h: 40,
                        color: "var(--surface-container-highest)",
                      },
                      {
                        x: 38,
                        h: 55,
                        color: "var(--surface-container-highest)",
                      },
                      {
                        x: 66,
                        h: 35,
                        color: "var(--surface-container-highest)",
                      },
                      {
                        x: 94,
                        h: 60,
                        color: "var(--surface-container-highest)",
                      },
                      {
                        x: 122,
                        h: 45,
                        color: "var(--surface-container-highest)",
                      },
                      { x: 150, h: 72, color: "var(--primary)" },
                    ].map((bar, i) => (
                      <rect
                        key={i}
                        x={bar.x}
                        y={80 - bar.h}
                        width="20"
                        height={bar.h}
                        rx="6"
                        fill={bar.color}
                      />
                    ))}
                    <polyline
                      points="20,42 48,28 76,47 104,22 132,37 160,10"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      opacity="0.5"
                    />
                    <circle
                      cx="160"
                      cy="10"
                      r="4"
                      fill="var(--primary)"
                      opacity="0.9"
                    />
                  </svg>
                </div>
                <h2
                  className="font-bold leading-tight mb-3"
                  style={{
                    fontSize: "1.6rem",
                    letterSpacing: "-0.02em",
                    color: "var(--on-surface)",
                  }}
                >
                  Novo aqui?{" "}
                  <span style={{ color: "var(--primary)" }}>
                    Entre para o Finly.
                  </span>
                </h2>
                <p
                  className="mb-4 leading-relaxed"
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--on-surface-variant)",
                    maxWidth: 220,
                  }}
                >
                  Controle suas finanças — receitas, despesas, metas e
                  investimentos em um só lugar.
                </p>
                <div className="flex flex-col gap-2 mb-8 w-full">
                  {[
                    "Controle receitas e despesas",
                    "Defina metas financeiras",
                    "Acompanhe investimentos",
                  ].map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2.5 text-left px-4 py-2.5 rounded-xl"
                      style={{ background: "var(--surface-container)" }}
                    >
                      <div
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: "var(--primary)" }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: "var(--on-surface-variant)" }}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={switchMode}
                  className="flex items-center gap-2 rounded-full px-7 py-2.5 text-sm font-semibold transition-all hover:gap-3"
                  style={{
                    border: "1.5px solid var(--outline-variant)",
                    color: "var(--primary)",
                    background: "transparent",
                  }}
                >
                  Criar conta <ArrowRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <div className="mb-8 relative flex items-center justify-center">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    {[
                      { pct: 40, color: "var(--primary)", offset: 0 },
                      { pct: 25, color: "var(--tertiary)", offset: 40 },
                      {
                        pct: 20,
                        color: "var(--primary-container)",
                        offset: 65,
                      },
                      { pct: 15, color: "var(--surface-bright)", offset: 85 },
                    ].map((seg, i) => {
                      const r = 46,
                        circ = 2 * Math.PI * r;
                      const dash = (seg.pct / 100) * circ;
                      return (
                        <circle
                          key={i}
                          cx="60"
                          cy="60"
                          r={r}
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="14"
                          strokeDasharray={`${dash} ${circ - dash}`}
                          strokeDashoffset={-(seg.offset / 100) * circ}
                          style={{
                            transform: "rotate(-90deg)",
                            transformOrigin: "center",
                          }}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span
                      className="text-xs"
                      style={{ color: "var(--on-surface-variant)" }}
                    >
                      economizado
                    </span>
                    <span
                      className="text-lg font-bold tabular-nums"
                      style={{ color: "var(--on-surface)" }}
                    >
                      35%
                    </span>
                  </div>
                </div>
                <h2
                  className="font-bold leading-tight mb-3"
                  style={{
                    fontSize: "1.6rem",
                    letterSpacing: "-0.02em",
                    color: "var(--on-surface)",
                  }}
                >
                  Já tem uma{" "}
                  <span style={{ color: "var(--primary)" }}>conta?</span>
                </h2>
                <p
                  className="mb-8 leading-relaxed"
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--on-surface-variant)",
                    maxWidth: 220,
                  }}
                >
                  Entre e continue sua jornada. Seus dados financeiros estão
                  seguros e esperando.
                </p>
                <div className="flex gap-3 mb-8 w-full justify-center">
                  {[
                    { label: "Transações", value: "2.4k+" },
                    { label: "Metas ativas", value: "98%" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex-1 flex flex-col items-center py-3 rounded-xl"
                      style={{ background: "var(--surface-container)" }}
                    >
                      <span
                        className="text-lg font-bold tabular-nums"
                        style={{ color: "var(--primary)" }}
                      >
                        {stat.value}
                      </span>
                      <span
                        className="text-xs mt-0.5"
                        style={{ color: "var(--on-surface-variant)" }}
                      >
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={switchMode}
                  className="flex items-center gap-2 rounded-full px-7 py-2.5 text-sm font-semibold transition-all hover:gap-3"
                  style={{
                    border: "1.5px solid var(--outline-variant)",
                    color: "var(--primary)",
                    background: "transparent",
                  }}
                >
                  Entrar <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
