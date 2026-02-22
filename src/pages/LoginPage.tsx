import { useAuthStore } from "@/stores/auth-store";
import { AuthComponent } from "@/components/ui/sign-up";
import { Gem } from "lucide-react";

export function LoginPage() {
  const { login, register, loginMock, isLoading, error } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    await register(username, email, password);
  };

  return (
    <AuthComponent
      logo={
        <div className="flex items-center gap-2">
          <Gem className="h-8 w-8 text-primary" />
        </div>
      }
      brandName="Discord"
      onLogin={handleLogin}
      onRegister={handleRegister}
      onMockLogin={loginMock}
      isLoading={isLoading}
      error={error}
    />
  );
}
