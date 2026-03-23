import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  Calendar,
  Cpu,
  ExternalLink,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Category } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllProducts,
  useCallerUserProfile,
  useMemberStats,
  useSaveProfile,
} from "../hooks/useQueries";

const CATEGORY_LABELS: Record<Category, string> = {
  [Category.shoesAndClothes]: "Fashion",
  [Category.toys]: "Toys",
  [Category.technology]: "Tech",
  [Category.books]: "Books",
  [Category.tech]: "Tech",
  [Category.lifestyle]: "Lifestyle",
  [Category.wellness]: "Wellness",
};

function StatCard({
  icon: Icon,
  label,
  value,
  delay,
}: { icon: React.ElementType; label: string; value: string; delay: number }) {
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

function QualityScorePill({ score }: { score: bigint }) {
  const num = Number(score);
  const isHigh = num >= 90;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
        isHigh ? "bg-saffron text-white" : "bg-amber-100 text-amber-700"
      }`}
    >
      <Star className="h-3 w-3 fill-current" />
      {num}
    </span>
  );
}

function ProductHunterCard({
  id,
  title,
  category,
  description,
  aiReview,
  qualityScore,
  index,
}: {
  id: bigint;
  title: string;
  category: Category;
  description: string;
  aiReview: string;
  qualityScore: bigint;
  index: number;
}) {
  const [smartLink, setSmartLink] = useState<string | null>(null);

  const generateSmartLink = () => {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const link = `https://earningbysurfing.com/ref/${id.toString()}-${code}`;
    setSmartLink(link);
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("Smart Link copied to clipboard!");
      })
      .catch(() => {
        toast.success(`Smart Link generated: ${link}`);
      });
  };

  const openWhatsApp = () => {
    const link =
      smartLink ?? `https://earningbysurfing.com/ref/${id.toString()}-XXXX`;
    const message = `🔥 *${title}*\n\n⭐ Quality Score: ${Number(qualityScore)}/100\n\n${aiReview}\n\n🛒 Shop Now: ${link}\n\n#EarningBySurfing #AffiliateDeals`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="bg-white rounded-lg shadow-card border border-border overflow-hidden"
      data-ocid={`hunter.item.${index + 1}`}
    >
      {/* Card top: gradient bar */}
      <div className="h-1.5 bg-saffron" />
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <Badge className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-saffron/10 text-saffron border-0 rounded-full mb-2">
              {CATEGORY_LABELS[category]}
            </Badge>
            <h3 className="text-sm font-black uppercase tracking-wide text-foreground leading-snug line-clamp-2">
              {title}
            </h3>
          </div>
          <QualityScorePill score={qualityScore} />
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground normal-case leading-relaxed mb-3 line-clamp-2">
          {description}
        </p>

        {/* AI Review */}
        <div className="bg-muted/40 rounded-md p-3 mb-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="h-3.5 w-3.5 text-saffron flex-shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest text-saffron">
              AI-Generated Review
            </span>
          </div>
          <p className="text-xs italic text-muted-foreground normal-case leading-relaxed">
            {aiReview}
          </p>
        </div>

        {/* Smart link display */}
        {smartLink && (
          <div className="flex items-center gap-1.5 bg-saffron/5 border border-saffron/20 rounded px-2.5 py-1.5 mb-3">
            <ExternalLink className="h-3 w-3 text-saffron flex-shrink-0" />
            <p className="text-[10px] text-saffron font-mono truncate normal-case">
              {smartLink}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            className="w-full bg-saffron hover:bg-saffron-dark text-white text-xs uppercase tracking-widest font-bold"
            onClick={generateSmartLink}
            data-ocid={`hunter.button.${index + 1}`}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Generate Smart Link
          </Button>
          <Button
            size="sm"
            className="w-full bg-green-500 hover:bg-green-600 text-white text-xs uppercase tracking-widest font-bold"
            onClick={openWhatsApp}
            data-ocid={`hunter.secondary_button.${index + 1}`}
          >
            <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
            WhatsApp Marketing Poster
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductHunterSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
      <div className="h-1.5 bg-muted" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useCallerUserProfile();
  const { data: stats, isLoading: statsLoading } = useMemberStats();
  const { mutate: saveProfile, isPending: savingProfile } = useSaveProfile();
  const { data: products, isLoading: productsLoading } = useAllProducts();
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  if (!identity) {
    return <Navigate to="/" />;
  }

  const principal = identity.getPrincipal().toString();
  const displayName = profile?.name || "Member";
  const joinDate = profile?.joinDate
    ? new Date(Number(profile.joinDate / BigInt(1_000_000))).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long", day: "numeric" },
      )
    : "—";
  const activityCount = stats?.activityCount?.toString() ?? "0";

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    saveProfile(
      {
        name: nameInput,
        joinDate: profile?.joinDate ?? BigInt(Date.now() * 1_000_000),
        activityCount: profile?.activityCount ?? BigInt(0),
      },
      {
        onSuccess: () => {
          toast.success("Profile updated!");
          setEditName(false);
        },
        onError: () => toast.error("Failed to update profile."),
      },
    );
  };

  const recentActivities = [
    { action: "Browsed Trending Products", time: "2 hours ago" },
    { action: "Added item to Wishlist", time: "Yesterday" },
    { action: "Viewed Tech Essentials Collection", time: "2 days ago" },
    { action: "Account Created", time: joinDate },
  ];

  return (
    <main className="min-h-screen bg-muted/30" data-ocid="dashboard.page">
      {/* Header strip */}
      <div className="bg-saffron text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest">
            Member Dashboard
          </span>
          <Link to="/">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 text-xs uppercase tracking-wider font-bold"
              data-ocid="dashboard.link"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-1">
            Welcome Back
          </p>
          {profileLoading ? (
            <Skeleton
              className="h-10 w-64"
              data-ocid="dashboard.loading_state"
            />
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-saffron uppercase tracking-wide">
                {displayName}
              </h1>
              {!editName && (
                <button
                  type="button"
                  onClick={() => {
                    setEditName(true);
                    setNameInput(profile?.name ?? "");
                  }}
                  className="text-xs text-muted-foreground hover:text-saffron underline normal-case font-medium"
                  data-ocid="dashboard.edit_button"
                >
                  Edit Name
                </button>
              )}
            </div>
          )}
          {editName && (
            <div className="flex items-center gap-2 mt-3">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="border border-saffron rounded px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-saffron/30 normal-case"
                placeholder="Your name"
                data-ocid="dashboard.input"
              />
              <Button
                size="sm"
                className="bg-saffron text-white font-bold uppercase text-xs"
                onClick={handleSaveName}
                disabled={savingProfile}
                data-ocid="dashboard.save_button"
              >
                {savingProfile ? "Saving..." : "Save"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground uppercase text-xs"
                onClick={() => setEditName(false)}
                data-ocid="dashboard.cancel_button"
              >
                Cancel
              </Button>
            </div>
          )}
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon={Activity}
            label="Total Activity"
            value={statsLoading ? "—" : activityCount}
            delay={0.1}
          />
          <StatCard
            icon={Calendar}
            label="Member Since"
            value={profileLoading ? "—" : joinDate}
            delay={0.2}
          />
          <StatCard
            icon={Shield}
            label="Account Status"
            value="Active"
            delay={0.3}
          />
        </div>

        {/* ─── AI Product Hunter ─── */}
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
              <h2 className="text-xl font-black uppercase tracking-widest text-saffron">
                AI Product Hunter
              </h2>
            </div>
            <p className="text-xs text-muted-foreground normal-case pl-12">
              High-demand affiliate products across Tech, Lifestyle &amp;
              Wellness — each AI-scored and reviewed. Generate smart links or
              create WhatsApp marketing posters instantly.
            </p>
          </motion.div>

          {productsLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="hunter.loading_state"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <ProductHunterSkeleton key={i} />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(([id, product], i) => (
                <ProductHunterCard
                  key={id.toString()}
                  id={id}
                  title={product.title}
                  category={product.category}
                  description={product.description}
                  aiReview={product.aiReview}
                  qualityScore={product.qualityScore}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16 bg-white rounded-lg border border-border shadow-card"
              data-ocid="hunter.empty_state"
            >
              <TrendingUp className="h-10 w-10 text-saffron/30 mx-auto mb-3" />
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                No products available yet
              </p>
            </div>
          )}
        </section>

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
                    {displayName[0] || "M"}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="font-black uppercase tracking-wide text-foreground text-lg">
                  {displayName}
                </p>
                <p className="text-xs text-muted-foreground normal-case mt-1 break-all">
                  {principal.slice(0, 20)}...
                </p>
              </div>
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                    Joined
                  </span>
                  <span className="font-bold normal-case text-foreground">
                    {joinDate}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </span>
                  <span className="font-bold text-saffron uppercase">
                    Active
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
