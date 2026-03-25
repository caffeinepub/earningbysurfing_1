import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Package, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import V47ProductCard from "../components/V47ProductCard";
import { useAllInventoryProducts } from "../hooks/useQueries";

interface MemberRecord {
  id: number;
  name: string;
  email: string;
}

const CATEGORIES = ["All", "Tech", "Lifestyle", "Wellness"];

function getLoggedInMember(): MemberRecord | null {
  try {
    const raw = localStorage.getItem("ebs_current_member");
    if (!raw) return null;
    return JSON.parse(raw) as MemberRecord;
  } catch {
    return null;
  }
}

export default function ShopAllPage() {
  const navigate = useNavigate();
  const { data: inventoryProducts = [], isLoading } = useAllInventoryProducts();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [member, setMember] = useState<MemberRecord | null>(null);

  useEffect(() => {
    setMember(getLoggedInMember());
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setSearch(q);
  }, []);

  const filtered = inventoryProducts.filter(([, product]) => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      activeCategory === "All" ||
      product.category.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const handleSmartLink = (product: {
    name: string;
    affiliateLink: string;
  }) => {
    if (!member) {
      toast.info("Please log in to generate Smart Links", {
        description: "Visit your dashboard to log in.",
        action: {
          label: "Dashboard",
          onClick: () => navigate({ to: "/dashboard" }),
        },
      });
      return;
    }
    const smartLink = `${product.affiliateLink}?ref=${member.id}&ebs=1`;
    navigator.clipboard
      .writeText(smartLink)
      .then(() => {
        toast.success("Smart Link copied!", { description: smartLink });
      })
      .catch(() => {
        toast.success("Smart Link generated!", { description: smartLink });
      });
  };

  return (
    <main className="min-h-screen bg-muted/30" data-ocid="shop.page">
      {/* Hero bar */}
      <div style={{ backgroundColor: "#F37D22" }} className="py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-widest mb-2">
            Shop All Products
          </h1>
          <p className="text-white/80 text-sm font-medium normal-case">
            Browse our full catalog &mdash; log in to generate your Smart Links
            and start earning.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-ocid="shop.search_input"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                data-ocid="shop.tab"
                style={{
                  backgroundColor:
                    activeCategory === cat ? "#F37D22" : "transparent",
                  color: activeCategory === cat ? "#FFFFFF" : "#F37D22",
                  border: "1.5px solid #F37D22",
                  borderRadius: "9999px",
                  padding: "8px 16px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "sans-serif",
                  transition: "background-color 0.15s ease, color 0.15s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-ocid="shop.loading_state"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sk) => (
              <div
                key={sk}
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
                }}
              >
                {/* V47 skeleton top strip */}
                <div
                  style={{
                    backgroundColor: "#FF8A12",
                    opacity: 0.3,
                    height: "160px",
                  }}
                />
                {/* V47 skeleton bottom */}
                <div
                  style={{ backgroundColor: "#FFFFFF", padding: "18px" }}
                  className="space-y-3"
                >
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="shop.empty_state"
          >
            <Package className="h-14 w-14 text-muted-foreground/30 mb-4" />
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
              No products found
            </p>
            <p className="text-xs text-muted-foreground mt-1 normal-case">
              Try a different search term or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(([id, product], i) => (
              <V47ProductCard
                key={id.toString()}
                name={product.name}
                price={product.price}
                category={product.category}
                affiliateLink={product.affiliateLink}
                isLoggedIn={!!member}
                onSmartLink={() => handleSmartLink(product)}
                index={i}
                ocidIndex={i + 1}
              />
            ))}
          </div>
        )}
      </div>

      <footer className="text-center py-8 text-xs text-muted-foreground normal-case">
        &copy; {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#F37D22]"
        >
          caffeine.ai
        </a>
      </footer>
    </main>
  );
}
