import { useState, useCallback } from "react";
import { ArrowLeft, Share, Link2, QrCode, MessageCircle, Mail, ChevronRight, AtSign, Send } from "lucide-react";

const shareOptions = [
  { icon: Share, label: "Share Invite", color: "bg-white/[0.08]", iconColor: "text-muted-foreground" },
  { icon: Link2, label: "Copy Link", color: "bg-white/[0.08]", iconColor: "text-muted-foreground" },
  { icon: QrCode, label: "QR Code", color: "bg-white/[0.08]", iconColor: "text-muted-foreground" },
  { icon: MessageCircle, label: "Messages", color: "bg-discord-green", iconColor: "text-white" },
  { icon: null, label: "Gmail", color: "", iconColor: "", emoji: "📧", customBg: "bg-white" },
  { icon: null, label: "Telegram", color: "", iconColor: "", emoji: "✈️", customBg: "bg-[#27A7E7]" },
  { icon: null, label: "WhatsApp", color: "", iconColor: "", emoji: "💬", customBg: "bg-[#25D366]" },
  { icon: null, label: "X", color: "", iconColor: "", emoji: "𝕏", customBg: "bg-black border border-white/[0.12]" },
  { icon: null, label: "Signal", color: "", iconColor: "", emoji: "🔵", customBg: "bg-[#3A76F0]" },
];

export function AddFriendsView({ onBack }: { onBack: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrolled(e.currentTarget.scrollTop > 10);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col bg-server-bar overflow-y-auto" onScroll={handleScroll}>
      {/* Header */}
      <div className="sticky top-0 z-10 pt-2">
        <div
          className={`pointer-events-none absolute inset-0 transition-all duration-75 backdrop-blur-sm ${scrolled ? "backdrop-blur-md" : ""}`}
          style={{
            maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          }}
        />
        <div className="relative flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-[17px] font-bold text-foreground">Add Friends</h2>
          <div className="w-8" />
        </div>
      </div>

      {/* Horizontally scrollable share options */}
      <div className="px-4 pb-4">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {shareOptions.map((opt, i) => (
            <button key={i} className="flex flex-col items-center gap-1.5 min-w-[64px]">
              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${opt.customBg || opt.color}`}>
                {opt.icon ? (
                  <opt.icon className={`h-6 w-6 ${opt.iconColor}`} />
                ) : opt.label === "Gmail" ? (
                  <GmailIcon />
                ) : opt.label === "Telegram" ? (
                  <TelegramIcon />
                ) : opt.label === "WhatsApp" ? (
                  <WhatsAppIcon />
                ) : opt.label === "X" ? (
                  <span className="text-white text-lg font-bold">𝕏</span>
                ) : opt.label === "Signal" ? (
                  <SignalIcon />
                ) : null}
              </div>
              <span className="text-[11px] text-muted-foreground truncate max-w-[64px]">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add by Username */}
      <div className="mx-4 mb-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
        <button className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.04]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08]">
            <AtSign className="h-5 w-5 text-muted-foreground" />
          </div>
          <span className="flex-1 text-left text-[15px] font-semibold text-foreground">Add by Username</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Find your friends card */}
      <div className="mx-4 mb-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden p-6">
        <div className="flex flex-col items-center text-center">
          {/* Illustration placeholder */}
          <div className="mb-4 flex items-center gap-[-8px]">
            <div className="h-28 w-20 rounded-2xl bg-primary/30 flex items-center justify-center text-4xl -rotate-6">
              📱
            </div>
            <div className="h-28 w-20 rounded-2xl bg-discord-green/30 flex items-center justify-center text-4xl rotate-6 -ml-4">
              🤝
            </div>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">Find your friends</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Sync your phone contacts to find people you know.{" "}
            <span className="text-primary cursor-pointer">Learn More</span>
          </p>
          <button className="w-full rounded-full bg-primary py-3 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Find friends
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Brand icons as simple SVG components ── */

function GmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
      <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" fill="#fff" />
      <path d="M22 6l-10 7L2 6" stroke="#EA4335" strokeWidth="1.5" fill="none" />
      <path d="M2 6l4 3" stroke="#4285F4" strokeWidth="1.5" />
      <path d="M22 6l-4 3" stroke="#34A853" strokeWidth="1.5" />
      <path d="M6 9v9" stroke="#4285F4" strokeWidth="1.5" />
      <path d="M18 9v9" stroke="#34A853" strokeWidth="1.5" />
      <path d="M2 18l4-3" stroke="#FBBC05" strokeWidth="1.5" />
      <path d="M22 18l-4-3" stroke="#EA4335" strokeWidth="1.5" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="white">
      <path d="M9.04 15.54l-.3 4.17c.43 0 .62-.19.85-.42l2.04-1.96 4.22 3.11c.78.43 1.33.2 1.54-.72l2.8-13.18c.24-1.14-.43-1.58-1.2-1.3L3.06 10.93c-1.1.43-1.08 1.05-.19 1.33l4.43 1.39 10.29-6.48c.49-.3.93-.14.56.19L9.04 15.54z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.29-1.248l-.29-.174-3.07.806.82-2.99-.19-.3A7.96 7.96 0 014 12a8 8 0 1116 0 8 8 0 01-8 8z" />
    </svg>
  );
}

function SignalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="white">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
    </svg>
  );
}
