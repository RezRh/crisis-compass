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
    <div className="dark flex min-h-screen items-center justify-center bg-server-bar p-4">
      <div className="w-full max-w-[480px] rounded-md bg-chat-bg p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-[25px] font-bold text-foreground leading-tight">
            {isRegister ? "Create an account" : "Welcome back!"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isRegister ? "We're so excited to see you!" : "We're so excited to see you again!"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-[0.02em] text-muted-foreground">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={isRegister}
                className="h-10 rounded-[3px] border-none bg-server-bar text-foreground"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-[0.02em] text-muted-foreground">
              Email or Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 rounded-[3px] border-none bg-server-bar text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-[0.02em] text-muted-foreground">
              Password <span className="text-destructive">*</span>
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10 rounded-[3px] border-none bg-server-bar text-foreground"
            />
            {!isRegister && (
              <button type="button" className="text-[13px] font-medium text-[hsl(197_100%_48%)] hover:underline">
                Forgot your password?
              </button>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="h-11 w-full rounded-[3px] bg-primary font-medium text-primary-foreground hover:bg-primary/80" disabled={isLoading}>
            {isLoading ? "Loading..." : isRegister ? "Continue" : "Log In"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-11 w-full rounded-[3px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
            onClick={loginMock}
          >
            Continue with Demo Account
          </Button>
        </form>

        <p className="mt-2 text-[13px] text-muted-foreground">
          {isRegister ? "Already have an account?" : "Need an account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="font-medium text-[hsl(197_100%_48%)] hover:underline"
          >
            {isRegister ? "Log In" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
