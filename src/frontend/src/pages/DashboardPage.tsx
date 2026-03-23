import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Cpu,
  DollarSign,
  ExternalLink,
  Facebook,
  Instagram,
  LogOut,
  MessageCircle,
  Package,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { useAllInventoryProducts } from "../hooks/useQueries";
import { getDailyBatch } from "../utils/dailyBatch";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MemberRecord {
  id: number;
  name: string;
  email: string;
  gender: string;
  commission: number;
  status: "Pending" | "Paid";
}

interface EarningsData {
  totalEarned: number;
  pendingPayout: number;
  linksGenerated: number;
  transactions: {
    product: string;
    amount: number;
    time: string;
    status: string;
  }[];
}

// ─── Member Login Gate ─────────────────────────────────────────────────────────

function MemberLoginGate({ onLogin }: { onLogin: (m: MemberRecord) => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const membersRaw = localStorage.getItem("ebs_members");
    if (!membersRaw) {
      setError("No member data loaded yet. Please contact admin.");
      setLoading(false);
      return;
    }

    let members: MemberRecord[];
    try {
      members = JSON.parse(membersRaw);
    } catch {
      setError("Member data corrupted. Please contact admin.");
      setLoading(false);
      return;
    }

    const trimmed = input.trim();
    const isNumeric = /^\d+$/.test(trimmed);
    let found: MemberRecord | undefined;

    if (isNumeric) {
      const id = Number.parseInt(trimmed, 10);
      found = members.find((m) => m.id === id);
    } else {
      found = members.find(
        (m) => m.email.toLowerCase() === trimmed.toLowerCase(),
      );
    }

    if (!found) {
      setError("Member not found. Please check your Member ID or Email.");
      setLoading(false);
      return;
    }

    localStorage.setItem("ebs_current_member", JSON.stringify(found));
    onLogin(found);
    setLoading(false);
  };

  return (
    <main
      className="min-h-screen bg-muted/30 flex items-center justify-center p-4"
      data-ocid="login.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-saffron text-xs uppercase tracking-widest font-bold"
              data-ocid="login.link"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> {t("Back to Home")}
            </Button>
          </Link>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-saffron">
            EarningBySurfing
          </span>
        </div>

        <Card className="border border-saffron/20 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-saffron flex items-center justify-center">
              <User className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-2xl font-black uppercase tracking-widest text-saffron">
              {t("Member Access")}
            </CardTitle>
            <p className="text-xs text-muted-foreground normal-case mt-2 leading-relaxed">
              Enter your Member ID or Email to access your personalized
              dashboard
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Member ID or Email"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="border-saffron/40 focus-visible:ring-saffron text-sm normal-case h-12"
                  autoComplete="email"
                  data-ocid="login.input"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-semibold text-destructive normal-case text-center"
                  data-ocid="login.error_state"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                className="w-full bg-saffron hover:bg-saffron-dark text-white font-black uppercase tracking-widest text-sm h-12"
                disabled={!input.trim() || loading}
                data-ocid="login.submit_button"
              >
                {loading ? "Checking..." : t("Access Dashboard")}
              </Button>
            </form>

            <p className="text-[11px] text-muted-foreground normal-case text-center mt-4">
              Your Member ID was provided upon registration. Contact admin if
              you need help.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

// ─── Notification Badge ────────────────────────────────────────────────────────

function NewProductsBadge({ memberId }: { memberId: number }) {
  const key = `ebs_badge_dismissed_${memberId}`;
  const [visible, setVisible] = useState(() => {
    const val = localStorage.getItem(key);
    if (!val) return true;
    return Date.now() - Number(val) >= 24 * 60 * 60 * 1000;
  });

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-saffron text-white rounded-xl px-5 py-3 flex items-center justify-between mb-6 shadow-md"
      data-ocid="dashboard.toast"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">🎁</span>
        <div>
          <p className="text-sm font-black uppercase tracking-widest">
            Your 10 New Products are Ready!
          </p>
          <p className="text-xs text-white/80 normal-case">
            Personalized daily batch — refreshes every 24 hours
          </p>
        </div>
      </div>
      <button
        type="button"
        className="ml-4 text-white/80 hover:text-white transition-colors flex-shrink-0"
        onClick={() => {
          localStorage.setItem(key, Date.now().toString());
          setVisible(false);
        }}
        aria-label="Dismiss notification"
        data-ocid="dashboard.close_button"
      >
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="border border-border shadow-card">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-saffron/10 rounded-lg">
              <Icon className="h-5 w-5 text-saffron" />
            </div>
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-semibold normal-case">
              {label}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-black text-saffron uppercase tracking-wide">
            {value}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Inventory Product Card ────────────────────────────────────────────────────

function InventoryProductCard({
  name,
  category,
  price,
  affiliateLink,
  memberId,
  index,
  onSmartLinkGenerated,
}: {
  name: string;
  category: string;
  price: number;
  affiliateLink: string;
  memberId: number;
  index: number;
  onSmartLinkGenerated: (name: string) => void;
}) {
  const [smartLink, setSmartLink] = useState<string | null>(null);
  const { t } = useLanguage();

  const generateSmartLink = () => {
    const link = `${affiliateLink}${affiliateLink.includes("?") ? "&" : "?"}ref=MEMBER_${memberId}`;
    setSmartLink(link);
    onSmartLinkGenerated(name);
    navigator.clipboard
      .writeText(link)
      .then(() => toast.success("Smart Link copied to clipboard!"))
      .catch(() => toast.success(`Smart Link: ${link}`));
  };

  const openWhatsApp = () => {
    const link =
      smartLink ??
      `${affiliateLink}${affiliateLink.includes("?") ? "&" : "?"}ref=MEMBER_${memberId}`;
    const message = `🔥 *${name}*\n\n💰 Price: $${price.toFixed(2)}\n🏷️ Category: ${category}\n\n🛒 Shop Now: ${link}\n\n#EarningBySurfing #AffiliateDeals #OnlineDeals`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      className="bg-white rounded-xl shadow-card border border-border overflow-hidden"
      data-ocid={`hunter.item.${index + 1}`}
    >
      <div className="h-1.5 bg-saffron" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <Badge className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-saffron/10 text-saffron border-0 rounded-full mb-2">
              {category}
            </Badge>
            <h3 className="text-sm font-black uppercase tracking-wide text-foreground leading-snug line-clamp-2">
              {name}
            </h3>
          </div>
          <span className="text-lg font-black text-saffron flex-shrink-0">
            ${price.toFixed(2)}
          </span>
        </div>

        {smartLink && (
          <div className="flex items-center gap-1.5 bg-saffron/5 border border-saffron/20 rounded px-2.5 py-1.5 mb-3">
            <ExternalLink className="h-3 w-3 text-saffron flex-shrink-0" />
            <p className="text-[10px] text-saffron font-mono truncate normal-case">
              {smartLink}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-auto">
          <Button
            size="sm"
            className="w-full bg-saffron hover:bg-saffron-dark text-white text-xs uppercase tracking-widest font-bold"
            onClick={generateSmartLink}
            data-ocid={`hunter.button.${index + 1}`}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            {t("GENERATE SMART LINK")}
          </Button>
          <Button
            size="sm"
            className="w-full bg-saffron hover:bg-amber-500 text-white text-xs uppercase tracking-widest font-bold"
            onClick={openWhatsApp}
            data-ocid={`hunter.secondary_button.${index + 1}`}
          >
            <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
            {t("WHATSAPP MARKETING POSTER")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function InventoryProductSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-card border border-border overflow-hidden">
      <div className="h-1.5 bg-muted" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

// ─── Analytics Section ─────────────────────────────────────────────────────────

type IntentLevel = "HIGH" | "MED" | "LOW";

interface TrendingTopic {
  topic: string;
  engagement: string;
  intent: IntentLevel;
}

interface PlatformData {
  name: string;
  Icon: React.ElementType;
  topics: TrendingTopic[];
}

const platformData: PlatformData[] = [
  {
    name: "Facebook",
    Icon: Facebook,
    topics: [
      {
        topic: "Wireless Earbuds 2026",
        engagement: "18.2K engagements",
        intent: "HIGH",
      },
      {
        topic: "Home Fitness Equipment",
        engagement: "14.7K engagements",
        intent: "HIGH",
      },
      {
        topic: "Smart Home Devices",
        engagement: "9.3K engagements",
        intent: "MED",
      },
      {
        topic: "Wellness Supplements",
        engagement: "7.1K engagements",
        intent: "MED",
      },
    ],
  },
  {
    name: "Instagram",
    Icon: Instagram,
    topics: [
      {
        topic: "Tech Gadgets Unboxing",
        engagement: "22.4K engagements",
        intent: "HIGH",
      },
      {
        topic: "Luxury Travel Gear",
        engagement: "16.9K engagements",
        intent: "HIGH",
      },
      {
        topic: "Organic Skincare",
        engagement: "11.2K engagements",
        intent: "MED",
      },
      {
        topic: "Fitness Trackers",
        engagement: "19.8K engagements",
        intent: "HIGH",
      },
    ],
  },
  {
    name: "WhatsApp",
    Icon: MessageCircle,
    topics: [
      {
        topic: "Work From Home Gear",
        engagement: "12.6K engagements",
        intent: "HIGH",
      },
      {
        topic: "Budget Laptops Under $500",
        engagement: "15.3K engagements",
        intent: "HIGH",
      },
      {
        topic: "Protein Supplements",
        engagement: "8.4K engagements",
        intent: "MED",
      },
      {
        topic: "Yoga Mats & Equipment",
        engagement: "4.1K engagements",
        intent: "LOW",
      },
    ],
  },
];

function IntentBadge({ level }: { level: IntentLevel }) {
  if (level === "HIGH") {
    return (
      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-saffron text-white">
        HIGH
      </span>
    );
  }
  if (level === "MED") {
    return (
      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
        MED
      </span>
    );
  }
  return (
    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
      LOW
    </span>
  );
}

function AnalyticsBuyerSection() {
  const { t } = useLanguage();
  const [headlines, setHeadlines] = useState<Record<string, string>>({});
  return (
    <section className="mb-10" data-ocid="analytics.section">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-saffron/10 rounded-lg">
            <BarChart3 className="h-5 w-5 text-saffron" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-widest text-saffron">
            {t("ANALYTICS & BUYER INTENT")}
          </h2>
        </div>
        <p className="text-xs text-muted-foreground normal-case pl-12">
          Live trending data from social platforms — identify high-intent buyers
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platformData.map((platform, pi) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + pi * 0.1, duration: 0.5 }}
            className="bg-white rounded-xl border border-border shadow-card overflow-hidden"
            data-ocid="analytics.panel"
          >
            <div className="bg-gradient-to-r from-saffron to-amber-400 px-4 py-3 flex items-center gap-2">
              <platform.Icon className="h-4 w-4 text-white" />
              <span className="text-xs font-black uppercase tracking-widest text-white">
                {platform.name}
              </span>
            </div>
            <div className="p-3 space-y-2">
              {platform.topics.map((topic) => (
                <div
                  key={topic.topic}
                  className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-muted/30 hover:bg-saffron/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground leading-snug mb-0.5">
                        {topic.topic}
                      </p>
                      <p className="text-[10px] text-muted-foreground normal-case">
                        {topic.engagement}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <IntentBadge level={topic.intent} />
                      <ArrowUpRight className="h-3 w-3 text-saffron" />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="self-start border border-[#FF9933] text-[#FF9933] text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full hover:bg-[#FF9933] hover:text-white transition-colors"
                    onClick={() => {
                      const key = `${platform.name}-${topic.topic}`;
                      setHeadlines((prev) => ({
                        ...prev,
                        [key]: `🔥 ${topic.topic}: Trending Now — Don't Miss Exclusive Deals!`,
                      }));
                    }}
                    data-ocid="analytics.button"
                  >
                    Get AI Ad Headline
                  </button>
                  {headlines[`${platform.name}-${topic.topic}`] && (
                    <p className="text-xs italic text-[#FF9933] normal-case leading-snug">
                      {headlines[`${platform.name}-${topic.topic}`]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground normal-case mt-3 text-center italic">
        Trending insights are AI-curated estimates. Connect your social accounts
        for live data.
      </p>
    </section>
  );
}

// ─── My Earnings ───────────────────────────────────────────────────────────────

function MyEarningsSection({
  earningsData,
  onReset,
}: { earningsData: EarningsData; onReset?: () => void }) {
  const { t } = useLanguage();
  return (
    <section className="mb-10" data-ocid="earnings.section">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-saffron/10 rounded-lg">
            <DollarSign className="h-5 w-5 text-saffron" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-widest text-saffron">
            {t("MY EARNINGS")}
          </h2>
        </div>
        <p className="text-xs text-muted-foreground normal-case pl-12">
          Track your commissions from generated smart links in real time.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          className="bg-white rounded-xl border border-border shadow-card p-4 flex items-center gap-3"
          data-ocid="earnings.card"
        >
          <div className="p-2 bg-saffron/10 rounded-lg">
            <DollarSign className="h-5 w-5 text-saffron" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Total Earned
            </p>
            <p className="text-2xl font-black text-saffron">
              ${earningsData.totalEarned.toFixed(2)}
            </p>
          </div>
        </div>
        <div
          className="bg-white rounded-xl border border-border shadow-card p-4 flex items-center gap-3"
          data-ocid="earnings.card"
        >
          <div className="p-2 bg-saffron/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-saffron" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Pending Payout
            </p>
            <p className="text-2xl font-black text-saffron">
              ${earningsData.pendingPayout.toFixed(2)}
            </p>
          </div>
        </div>
        <div
          className="bg-white rounded-xl border border-border shadow-card p-4 flex items-center gap-3"
          data-ocid="earnings.card"
        >
          <div className="p-2 bg-saffron/10 rounded-lg">
            <ExternalLink className="h-5 w-5 text-saffron" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Links Generated
            </p>
            <p className="text-2xl font-black text-saffron">
              {earningsData.linksGenerated}
            </p>
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-xl border border-border shadow-card overflow-hidden"
        data-ocid="earnings.table"
      >
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-saffron">
            Recent Transactions
          </span>
          {onReset && earningsData.transactions.length > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="text-[10px] text-muted-foreground hover:text-saffron underline normal-case"
            >
              Clear
            </button>
          )}
        </div>
        {earningsData.transactions.length === 0 ? (
          <div className="py-10 text-center" data-ocid="earnings.empty_state">
            <DollarSign className="h-8 w-8 text-saffron/30 mx-auto mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Generate smart links to start earning
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {earningsData.transactions.map((tx, i) => (
              <div
                key={`${tx.product}-${i}`}
                className="flex items-center justify-between px-4 py-3"
                data-ocid={`earnings.row.${i + 1}`}
              >
                <div>
                  <p className="text-xs font-bold text-foreground line-clamp-1">
                    {tx.product}
                  </p>
                  <p className="text-[10px] text-muted-foreground normal-case">
                    {tx.time}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-saffron">
                    +${tx.amount.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-saffron/10 text-saffron">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { t } = useLanguage();
  const { data: inventoryProducts = [], isLoading: productsLoading } =
    useAllInventoryProducts();

  const [currentMember, setCurrentMember] = useState<MemberRecord | null>(
    () => {
      const stored = localStorage.getItem("ebs_current_member");
      if (!stored) return null;
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    },
  );

  const [earningsData, setEarningsData] = useState<EarningsData>({
    totalEarned: 0,
    pendingPayout: 0,
    linksGenerated: 0,
    transactions: [],
  });

  const handleLogout = () => {
    localStorage.removeItem("ebs_current_member");
    setCurrentMember(null);
    toast.success("Logged out successfully.");
  };

  // Show login gate if no member
  if (!currentMember) {
    return <MemberLoginGate onLogin={setCurrentMember} />;
  }

  // Compute daily batch
  const dailyBatch = getDailyBatch(currentMember.id, inventoryProducts);

  const handleSmartLinkGenerated = (productName: string) => {
    const commission = Math.random() * (15 - 2.5) + 2.5;
    setEarningsData((prev) => ({
      totalEarned: prev.totalEarned + commission,
      pendingPayout: prev.pendingPayout + commission,
      linksGenerated: prev.linksGenerated + 1,
      transactions: [
        {
          product: productName,
          amount: commission,
          time: "Just now",
          status: "PENDING",
        },
        ...prev.transactions,
      ],
    }));
  };

  const joinDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const recentActivities = [
    { action: "Accessed Personalized Dashboard", time: "Just now" },
    { action: "Daily Product Batch Generated", time: "Today" },
    { action: "Account Active", time: "Ongoing" },
    { action: "Member Since Registration", time: joinDate },
  ];

  return (
    <main className="min-h-screen bg-muted/30" data-ocid="dashboard.page">
      {/* Header strip */}
      <div className="bg-saffron text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest">
            {t("MEMBER DASHBOARD")}
          </span>
          <Link to="/">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 text-xs uppercase tracking-wider font-bold"
              data-ocid="dashboard.link"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> {t("Back to Home")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between flex-wrap gap-3"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-1">
              {t("Welcome Back")}
            </p>
            <h1 className="text-3xl font-black text-saffron uppercase tracking-wide">
              {currentMember.name}
            </h1>
            <p className="text-xs text-muted-foreground normal-case mt-1">
              Member ID:{" "}
              <span className="font-bold text-foreground">
                {currentMember.id}
              </span>
              {" · "}
              {currentMember.email}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-saffron text-saffron hover:bg-saffron hover:text-white font-bold uppercase tracking-widest text-xs"
            onClick={handleLogout}
            data-ocid="dashboard.secondary_button"
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" /> Logout
          </Button>
        </motion.div>

        {/* Notification Badge */}
        <NewProductsBadge memberId={currentMember.id} />

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon={Activity}
            label={t("Member ID")}
            value={`#${currentMember.id}`}
            delay={0.1}
          />
          <StatCard
            icon={Calendar}
            label={t("Member Since")}
            value={joinDate}
            delay={0.2}
          />
          <StatCard
            icon={Shield}
            label={t("Account Status")}
            value={t("Active")}
            delay={0.3}
          />
        </div>

        {/* ─── My Earnings ─── */}
        <MyEarningsSection
          earningsData={earningsData}
          onReset={() =>
            setEarningsData({
              totalEarned: 0,
              pendingPayout: 0,
              linksGenerated: 0,
              transactions: [],
            })
          }
        />

        {/* ─── Daily Product Batch ─── */}
        <section className="mb-10" data-ocid="hunter.section">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-saffron/10 rounded-lg">
                <Cpu className="h-5 w-5 text-saffron" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest text-saffron">
                  Your Daily Product Batch
                </h2>
                <p className="text-xs text-muted-foreground normal-case">
                  Personalized for You — refreshes every 24 hours
                </p>
              </div>
            </div>
          </motion.div>

          {productsLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="hunter.loading_state"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <InventoryProductSkeleton key={i} />
              ))}
            </div>
          ) : dailyBatch.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailyBatch.map(([id, product], i) => (
                <InventoryProductCard
                  key={id.toString()}
                  name={product.name}
                  category={product.category}
                  price={product.price}
                  affiliateLink={product.affiliateLink}
                  memberId={currentMember.id}
                  index={i}
                  onSmartLinkGenerated={handleSmartLinkGenerated}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-saffron/30"
              data-ocid="hunter.empty_state"
            >
              <Package className="h-12 w-12 text-saffron/30 mb-3" />
              <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                No products in catalog yet
              </p>
              <p className="text-xs text-muted-foreground normal-case mt-1">
                Ask your admin to seed the product catalog.
              </p>
            </div>
          )}
        </section>

        {/* ─── Analytics & Buyer Intent ─── */}
        <AnalyticsBuyerSection />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="shadow-card" data-ocid="activity.panel">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-saffron flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((item) => (
                    <div
                      key={item.action}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <span className="text-sm font-medium normal-case text-foreground">
                        {item.action}
                      </span>
                      <span className="text-xs text-muted-foreground normal-case">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Card */}
          <Card className="shadow-card" data-ocid="profile.panel">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest text-saffron flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-saffron flex items-center justify-center">
                  <span className="text-white font-black text-2xl uppercase">
                    {currentMember.name[0] || "M"}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="font-black uppercase tracking-wide text-foreground text-lg">
                  {currentMember.name}
                </p>
                <p className="text-xs text-muted-foreground normal-case mt-1">
                  {currentMember.email}
                </p>
              </div>
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                    Member ID
                  </span>
                  <span className="font-bold text-foreground">
                    #{currentMember.id}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                    Gender
                  </span>
                  <span className="font-bold text-foreground normal-case">
                    {currentMember.gender || "—"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </span>
                  <span className="font-bold text-saffron uppercase">
                    {t("Active")}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                    Commission
                  </span>
                  <span className="font-bold text-saffron">
                    ${currentMember.commission.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
