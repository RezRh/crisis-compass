import { cn } from "@/lib/utils";
import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  createContext,
  Children,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  ArrowRight,
  Mail,
  Phone,
  Gem,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  X,
  AlertCircle,
  PartyPopper,
  Loader,
  User,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  Variants,
  Transition,
} from "framer-motion";

import type { ReactNode } from "react";
import type {
  GlobalOptions as ConfettiGlobalOptions,
  CreateTypes as ConfettiInstance,
  Options as ConfettiOptions,
} from "canvas-confetti";
import confetti from "canvas-confetti";

// --- CONFETTI LOGIC ---
type Api = { fire: (options?: ConfettiOptions) => void };
export type ConfettiRef = Api | null;
const ConfettiContext = createContext({} as Api);

const Confetti = forwardRef<
  ConfettiRef,
  React.ComponentPropsWithRef<"canvas"> & {
    options?: ConfettiOptions;
    globalOptions?: ConfettiGlobalOptions;
    manualstart?: boolean;
  }
>((props, ref) => {
  const {
    options,
    globalOptions = { resize: true, useWorker: true },
    manualstart = false,
    ...rest
  } = props;
  const instanceRef = useRef<ConfettiInstance | null>(null);
  const canvasRef = useCallback(
    (node: HTMLCanvasElement) => {
      if (node !== null) {
        if (instanceRef.current) return;
        instanceRef.current = confetti.create(node, {
          ...globalOptions,
          resize: true,
        });
      } else {
        if (instanceRef.current) {
          instanceRef.current.reset();
          instanceRef.current = null;
        }
      }
    },
    [globalOptions]
  );
  const fire = useCallback(
    (opts = {}) => instanceRef.current?.({ ...options, ...opts }),
    [options]
  );
  const api = useMemo(() => ({ fire }), [fire]);
  useImperativeHandle(ref, () => api, [api]);
  useEffect(() => {
    if (!manualstart) fire();
  }, [manualstart, fire]);
  return (
    <canvas
      ref={canvasRef}
      {...rest}
      className={cn("pointer-events-none fixed inset-0 z-[100] h-full w-full", rest.className)}
    />
  );
});
Confetti.displayName = "Confetti";

// --- TEXT LOOP ANIMATION COMPONENT ---
type TextLoopProps = {
  children: React.ReactNode[];
  className?: string;
  interval?: number;
  transition?: Transition;
  variants?: Variants;
  onIndexChange?: (index: number) => void;
  stopOnEnd?: boolean;
};
export function TextLoop({
  children,
  className,
  interval = 2,
  transition = { duration: 0.3 },
  variants,
  onIndexChange,
  stopOnEnd = false,
}: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = Children.toArray(children);
  useEffect(() => {
    const intervalMs = interval * 1000;
    const timer = setInterval(() => {
      setCurrentIndex((current) => {
        if (stopOnEnd && current === items.length - 1) {
          clearInterval(timer);
          return current;
        }
        const next = (current + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [items.length, interval, onIndexChange, stopOnEnd]);
  const motionVariants: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };
  return (
    <div className={cn("relative inline-block overflow-hidden", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={currentIndex}
          variants={variants || motionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          className="block"
        >
          {items[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// --- BLUR FADE ANIMATION COMPONENT ---
interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: { hidden: { y: number }; visible: { y: number } };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
}
function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = true,
  inViewMargin = "-50px",
  blur = "6px",
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin as any });
  const isInView = !inView || inViewResult;
  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` },
  };
  const combinedVariants = variant || defaultVariants;
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="hidden"
      variants={combinedVariants}
      transition={{
        delay: 0.04 + delay,
        duration,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- GLASS BUTTON COMPONENT ---
const glassButtonVariants = cva(
  "relative isolate all-unset cursor-pointer rounded-full transition-all",
  {
    variants: {
      size: {
        default: "text-base font-medium",
        sm: "text-sm font-medium",
        lg: "text-lg font-medium",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { size: "default" },
  }
);
const glassButtonTextVariants = cva(
  "glass-button-text relative block select-none tracking-tighter",
  {
    variants: {
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
        icon: "flex h-10 w-10 items-center justify-center",
      },
    },
    defaultVariants: { size: "default" },
  }
);
export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
}
const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, onClick, ...props }, ref) => {
    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const button = e.currentTarget.querySelector("button");
      if (button && e.target !== button) button.click();
    };
    return (
      <div
        className={cn("glass-button-wrap", glassButtonVariants({ size, className }))}
        onClick={handleWrapperClick}
      >
        <button
          ref={ref}
          onClick={onClick}
          className="glass-button relative z-[2] block cursor-pointer rounded-full"
          {...props}
        >
          <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>
            {children}
          </span>
        </button>
        <div className="glass-button-shadow" />
      </div>
    );
  }
);
GlassButton.displayName = "GlassButton";

// --- GRADIENT BACKGROUND ---
const GradientBackground = () => (
  <>
    <style>{`
      @keyframes float1 { 0% { transform: translate(0, 0); } 50% { transform: translate(-10px, 10px); } 100% { transform: translate(0, 0); } }
      @keyframes float2 { 0% { transform: translate(0, 0); } 50% { transform: translate(10px, -10px); } 100% { transform: translate(0, 0); } }
    `}</style>
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="g1" cx="30%" cy="30%" r="60%">
            <stop offset="0%" stopColor="hsl(235 86% 65% / 0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="g2" cx="70%" cy="70%" r="50%">
            <stop offset="0%" stopColor="hsl(280 80% 55% / 0.2)" />
            <stop offset="50%" stopColor="hsl(200 80% 50% / 0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="g3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(160 60% 45% / 0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="blur1">
            <feGaussianBlur stdDeviation="60" />
          </filter>
          <filter id="blur2">
            <feGaussianBlur stdDeviation="80" />
          </filter>
          <filter id="blur3">
            <feGaussianBlur stdDeviation="50" />
          </filter>
        </defs>
        <rect width="120%" height="120%" x="-10%" y="-10%" fill="url(#g1)" filter="url(#blur1)" style={{ animation: "float1 12s ease-in-out infinite" }} />
        <rect width="100%" height="100%" fill="url(#g2)" filter="url(#blur2)" style={{ animation: "float2 15s ease-in-out infinite" }} />
      </svg>
    </div>
  </>
);

// --- ICONS ---
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
    </g>
  </svg>
);

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const modalSteps = [
  { message: "Signing you up...", icon: <Loader className="h-6 w-6 animate-spin" /> },
  { message: "Onboarding you...", icon: <Gem className="h-6 w-6" /> },
  { message: "Finalizing...", icon: <Loader className="h-6 w-6 animate-spin" /> },
  { message: "Welcome Aboard!", icon: <PartyPopper className="h-6 w-6" /> },
];
const TEXT_LOOP_INTERVAL = 1.5;

const DefaultLogo = () => (
  <div className="flex items-center gap-2">
    <Gem className="h-8 w-8 text-primary" />
  </div>
);

// --- AUTH MODE TYPE ---
type AuthMode = "login" | "signup";

// --- MAIN COMPONENT ---
interface AuthComponentProps {
  logo?: React.ReactNode;
  brandName?: string;
  onLogin?: (email: string, password: string) => Promise<void>;
  onRegister?: (username: string, email: string, password: string) => Promise<void>;
  onMockLogin?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const AuthComponent = ({
  logo = <DefaultLogo />,
  brandName = "Discord",
  onLogin,
  onRegister,
  onMockLogin,
  isLoading: externalLoading,
  error: externalError,
}: AuthComponentProps) => {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authStep, setAuthStep] = useState<"credentials" | "password" | "confirmPassword">("credentials");
  const [modalStatus, setModalStatus] = useState<"closed" | "loading" | "error" | "success">("closed");
  const [modalErrorMessage, setModalErrorMessage] = useState("");
  const confettiRef = useRef<ConfettiRef>(null);

  // Validation
  const isEmailValid = /\S+@\S+\.\S+/.test(emailOrPhone);
  const isPhoneValid = /^\+?[\d\s\-()]{7,}$/.test(emailOrPhone);
  const isEmailOrPhoneValid = isEmailValid || isPhoneValid;
  const isPasswordValid = password.length >= 6;
  const isConfirmPasswordValid = confirmPassword.length >= 6;
  const isUsernameValid = username.length >= 3;

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  const fireSideCanons = () => {
    const fire = confettiRef.current?.fire;
    if (fire) {
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
      const particleCount = 50;
      fire({ ...defaults, particleCount, origin: { x: 0, y: 1 }, angle: 60 });
      fire({ ...defaults, particleCount, origin: { x: 1, y: 1 }, angle: 120 });
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalStatus !== "closed") return;
    if (!isEmailOrPhoneValid || !isPasswordValid) return;

    if (onLogin) {
      setModalStatus("loading");
      try {
        await onLogin(emailOrPhone, password);
        fireSideCanons();
        setModalStatus("success");
      } catch (err: any) {
        setModalErrorMessage(err.message || "Login failed");
        setModalStatus("error");
      }
    } else {
      setModalStatus("loading");
      const loadingStepsCount = modalSteps.length - 1;
      const totalDuration = loadingStepsCount * TEXT_LOOP_INTERVAL * 1000;
      setTimeout(() => {
        fireSideCanons();
        setModalStatus("success");
      }, totalDuration);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalStatus !== "closed" || authStep !== "confirmPassword") return;

    if (password !== confirmPassword) {
      setModalErrorMessage("Passwords do not match!");
      setModalStatus("error");
    } else if (onRegister) {
      setModalStatus("loading");
      try {
        await onRegister(username, emailOrPhone, password);
        fireSideCanons();
        setModalStatus("success");
      } catch (err: any) {
        setModalErrorMessage(err.message || "Registration failed");
        setModalStatus("error");
      }
    } else {
      setModalStatus("loading");
      const loadingStepsCount = modalSteps.length - 1;
      const totalDuration = loadingStepsCount * TEXT_LOOP_INTERVAL * 1000;
      setTimeout(() => {
        fireSideCanons();
        setModalStatus("success");
      }, totalDuration);
    }
  };

  const handleProgressStep = () => {
    if (authMode === "signup") {
      if (authStep === "credentials") {
        if (isEmailOrPhoneValid && isUsernameValid) setAuthStep("password");
      } else if (authStep === "password") {
        if (isPasswordValid) setAuthStep("confirmPassword");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (authMode === "login") {
        // form submit handles it
      } else {
        handleProgressStep();
      }
    }
  };

  const handleGoBack = () => {
    if (authStep === "confirmPassword") {
      setAuthStep("password");
      setConfirmPassword("");
    } else if (authStep === "password") setAuthStep("credentials");
  };

  const switchMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
    setAuthStep("credentials");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setUsername("");
  };

  const closeModal = () => {
    setModalStatus("closed");
    setModalErrorMessage("");
  };

  useEffect(() => {
    if (authStep === "password")
      setTimeout(() => passwordInputRef.current?.focus(), 500);
    else if (authStep === "confirmPassword")
      setTimeout(() => confirmPasswordInputRef.current?.focus(), 500);
  }, [authStep]);

  useEffect(() => {
    if (modalStatus === "success") {
      fireSideCanons();
    }
  }, [modalStatus]);

  const Modal = () => (
    <AnimatePresence>
      {modalStatus !== "closed" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative rounded-2xl border border-border bg-card p-8 shadow-2xl min-w-[320px] flex flex-col items-center gap-4"
          >
            {(modalStatus === "error" || modalStatus === "success") && (
              <button onClick={closeModal} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            )}
            {modalStatus === "error" && (
              <>
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-center text-foreground font-medium">{modalErrorMessage}</p>
                <GlassButton onClick={closeModal} size="sm">Try Again</GlassButton>
              </>
            )}
            {modalStatus === "loading" && (
              <TextLoop interval={TEXT_LOOP_INTERVAL} stopOnEnd>
                {modalSteps.slice(0, -1).map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    {step.icon}
                    <p className="text-foreground font-medium">{step.message}</p>
                  </div>
                ))}
              </TextLoop>
            )}
            {modalStatus === "success" && (
              <div className="flex flex-col items-center gap-3">
                {modalSteps[modalSteps.length - 1].icon}
                <p className="text-foreground font-medium text-lg">
                  {modalSteps[modalSteps.length - 1].message}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ============================================================
  // LOGIN VIEW
  // ============================================================
  const LoginView = () => (
    <form onSubmit={handleLoginSubmit} className="w-full space-y-6">
      <BlurFade delay={0}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
        </div>
      </BlurFade>
      <BlurFade delay={0.05}>
        <p className="text-center text-muted-foreground text-sm">
          We're so excited to see you again!
        </p>
      </BlurFade>

      <BlurFade delay={0.1}>
        <div className="flex gap-3 w-full">
          <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card/50 px-4 py-3 text-sm font-medium text-foreground backdrop-blur-sm hover:bg-accent/50 transition-colors">
            <GoogleIcon />
            Google
          </button>
          <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card/50 px-4 py-3 text-sm font-medium text-foreground backdrop-blur-sm hover:bg-accent/50 transition-colors">
            <AppleIcon />
            Apple
          </button>
        </div>
      </BlurFade>

      <BlurFade delay={0.15}>
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </BlurFade>

      <div className="space-y-4">
        {/* Email or Phone */}
        <BlurFade delay={0.2}>
          <div className="space-y-1">
            <div className="relative flex items-center rounded-full border border-border bg-card/30 backdrop-blur-sm overflow-hidden h-12 px-1">
              <div className="flex items-center justify-center w-10 pl-2 text-muted-foreground">
                {isPhoneValid && !isEmailValid ? <Phone className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
              </div>
              <input
                type="text"
                placeholder="Email or Phone Number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="relative z-10 h-full w-0 flex-grow bg-transparent text-foreground placeholder:text-foreground/60 focus:outline-none pr-2"
              />
            </div>
          </div>
        </BlurFade>

        {/* Password */}
        <BlurFade delay={0.25}>
          <div className="space-y-1">
            <div className="relative flex items-center rounded-full border border-border bg-card/30 backdrop-blur-sm overflow-hidden h-12 px-1">
              <div className="flex items-center justify-center w-10 pl-2 text-muted-foreground">
                {isPasswordValid ? (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-foreground/80 hover:text-foreground transition-colors p-1 rounded-full"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative z-10 h-full w-0 flex-grow bg-transparent text-foreground placeholder:text-foreground/60 focus:outline-none pr-2"
              />
            </div>
          </div>
        </BlurFade>

        {/* Forgot Password */}
        <BlurFade delay={0.3}>
          <div className="text-right">
            <button type="button" className="text-xs text-primary hover:underline">
              Forgot your password?
            </button>
          </div>
        </BlurFade>

        {/* Error */}
        {externalError && (
          <p className="text-sm text-destructive text-center">{externalError}</p>
        )}

        {/* Login Button */}
        <BlurFade delay={0.35}>
          <div className="flex justify-center">
            <GlassButton type="submit" disabled={!isEmailOrPhoneValid || !isPasswordValid}>
              <span className="flex items-center gap-2">
                Log In
                <ArrowRight className="h-4 w-4" />
              </span>
            </GlassButton>
          </div>
        </BlurFade>

        {/* Demo Account */}
        {onMockLogin && (
          <BlurFade delay={0.38}>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onMockLogin}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Continue with Demo Account
              </button>
            </div>
          </BlurFade>
        )}

        {/* Switch to Sign Up */}
        <BlurFade delay={0.4}>
          <p className="text-center text-sm text-muted-foreground">
            Need an account?{" "}
            <button type="button" onClick={switchMode} className="text-primary hover:underline font-medium">
              Create an account
            </button>
          </p>
        </BlurFade>
      </div>
    </form>
  );

  // ============================================================
  // SIGNUP VIEW
  // ============================================================
  const SignupView = () => (
    <form onSubmit={handleSignupSubmit} className="w-full space-y-6">
      <AnimatePresence mode="wait">
        {authStep === "credentials" && (
          <motion.div key="credentials-header" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            <BlurFade delay={0}>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">Create an account</h1>
              </div>
            </BlurFade>
            <BlurFade delay={0.05}>
              <p className="text-center text-muted-foreground text-sm">Continue with</p>
            </BlurFade>
            <BlurFade delay={0.1}>
              <div className="flex gap-3 w-full">
                <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card/50 px-4 py-3 text-sm font-medium text-foreground backdrop-blur-sm hover:bg-accent/50 transition-colors">
                  <GoogleIcon />
                  Google
                </button>
                <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card/50 px-4 py-3 text-sm font-medium text-foreground backdrop-blur-sm hover:bg-accent/50 transition-colors">
                  <AppleIcon />
                  Apple
                </button>
              </div>
            </BlurFade>
            <BlurFade delay={0.15}>
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">OR</span>
                <div className="h-px flex-1 bg-border" />
              </div>
            </BlurFade>
          </motion.div>
        )}
        {authStep === "password" && (
          <motion.div key="password-header" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            <BlurFade delay={0}>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">Create your password</h1>
              </div>
            </BlurFade>
            <BlurFade delay={0.05}>
              <p className="text-center text-muted-foreground text-sm">Your password must be at least 6 characters long.</p>
            </BlurFade>
          </motion.div>
        )}
        {authStep === "confirmPassword" && (
          <motion.div key="confirm-header" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            <BlurFade delay={0}>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">One Last Step</h1>
              </div>
            </BlurFade>
            <BlurFade delay={0.05}>
              <p className="text-center text-muted-foreground text-sm">Confirm your password to continue</p>
            </BlurFade>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {authStep !== "confirmPassword" && (
            <motion.div key="signup-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Email or Phone */}
              <BlurFade delay={0.2}>
                <div className="space-y-1">
                  {authStep === "password" && (
                    <span className="text-xs text-muted-foreground ml-4">Email / Phone</span>
                  )}
                  <div className="relative flex items-center rounded-full border border-border bg-card/30 backdrop-blur-sm overflow-hidden h-12 px-1">
                    <div className={cn(
                      "flex items-center justify-center text-muted-foreground transition-all duration-300",
                      emailOrPhone.length > 20 && authStep === "credentials" ? "w-0 px-0" : "w-10 pl-2"
                    )}>
                      {isPhoneValid && !isEmailValid ? <Phone className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                    </div>
                    <input
                      type="text"
                      placeholder="Email or Phone Number"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={authStep === "password"}
                      className="relative z-10 h-full w-0 flex-grow bg-transparent text-foreground placeholder:text-foreground/60 focus:outline-none pr-2 disabled:opacity-60"
                    />
                  </div>
                </div>
              </BlurFade>

              {/* Username (signup only, credentials step) */}
              {authStep === "credentials" && (
                <BlurFade delay={0.25}>
                  <div className="space-y-1">
                    <div className="relative flex items-center rounded-full border border-border bg-card/30 backdrop-blur-sm overflow-hidden h-12 px-1">
                      <div className={cn(
                        "flex items-center justify-center text-muted-foreground transition-all duration-300",
                        username.length > 20 ? "w-0 px-0" : "w-10 pl-2"
                      )}>
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={cn(
                          "relative z-10 h-full w-0 flex-grow bg-transparent text-foreground placeholder:text-foreground/60 focus:outline-none transition-[padding-right] duration-300 ease-in-out delay-300",
                          isEmailOrPhoneValid && isUsernameValid && authStep === "credentials" ? "pr-2" : "pr-0"
                        )}
                      />
                      <div className={cn(
                        "flex items-center justify-center transition-all duration-300 overflow-hidden",
                        isEmailOrPhoneValid && isUsernameValid ? "w-12 opacity-100" : "w-0 opacity-0"
                      )}>
                        <button
                          type="button"
                          onClick={handleProgressStep}
                          className="text-primary hover:text-primary/80 transition-colors p-2 rounded-full"
                        >
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </BlurFade>
              )}

              {/* Password field (signup password step) */}
              <AnimatePresence>
                {authStep === "password" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <div className="space-y-2">
                      {password.length > 0 && (
                        <span className="text-xs text-muted-foreground ml-4">Password</span>
                      )}
                      <div className="relative flex items-center rounded-full border border-border bg-card/30 backdrop-blur-sm overflow-hidden h-12 px-1">
                        <div className="flex items-center justify-center w-10 pl-2 text-muted-foreground">
                          {isPasswordValid ? (
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-foreground/80 hover:text-foreground transition-colors p-1 rounded-full"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          ) : (
                            <Lock className="h-4 w-4" />
                          )}
                        </div>
                        <input
                          ref={passwordInputRef}
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="relative z-10 h-full w-0 flex-grow bg-transparent text-foreground placeholder:text-foreground/60 focus:outline-none"
                        />
                        <div className={cn(
                          "flex items-center justify-center transition-all duration-300 overflow-hidden",
                          isPasswordValid ? "w-12 opacity-100" : "w-0 opacity-0"
                        )}>
                          <button
                            type="button"
                            onClick={handleProgressStep}
                            className="text-primary hover:text-primary/80 transition-colors p-2 rounded-full"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <button type="button" onClick={handleGoBack} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-4">
                        <ArrowLeft className="h-3 w-3" /> Go back
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm password step */}
        <AnimatePresence>
          {authStep === "confirmPassword" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-2">
              <div className="space-y-1">
                {confirmPassword.length > 0 && (
                  <span className="text-xs text-muted-foreground ml-4">Confirm Password</span>
                )}
                <div className="relative flex items-center rounded-full border border-border bg-card/30 backdrop-blur-sm overflow-hidden h-12 px-1">
                  <div className="flex items-center justify-center w-10 pl-2 text-muted-foreground">
                    {isConfirmPasswordValid ? (
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-foreground/80 hover:text-foreground transition-colors p-1 rounded-full"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                  <input
                    ref={confirmPasswordInputRef}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="relative z-10 h-full w-0 flex-grow bg-transparent text-foreground placeholder:text-foreground/60 focus:outline-none"
                  />
                  <div className={cn(
                    "flex items-center justify-center transition-all duration-300 overflow-hidden",
                    isConfirmPasswordValid ? "w-12 opacity-100" : "w-0 opacity-0"
                  )}>
                    <button
                      type="submit"
                      className="text-primary hover:text-primary/80 transition-colors p-2 rounded-full"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <button type="button" onClick={handleGoBack} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-4">
                  <ArrowLeft className="h-3 w-3" /> Go back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {externalError && (
          <p className="text-sm text-destructive text-center">{externalError}</p>
        )}

        {/* Demo Account */}
        {onMockLogin && authStep === "credentials" && (
          <BlurFade delay={0.3}>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onMockLogin}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Continue with Demo Account
              </button>
            </div>
          </BlurFade>
        )}

        {/* Already have account link */}
        {authStep === "credentials" && (
          <BlurFade delay={0.35}>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button type="button" onClick={switchMode} className="text-primary hover:underline font-medium">
                Log In
              </button>
            </p>
          </BlurFade>
        )}
      </div>
    </form>
  );

  return (
    <div className="dark relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <style>{`
        @property --angle-1 { syntax: "<angle>"; inherits: false; initial-value: -75deg; }
        @property --angle-2 { syntax: "<angle>"; inherits: false; initial-value: -45deg; }
        .glass-button-wrap { --anim-time: 400ms; --anim-ease: cubic-bezier(0.25, 1, 0.5, 1); --border-width: clamp(1px, 0.0625em, 4px); position: relative; z-index: 2; transform-style: preserve-3d; transition: transform var(--anim-time) var(--anim-ease); }
        .glass-button-wrap:has(.glass-button:active) { transform: rotateX(25deg); }
        .glass-button-shadow { --shadow-cutoff-fix: 2em; position: absolute; width: calc(100% + var(--shadow-cutoff-fix)); height: calc(100% + var(--shadow-cutoff-fix)); top: calc(0% - var(--shadow-cutoff-fix) / 2); left: calc(0% - var(--shadow-cutoff-fix) / 2); filter: blur(clamp(2px, 0.125em, 12px)); transition: filter var(--anim-time) var(--anim-ease); pointer-events: none; z-index: 0; }
        .glass-button-shadow::after { content: ""; position: absolute; inset: 0; border-radius: 9999px; background: linear-gradient(180deg, oklch(from var(--foreground) l c h / 20%), oklch(from var(--foreground) l c h / 10%)); width: calc(100% - var(--shadow-cutoff-fix) - 0.25em); height: calc(100% - var(--shadow-cutoff-fix) - 0.25em); top: calc(var(--shadow-cutoff-fix) - 0.5em); left: calc(var(--shadow-cutoff-fix) - 0.875em); padding: 0.125em; box-sizing: border-box; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; transition: all var(--anim-time) var(--anim-ease); opacity: 1; }
        .glass-button { -webkit-tap-highlight-color: transparent; backdrop-filter: blur(clamp(1px, 0.125em, 4px)); transition: all var(--anim-time) var(--anim-ease); background: linear-gradient(-75deg, oklch(from var(--background) l c h / 5%), oklch(from var(--background) l c h / 20%), oklch(from var(--background) l c h / 5%)); box-shadow: inset 0 0.125em 0.125em oklch(from var(--foreground) l c h / 5%), inset 0 -0.125em 0.125em oklch(from var(--background) l c h / 50%), 0 0.25em 0.125em -0.125em oklch(from var(--foreground) l c h / 20%), 0 0 0.1em 0.25em inset oklch(from var(--background) l c h / 20%), 0 0 0 0 oklch(from var(--background) l c h); }
        .glass-button:hover { transform: scale(0.975); backdrop-filter: blur(0.01em); box-shadow: inset 0 0.125em 0.125em oklch(from var(--foreground) l c h / 5%), inset 0 -0.125em 0.125em oklch(from var(--background) l c h / 50%), 0 0.15em 0.05em -0.1em oklch(from var(--foreground) l c h / 25%), 0 0 0.05em 0.1em inset oklch(from var(--background) l c h / 50%), 0 0 0 0 oklch(from var(--background) l c h); }
        .glass-button-text { color: oklch(from var(--foreground) l c h / 90%); text-shadow: 0em 0.25em 0.05em oklch(from var(--foreground) l c h / 10%); transition: all var(--anim-time) var(--anim-ease); }
        .glass-button:hover .glass-button-text { text-shadow: 0.025em 0.025em 0.025em oklch(from var(--foreground) l c h / 12%); }
        .glass-button-text::after { content: ""; display: block; position: absolute; width: calc(100% - var(--border-width)); height: calc(100% - var(--border-width)); top: calc(0% + var(--border-width) / 2); left: calc(0% + var(--border-width) / 2); box-sizing: border-box; border-radius: 9999px; overflow: clip; background: linear-gradient(var(--angle-2), transparent 0%, oklch(from var(--background) l c h / 50%) 40% 50%, transparent 55%); z-index: 3; mix-blend-mode: screen; pointer-events: none; background-size: 200% 200%; background-position: 0% 50%; transition: background-position calc(var(--anim-time) * 1.25) var(--anim-ease), --angle-2 calc(var(--anim-time) * 1.25) var(--anim-ease); }
        .glass-button:hover .glass-button-text::after { background-position: 25% 50%; }
        .glass-button:active .glass-button-text::after { background-position: 50% 15%; --angle-2: 15deg; }
        .glass-button-text::before { content: ""; display: block; position: absolute; width: calc(100% - var(--border-width)); height: calc(100% - var(--border-width)); top: calc(0% + var(--border-width) / 2); left: calc(0% + var(--border-width) / 2); box-sizing: border-box; border-radius: 9999px; overflow: clip; border: var(--border-width) solid transparent; mask: linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0); mask-composite: exclude; background: linear-gradient(var(--angle-1), transparent 25%, oklch(from var(--foreground) l c h / 60%) 35%, oklch(from var(--foreground) l c h / 60%) 45%, transparent 65%, transparent 75%, oklch(from var(--foreground) l c h / 30%) 80%, transparent 95%) border-box; z-index: 3; transition: --angle-1 calc(var(--anim-time) * 1.25) var(--anim-ease); }
        .glass-button:hover .glass-button-text::before { --angle-1: -45deg; }
        .glass-button:active .glass-button-text::before { --angle-1: -15deg; }
      `}</style>
      <GradientBackground />
      <Confetti ref={confettiRef} manualstart className="pointer-events-none" />
      <Modal />

      <div className="relative z-10 w-full max-w-[420px] rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl p-8 shadow-2xl">
        <div className="mb-6 flex justify-center">{logo}</div>
        <AnimatePresence mode="wait">
          {authMode === "login" ? (
            <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <LoginView />
            </motion.div>
          ) : (
            <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <SignupView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
