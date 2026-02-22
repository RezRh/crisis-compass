import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="flex min-h-screen items-center justify-center bg-server-bar p-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            {isRegister ? "Create an account" : "Welcome back!"}
          </CardTitle>
          <CardDescription>
            {isRegister ? "We're so excited to see you!" : "We're so excited to see you again!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Username
                </Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={isRegister}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Password
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : isRegister ? "Register" : "Log In"}
            </Button>

            <Button type="button" variant="outline" className="w-full" onClick={loginMock}>
              Continue with Demo Account
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isRegister ? "Already have an account?" : "Need an account?"}{" "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary hover:underline"
            >
              {isRegister ? "Log In" : "Register"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
