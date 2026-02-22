import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const { login, register, loginMock, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      await register(username, email, password);
    } else {
      await login(email, password);
    }
  };

  return (
    <div className="dark relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <svg width="28" height="20" viewBox="0 0 28 20" className="text-primary-foreground">
              <path fill="currentColor" d="M23.021 1.677A21.227 21.227 0 0017.658 0c-.252.462-.483.935-.687 1.418a19.931 19.931 0 00-5.943 0A13.163 13.163 0 0010.34 0a21.227 21.227 0 00-5.365 1.677C1.29 7.692.26 13.56.82 19.35A21.39 21.39 0 007.36 20a15.773 15.773 0 001.38-2.244 13.9 13.9 0 01-2.174-1.042c.182-.132.36-.27.532-.41a15.15 15.15 0 0012.804 0c.175.14.352.278.532.41a13.94 13.94 0 01-2.178 1.044A15.862 15.862 0 0019.636 20a21.37 21.37 0 006.543-4.65c.655-6.756-1.114-12.573-4.658-17.673z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isRegister ? "Create an account" : "Welcome back!"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isRegister ? "We're so excited to see you!" : "We're so excited to see you again!"}
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={isRegister}
                  className="h-11 border-border bg-input text-foreground"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-border bg-input text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 border-border bg-input text-foreground"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="h-11 w-full font-semibold" disabled={isLoading}>
              {isLoading ? "Loading..." : isRegister ? "Register" : "Log In"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full font-semibold"
              onClick={loginMock}
            >
              Continue with Demo Account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isRegister ? "Already have an account?" : "Need an account?"}{" "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="font-medium text-primary hover:underline"
            >
              {isRegister ? "Log In" : "Register"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
