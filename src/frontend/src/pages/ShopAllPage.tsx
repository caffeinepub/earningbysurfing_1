import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Copy, ExternalLink, LogIn, Package, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
    // Read ?q param from URL
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
        toast.success("Smart Link copied!", {
          description: smartLink,
        });
      })
      .catch(() => {
        toast.success("Smart Link generated!", { description: smartLink });
      });
  };

  return (
    <main className="min-h-screen bg-muted/30" data-ocid="shop.page">
      {/* Hero bar */}
      <div className="bg-[#F37D22] py-10 px-4">
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
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${
                  activeCategory === cat
                    ? "bg-[#F37D22] text-white border-[#F37D22]"
                    : "border-[#F37D22] text-[#F37D22] hover:bg-[#F37D22] hover:text-white"
                }`}
                data-ocid="shop.tab"
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
            {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((sk) => (
              <div
                key={sk}
                className="bg-white rounded-xl border border-border p-4 space-y-3"
              >
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="shop.empty_state"
          >
            <Package className="h-14 w-14 text-[#F37D22]/30 mb-4" />
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
              <div
                key={id.toString()}
                className="bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4"
                data-ocid={`shop.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-black text-sm uppercase tracking-wide text-foreground leading-tight">
                    {product.name}
                  </h3>
                  <Badge
                    className="flex-shrink-0 text-[10px] uppercase tracking-wider"
                    style={{ background: "#F37D22", color: "white" }}
                  >
                    {product.category}
                  </Badge>
                </div>
                <p className="text-xl font-black text-[#F37D22]">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex flex-col gap-2 mt-auto">
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F37D22] border border-[#F37D22] rounded-lg py-2 hover:bg-[#F37D22] hover:text-white transition-colors"
                    data-ocid="shop.button"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View Product
                  </a>
                  {member ? (
                    <Button
                      size="sm"
                      className="bg-[#F37D22] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider w-full"
                      onClick={() => handleSmartLink(product)}
                      data-ocid="shop.primary_button"
                    >
                      <Copy className="h-3.5 w-3.5 mr-1.5" /> Generate Smart
                      Link
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#F37D22] text-[#F37D22] text-xs font-bold uppercase tracking-wider w-full hover:bg-[#F37D22] hover:text-white"
                      onClick={() =>
                        toast.info("Login to generate Smart Links", {
                          description: "Visit your dashboard to log in.",
                          action: {
                            label: "Dashboard",
                            onClick: () => navigate({ to: "/dashboard" }),
                          },
                        })
                      }
                      data-ocid="shop.secondary_button"
                    >
                      <LogIn className="h-3.5 w-3.5 mr-1.5" /> Login to Generate
                    </Button>
                  )}
                </div>
              </div>
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
