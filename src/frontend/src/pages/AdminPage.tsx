import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  DollarSign,
  FileText,
  Flame,
  Globe,
  LayoutDashboard,
  Loader2,
  Package,
  Plus,
  Radio,
  Save,
  Settings,
  ShoppingBag,
  Store,
  Trash2,
  Upload,
  Users,
  Users2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import AgentStatusTab from "../components/AgentStatusTab";
import { SAMPLE_INVENTORY_PRODUCTS } from "../data/sampleInventoryProducts";
import { useActor } from "../hooks/useActor";
import {
  Category,
  useAddAutoPostCategory,
  useAddInventoryProduct,
  useAffiliateConfigStatus,
  useAllInventoryProducts,
  useAllProducts,
  useAutoPostCategories,
  useCreateProduct,
  useDeleteInventoryProduct,
  useDeleteProduct,
  useListAllUsers,
  useLiveVisitorCount,
  useOrders,
  useRemoveAutoPostCategory,
  useRoundRobinIndex,
  useSiteSettings,
  useUpdateSiteSettings,
  useUpdateVendorRequestStatus,
  useVendorRequests,
  useVisitorCount,
} from "../hooks/useQueries";

const CATEGORY_OPTIONS = [
  { value: Category.shoesAndClothes, label: "Shoes & Clothes" },
  { value: Category.toys, label: "Toys" },
  { value: Category.technology, label: "Technology" },
  { value: Category.books, label: "Books" },
];

type AdminSection =
  | "agentStatus"
  | "dashboard"
  | "products"
  | "users"
  | "settings"
  | "members"
  | "payouts"
  | "globalInsights"
  | "inventory"
  | "vendorRequests"
  | "orders"
  | "pages";

interface ImportedMember {
  id: number;
  name: string;
  email: string;
  gender: string;
  commission: number;
  status: "Pending" | "Paid";
}

const GLOBAL_TRENDS = [
  {
    rank: 1,
    category: "AI Tech",
    region: "USA & Europe",
    margin: "12-18%",
    description:
      "AI-powered gadgets, wearables and productivity tools driving record affiliate conversions globally.",
    supplierSearch: "https://www.amazon.com/s?k=AI+tech+gadgets",
  },
  {
    rank: 2,
    category: "Organic Wellness",
    region: "USA & Europe",
    margin: "15-22%",
    description:
      "Supplements, adaptogens, and clean-label health products with massive DTC growth.",
    supplierSearch: "https://www.clickbank.com/marketplace/?category=health",
  },
  {
    rank: 3,
    category: "Eco-Decor",
    region: "Europe",
    margin: "10-16%",
    description:
      "Sustainable home décor and eco-friendly furnishings surging as green living trends accelerate.",
    supplierSearch: "https://www.amazon.com/s?k=eco+friendly+home+decor",
  },
  {
    rank: 4,
    category: "Smart Kitchen",
    region: "USA & Europe",
    margin: "11-17%",
    description:
      "Connected kitchen appliances and smart cooking tools with strong gifting season demand.",
    supplierSearch: "https://www.amazon.com/s?k=smart+kitchen+gadgets",
  },
  {
    rank: 5,
    category: "Solar Power",
    region: "Europe",
    margin: "14-20%",
    description:
      "Portable solar panels and home energy kits surging due to rising energy costs and eco policy.",
    supplierSearch: "https://www.amazon.com/s?k=solar+power+portable",
  },
  {
    rank: 6,
    category: "Leather Goods",
    region: "USA & Europe",
    margin: "18-25%",
    description:
      "Premium leather bags, wallets, and accessories with high average order values.",
    supplierSearch: "https://www.amazon.com/s?k=leather+goods+premium",
  },
  {
    rank: 7,
    category: "Pet Tech",
    region: "USA",
    margin: "13-19%",
    description:
      "Smart feeders, GPS trackers, and health monitors for pets — a multi-billion dollar affiliate category.",
    supplierSearch: "https://www.amazon.com/s?k=pet+tech+gadgets",
  },
  {
    rank: 8,
    category: "Digital Tools",
    region: "USA & Europe",
    margin: "20-30%",
    description:
      "Software, SaaS subscriptions, and productivity apps with recurring commission potential.",
    supplierSearch:
      "https://www.clickbank.com/marketplace/?category=software_services",
  },
  {
    rank: 9,
    category: "Yoga Kits",
    region: "USA & Europe",
    margin: "10-15%",
    description:
      "Premium yoga mats, blocks, straps, and starter bundles with strong wellness community demand.",
    supplierSearch: "https://www.amazon.com/s?k=yoga+kit+set",
  },
  {
    rank: 10,
    category: "Skincare",
    region: "Europe",
    margin: "16-24%",
    description:
      "Clean beauty and dermatologist-backed skincare driving high repeat purchases and subscriptions.",
    supplierSearch: "https://www.clickbank.com/marketplace/?category=health",
  },
];

// ─── Product Inventory Section ───────────────────────────────────────────────
function ProductInventorySection() {
  const { data: products = [], isLoading } = useAllInventoryProducts();
  const addProduct = useAddInventoryProduct();
  const deleteProduct = useDeleteInventoryProduct();
  const { actor } = useActor();
  const [seeding, setSeeding] = useState(false);

  async function handleSeedProducts() {
    if (!actor) {
      toast.error("Not connected.");
      return;
    }
    setSeeding(true);
    try {
      await Promise.all(
        SAMPLE_INVENTORY_PRODUCTS.map((p) =>
          actor.addInventoryProduct(
            p.name,
            p.price,
            p.category,
            p.affiliateLink,
          ),
        ),
      );
      toast.success("100 sample products seeded successfully!");
    } catch {
      toast.error("Failed to seed some products.");
    } finally {
      setSeeding(false);
    }
  }

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Tech");
  const [affiliateLink, setAffiliateLink] = useState("");

  const INVENTORY_CATEGORIES = [
    "Tech",
    "Lifestyle",
    "Wellness",
    "Home",
    "Fashion",
    "Sports",
    "Beauty",
    "Other",
  ];

  function handleAdd() {
    const trimmedName = name.trim();
    const trimmedLink = affiliateLink.trim();
    const parsedPrice = Number.parseFloat(price);
    if (!trimmedName || !price || Number.isNaN(parsedPrice) || !trimmedLink) {
      toast.error("Please fill in all fields.");
      return;
    }
    addProduct.mutate(
      {
        name: trimmedName,
        price: parsedPrice,
        category,
        affiliateLink: trimmedLink,
      },
      {
        onSuccess: () => {
          toast.success("Product added to inventory!");
          setName("");
          setPrice("");
          setCategory("Tech");
          setAffiliateLink("");
        },
        onError: () => toast.error("Failed to add product."),
      },
    );
  }

  function handleDelete(id: bigint) {
    deleteProduct.mutate(id, {
      onSuccess: () => toast.success("Product deleted."),
      onError: () => toast.error("Failed to delete product."),
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-ocid="inventory.section"
    >
      <h2 className="text-2xl font-black uppercase tracking-wide text-saffron mb-6">
        Product Inventory
      </h2>

      {/* Add Product Form */}
      <Card className="shadow-card mb-8" data-ocid="inventory.panel">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-widest text-saffron">
            Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1 block">
                Product Name
              </Label>
              <Input
                placeholder="e.g. Anker PowerCore 26800"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-[#FF9933]/40 focus-visible:ring-[#FF9933]"
                data-ocid="inventory.input"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1 block">
                Price (USD)
              </Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 49.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border-[#FF9933]/40 focus-visible:ring-[#FF9933]"
                data-ocid="inventory.price.input"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1 block">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  className="border-[#FF9933]/40 focus:ring-[#FF9933]"
                  data-ocid="inventory.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INVENTORY_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1 block">
                Affiliate Link
              </Label>
              <Input
                type="url"
                placeholder="https://amzn.to/..."
                value={affiliateLink}
                onChange={(e) => setAffiliateLink(e.target.value)}
                className="border-[#FF9933]/40 focus-visible:ring-[#FF9933]"
                data-ocid="inventory.link.input"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <Button
              className="bg-[#FF9933] text-white hover:bg-[#e6882e] font-bold uppercase tracking-widest text-xs"
              onClick={handleAdd}
              disabled={addProduct.isPending}
              data-ocid="inventory.primary_button"
            >
              {addProduct.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </>
              )}
            </Button>
            {products.length === 0 && (
              <Button
                variant="outline"
                className="border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933] hover:text-white font-bold uppercase tracking-widest text-xs"
                onClick={handleSeedProducts}
                disabled={seeding || !actor}
                data-ocid="inventory.secondary_button"
              >
                {seeding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Seeding...
                  </>
                ) : (
                  <>
                    <Package className="mr-2 h-4 w-4" /> Seed 100 Sample
                    Products
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="shadow-card" data-ocid="inventory.table">
        <CardHeader className="bg-[#FF9933] rounded-t-lg">
          <CardTitle className="text-sm uppercase tracking-widest text-white flex items-center justify-between">
            <span>All Products</span>
            <Badge className="bg-white text-[#FF9933] font-black text-xs">
              {products.length} / 100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div
              className="p-12 text-center text-muted-foreground text-sm"
              data-ocid="inventory.empty_state"
            >
              No products yet. Add your first product above.
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow className="border-b border-[#FF9933]/20">
                    <TableHead className="text-[#FF9933] font-bold text-xs uppercase tracking-widest w-12">
                      #
                    </TableHead>
                    <TableHead className="text-[#FF9933] font-bold text-xs uppercase tracking-widest">
                      Name
                    </TableHead>
                    <TableHead className="text-[#FF9933] font-bold text-xs uppercase tracking-widest">
                      Price
                    </TableHead>
                    <TableHead className="text-[#FF9933] font-bold text-xs uppercase tracking-widest">
                      Category
                    </TableHead>
                    <TableHead className="text-[#FF9933] font-bold text-xs uppercase tracking-widest">
                      Affiliate Link
                    </TableHead>
                    <TableHead className="text-[#FF9933] font-bold text-xs uppercase tracking-widest w-16">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(([id, product], index) => (
                    <TableRow
                      key={id.toString()}
                      className="hover:bg-[#FF9933]/5 border-b border-[#FF9933]/10"
                      data-ocid={`inventory.item.${index + 1}`}
                    >
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-sm text-foreground">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-sm font-bold text-[#FF9933]">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]/30 text-xs font-semibold">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <a
                          href={product.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FF9933] hover:underline text-xs font-mono"
                        >
                          {product.affiliateLink.length > 30
                            ? `${product.affiliateLink.slice(0, 30)}...`
                            : product.affiliateLink}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1 h-7 w-7"
                          onClick={() => handleDelete(id)}
                          disabled={deleteProduct.isPending}
                          data-ocid={`inventory.delete_button.${index + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Global Insights Section ─────────────────────────────────────────────────
function GlobalInsightsSection() {
  const { data: autoPosted = [], isLoading: apLoading } =
    useAutoPostCategories();
  const {
    mutate: addPost,
    isPending: addPending,
    variables: addVar,
  } = useAddAutoPostCategory();
  const {
    mutate: removePost,
    isPending: removePending,
    variables: removeVar,
  } = useRemoveAutoPostCategory();

  type MarketFilter = "Global" | "USA" | "EU";
  const [activeFilter, setActiveFilter] = useState<MarketFilter>("Global");

  const filteredTrends = GLOBAL_TRENDS.filter((t) => {
    if (activeFilter === "USA") return t.region.includes("USA");
    if (activeFilter === "EU") return t.region.includes("Europe");
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-3 mb-2">
        <Globe className="h-6 w-6 text-saffron" />
        <h2 className="text-2xl font-black uppercase tracking-wide text-saffron">
          Global Insights
        </h2>
      </div>
      <p className="text-sm text-muted-foreground normal-case mb-4">
        Top 10 trending product categories from the USA and Europe. Click
        Auto-Post to feature a category on the Home Page.
      </p>

      {/* Active Listings Count Badge */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow"
          style={{ backgroundColor: "#FF9933", color: "#fff" }}
        >
          <span className="text-lg font-black">{autoPosted.length}</span>
          <span className="uppercase tracking-widest text-xs">
            Active Listings on Home Page
          </span>
        </div>
      </div>

      {/* Market Filter Buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["Global", "USA", "EU"] as MarketFilter[]).map((f) => {
          const labels: Record<MarketFilter, string> = {
            Global: "Global",
            USA: "US Market",
            EU: "EU Market",
          };
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              data-ocid="insights.tab"
              type="button"
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border-2 transition-all"
              style={
                isActive
                  ? {
                      backgroundColor: "#FF9933",
                      borderColor: "#FF9933",
                      color: "#fff",
                    }
                  : {
                      backgroundColor: "#fff",
                      borderColor: "#FF9933",
                      color: "#FF9933",
                    }
              }
            >
              {labels[f]}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTrends.map((trend) => {
          const isPosted = autoPosted.includes(trend.category);
          const isAddingThis = addPending && addVar === trend.category;
          const isRemovingThis = removePending && removeVar === trend.category;
          const isMutating = isAddingThis || isRemovingThis;

          return (
            <Card
              key={trend.rank}
              className="shadow-card border border-saffron/10 hover:border-saffron/40 transition-colors"
            >
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  {/* Rank badge + region */}
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm"
                      style={{ backgroundColor: "#FF9933", color: "#fff" }}
                    >
                      {trend.rank}
                    </div>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                      {trend.region}
                    </span>
                  </div>
                  {/* Hot badge */}
                  <Badge
                    className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 border-0"
                    style={{ backgroundColor: "#FF9933", color: "#fff" }}
                  >
                    <Flame className="h-3 w-3" />
                    Hot
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-base font-black uppercase tracking-wide text-foreground">
                    {trend.category}
                  </h3>
                  {/* Potential Margin tag */}
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "#FF993320",
                      color: "#FF9933",
                      border: "1px solid #FF993360",
                    }}
                  >
                    {trend.margin} Margin
                  </span>
                </div>
                <p className="text-xs text-muted-foreground normal-case leading-relaxed mb-4">
                  {trend.description}
                </p>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs font-bold uppercase tracking-wider border-saffron text-saffron hover:bg-saffron/10 flex-1"
                    onClick={() => window.open(trend.supplierSearch, "_blank")}
                    data-ocid={`insights.item.${trend.rank}`}
                  >
                    Find Suppliers
                  </Button>

                  {isPosted ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs font-bold uppercase tracking-wider border-muted text-muted-foreground hover:bg-muted/20 flex-1"
                      onClick={() => removePost(trend.category)}
                      disabled={isMutating || apLoading}
                      data-ocid={`insights.delete_button.${trend.rank}`}
                    >
                      {isRemovingThis ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : null}
                      Remove Post
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="text-xs font-bold uppercase tracking-wider flex-1"
                      style={{ backgroundColor: "#FF9933", color: "#fff" }}
                      onClick={() => addPost(trend.category)}
                      disabled={isMutating || apLoading}
                      data-ocid={`insights.primary_button.${trend.rank}`}
                    >
                      {isAddingThis ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : null}
                      Auto-Post
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}

function AddProductDialog({ onClose }: { onClose: () => void }) {
  const { mutate: createProduct, isPending } = useCreateProduct();
  const [form, setForm] = useState<Product>({
    title: "",
    description: "",
    category: Category.technology,
    imageUrl: "",
    featured: false,
    qualityScore: BigInt(90),
    aiReview: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    createProduct(form, {
      onSuccess: () => {
        toast.success("Product created!");
        onClose();
      },
      onError: () => toast.error("Failed to create product."),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-ocid="product.modal"
    >
      <div>
        <Label className="text-xs uppercase tracking-widest font-bold">
          Title
        </Label>
        <Input
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="Product title"
          className="mt-1"
          data-ocid="product.input"
        />
      </div>
      <div>
        <Label className="text-xs uppercase tracking-widest font-bold">
          Description
        </Label>
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Product description"
          className="mt-1"
          rows={3}
          data-ocid="product.textarea"
        />
      </div>
      <div>
        <Label className="text-xs uppercase tracking-widest font-bold">
          Category
        </Label>
        <Select
          value={form.category}
          onValueChange={(v) =>
            setForm((p) => ({ ...p, category: v as Category }))
          }
        >
          <SelectTrigger className="mt-1" data-ocid="product.select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs uppercase tracking-widest font-bold">
          Image URL
        </Label>
        <Input
          value={form.imageUrl}
          onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
          placeholder="https://..."
          className="mt-1"
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={form.featured}
          onCheckedChange={(v) => setForm((p) => ({ ...p, featured: v }))}
          data-ocid="product.switch"
        />
        <Label className="text-xs uppercase tracking-widest font-bold normal-case">
          Featured Product
        </Label>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          data-ocid="product.cancel_button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-saffron text-white font-bold"
          disabled={isPending}
          data-ocid="product.submit_button"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isPending ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </form>
  );
}

// ─── Members Section ────────────────────────────────────────────────────────
function MembersSection({
  members,
  setMembers,
}: {
  members: ImportedMember[];
  setMembers: React.Dispatch<React.SetStateAction<ImportedMember[]>>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<ImportedMember[]>([]);
  const [parsed, setParsed] = useState<ImportedMember[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim());
      const dataLines = lines[0]?.toLowerCase().includes("name")
        ? lines.slice(1)
        : lines;
      const rows: ImportedMember[] = dataLines.map((line, idx) => {
        const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        return {
          id: idx + 1,
          name: cols[0] ?? "",
          email: cols[1] ?? "",
          gender: cols[2] ?? "",
          commission: Number.parseFloat(cols[3] ?? "0") || 0,
          status: "Pending",
        };
      });
      setParsed(rows);
      setPreview(rows.slice(0, 10));
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!parsed.length) return;
    setMembers(parsed);
    localStorage.setItem("ebs_members", JSON.stringify(parsed));
    localStorage.setItem("ebs_members_source", "csv");
    setParsed([]);
    setPreview([]);
    setPage(1);
    if (fileRef.current) fileRef.current.value = "";
    toast.success(
      `${parsed.length} members imported successfully! Member data saved.`,
    );
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.gender.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSlice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-black uppercase tracking-wide text-saffron mb-6">
        Members
      </h2>

      <Card className="shadow-card mb-6">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-widest text-saffron">
            Bulk CSV Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground normal-case">
            Upload a CSV file with columns:{" "}
            <span className="font-mono font-bold">
              name, email, gender, commission
            </span>
          </p>
          <button
            type="button"
            className="border-2 border-dashed border-saffron/40 rounded-lg p-8 flex flex-col items-center gap-3 hover:border-saffron/70 transition-colors cursor-pointer w-full"
            onClick={() => fileRef.current?.click()}
            data-ocid="members.dropzone"
          >
            <Upload className="h-8 w-8 text-saffron/60" />
            <p className="text-sm font-bold uppercase tracking-widest text-saffron/70">
              Click to select CSV file
            </p>
            <p className="text-xs text-muted-foreground normal-case">
              Supports up to 4000+ members
            </p>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFile}
            data-ocid="members.upload_button"
          />
          {parsed.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-saffron text-white font-bold px-3 py-1">
                  {parsed.length.toLocaleString()} members ready to import
                </Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2">
                  Preview (first 10 rows)
                </p>
                <div className="overflow-x-auto rounded border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs uppercase tracking-widest">
                          Name
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-widest">
                          Email
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-widest">
                          Gender
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-widest">
                          Commission
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.map((row, i) => (
                        <TableRow key={row.email || `preview-${i}`}>
                          <TableCell className="normal-case text-sm font-medium">
                            {row.name}
                          </TableCell>
                          <TableCell className="normal-case text-xs text-muted-foreground">
                            {row.email}
                          </TableCell>
                          <TableCell className="text-xs">
                            {row.gender}
                          </TableCell>
                          <TableCell className="text-xs font-bold text-saffron">
                            ${row.commission.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <Button
                className="bg-saffron text-white font-bold uppercase tracking-widest text-xs w-full"
                onClick={handleImport}
                data-ocid="members.submit_button"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import {parsed.length.toLocaleString()} Members
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {members.length > 0 && (
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm uppercase tracking-widest text-saffron">
              All Members
              <Badge className="ml-3 bg-saffron/10 text-saffron border border-saffron/30">
                {members.length.toLocaleString()}
              </Badge>
            </CardTitle>
            <Input
              placeholder="Search members..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="max-w-xs"
              data-ocid="members.search_input"
            />
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table data-ocid="members.table">
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs uppercase tracking-widest">
                      #
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-widest">
                      Name
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-widest">
                      Email
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-widest">
                      Gender
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-widest">
                      Commission
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-widest">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageSlice.length > 0 ? (
                    pageSlice.map((m, i) => (
                      <TableRow
                        key={`member-${(page - 1) * PAGE_SIZE + i}`}
                        data-ocid={`members.row.${i + 1}`}
                      >
                        <TableCell className="text-xs text-muted-foreground">
                          {(page - 1) * PAGE_SIZE + i + 1}
                        </TableCell>
                        <TableCell className="font-semibold normal-case text-sm">
                          {m.name}
                        </TableCell>
                        <TableCell className="text-xs normal-case text-muted-foreground">
                          {m.email}
                        </TableCell>
                        <TableCell className="text-xs capitalize">
                          {m.gender}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-saffron">
                          ${m.commission.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              m.status === "Pending"
                                ? "bg-saffron/10 text-saffron border border-saffron/30 text-xs"
                                : "bg-muted text-muted-foreground border border-border text-xs"
                            }
                          >
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                        data-ocid="members.empty_state"
                      >
                        No members match your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-xs text-muted-foreground normal-case">
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                  {filtered.length.toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    data-ocid="members.pagination_prev"
                  >
                    Prev
                  </Button>
                  <span className="text-xs font-bold flex items-center px-2">
                    {page} / {totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    data-ocid="members.pagination_next"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {members.length === 0 && parsed.length === 0 && (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="members.empty_state"
        >
          <Users2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm normal-case">
            No members imported yet. Upload a CSV file to get started.
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ─── Payouts Section ────────────────────────────────────────────────────────
function PayoutsSection({
  members,
  setMembers,
}: {
  members: ImportedMember[];
  setMembers: React.Dispatch<React.SetStateAction<ImportedMember[]>>;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const totalMembers = members.length;
  const totalPending = members
    .filter((m) => m.status === "Pending")
    .reduce((sum, m) => sum + m.commission, 0);
  const totalPaid = members
    .filter((m) => m.status === "Paid")
    .reduce((sum, m) => sum + m.commission, 0);

  const markPaid = (idx: number) => {
    setMembers((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, status: "Paid" } : m)),
    );
  };

  const payAllPending = () => {
    setMembers((prev) => prev.map((m) => ({ ...m, status: "Paid" })));
    toast.success("All pending commissions marked as paid!");
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSlice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getGlobalIndex = (filteredIdx: number) => {
    const member = filtered[(page - 1) * PAGE_SIZE + filteredIdx];
    return members.indexOf(member);
  };

  const summaryCards = [
    {
      label: "Total Members",
      value: totalMembers.toLocaleString(),
      icon: Users2,
    },
    {
      label: "Total Pending",
      value: `$${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
    },
    {
      label: "Total Paid Out",
      value: `$${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-black uppercase tracking-wide text-saffron">
          Payout Tracker
        </h2>
        {members.some((m) => m.status === "Pending") && (
          <Button
            className="bg-saffron text-white font-bold uppercase tracking-widest text-xs"
            onClick={payAllPending}
            data-ocid="payouts.primary_button"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Pay All Pending
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {summaryCards.map((card) => (
          <Card key={card.label} className="shadow-card">
            <CardContent className="pt-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-saffron/10 flex items-center justify-center flex-shrink-0">
                <card.icon className="h-5 w-5 text-saffron" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  {card.label}
                </p>
                <p className="text-2xl font-black text-saffron">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {members.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="payouts.empty_state"
        >
          <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm normal-case">
            No members imported. Go to Members section to upload a CSV first.
          </p>
        </div>
      ) : (
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm uppercase tracking-widest text-saffron">
              Commission Payouts
            </CardTitle>
            <Input
              placeholder="Search members..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="max-w-xs"
              data-ocid="payouts.search_input"
            />
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table data-ocid="payouts.table">
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs uppercase tracking-widest">
                      Name
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-widest">
                      Email
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-widest">
                      Commission
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-widest">
                      Status
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-widest text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageSlice.map((m, i) => {
                    const globalIdx = getGlobalIndex(i);
                    return (
                      <TableRow
                        key={`payout-${(page - 1) * PAGE_SIZE + i}`}
                        data-ocid={`payouts.row.${i + 1}`}
                      >
                        <TableCell className="font-semibold normal-case text-sm">
                          {m.name}
                        </TableCell>
                        <TableCell className="text-xs normal-case text-muted-foreground">
                          {m.email}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-saffron">
                          ${m.commission.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {m.status === "Pending" ? (
                            <Badge className="bg-saffron text-white text-xs font-bold border-0">
                              Pending
                            </Badge>
                          ) : (
                            <Badge className="bg-white text-foreground text-xs font-bold border border-border">
                              Paid
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {m.status === "Pending" && (
                            <Button
                              size="sm"
                              className="bg-saffron/10 text-saffron border border-saffron/30 hover:bg-saffron hover:text-white text-xs font-bold uppercase tracking-wider"
                              onClick={() => markPaid(globalIdx)}
                              data-ocid={`payouts.secondary_button.${i + 1}`}
                            >
                              Mark Paid
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-xs text-muted-foreground normal-case">
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                  {filtered.length.toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    data-ocid="payouts.pagination_prev"
                  >
                    Prev
                  </Button>
                  <span className="text-xs font-bold flex items-center px-2">
                    {page} / {totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    data-ocid="payouts.pagination_next"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

// ─── Main Admin Page ─────────────────────────────────────────────────────────
function VendorRequestsSection() {
  const { data: requests, isLoading } = useVendorRequests();
  const { mutateAsync: updateStatus, isPending } =
    useUpdateVendorRequestStatus();

  const vendorList = requests ?? [];
  const pendingCount = vendorList.filter(
    ([, r]) => r.status === "pending",
  ).length;

  const handleStatus = async (id: bigint, status: string) => {
    try {
      await updateStatus({ id, status });
      toast.success(
        `Request ${status === "approved" ? "approved" : "rejected"}.`,
      );
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-ocid="vendor_requests.section"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black uppercase tracking-wide text-saffron">
          Vendor Requests
        </h2>
        {pendingCount > 0 && (
          <span className="bg-saffron text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {pendingCount} Pending
          </span>
        )}
      </div>
      <Card className="shadow-card" data-ocid="vendor_requests.table">
        <CardContent className="p-0">
          {isLoading ? (
            <div
              className="p-8 text-center text-muted-foreground text-sm"
              data-ocid="vendor_requests.loading_state"
            >
              Loading requests...
            </div>
          ) : vendorList.length === 0 ? (
            <div
              className="p-12 text-center"
              data-ocid="vendor_requests.empty_state"
            >
              <Store className="h-12 w-12 text-saffron/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm font-medium">
                No vendor requests yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#FF9933]/20">
                    {[
                      "Vendor Name",
                      "Business",
                      "Product",
                      "Category",
                      "Price",
                      "Email",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <TableHead
                        key={h}
                        className="text-[#FF9933] font-bold text-xs uppercase tracking-widest whitespace-nowrap"
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorList.map(([id, req], index) => (
                    <TableRow
                      key={id.toString()}
                      className="border-b border-border/50 hover:bg-muted/30"
                      data-ocid={`vendor_requests.item.${index + 1}`}
                    >
                      <TableCell className="font-semibold text-xs">
                        {req.vendorName}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {req.businessName}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {req.productName}
                      </TableCell>
                      <TableCell className="text-xs">{req.category}</TableCell>
                      <TableCell className="text-xs">
                        ${req.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {req.contactEmail}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            req.status === "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : req.status === "rejected"
                                ? "bg-red-100 text-red-600"
                                : "bg-saffron/10 text-saffron"
                          }`}
                        >
                          {req.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {req.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="h-7 px-2 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase"
                              disabled={isPending}
                              onClick={() => handleStatus(id, "approved")}
                              data-ocid={`vendor_requests.confirm_button.${index + 1}`}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[10px] border-red-400 text-red-500 hover:bg-red-50 font-bold uppercase"
                              disabled={isPending}
                              onClick={() => handleStatus(id, "rejected")}
                              data-ocid={`vendor_requests.delete_button.${index + 1}`}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function OrdersSection() {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: rrIndex } = useRoundRobinIndex();

  const orderList = orders ?? [];

  const formatDate = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-ocid="orders.section"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black uppercase tracking-wide text-saffron">
          Direct Orders
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Round-Robin Index:
          </span>
          <span className="bg-saffron text-white text-xs font-black px-3 py-1 rounded-full">
            #{rrIndex !== undefined ? rrIndex.toString() : "—"}
          </span>
        </div>
      </div>
      <Card className="shadow-card mb-6" data-ocid="orders.panel">
        <CardContent className="pt-4 pb-3">
          <p className="text-xs text-muted-foreground normal-case leading-relaxed">
            All direct orders from the Home Page are distributed to members
            sequentially using Round-Robin logic. The counter above shows the
            current position in the queue.
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-card" data-ocid="orders.table">
        <CardContent className="p-0">
          {ordersLoading ? (
            <div
              className="p-8 text-center text-muted-foreground text-sm"
              data-ocid="orders.loading_state"
            >
              Loading orders...
            </div>
          ) : orderList.length === 0 ? (
            <div className="p-12 text-center" data-ocid="orders.empty_state">
              <ShoppingBag className="h-12 w-12 text-saffron/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm font-medium">
                No orders yet. Buy Now buttons on the Home Page will generate
                orders here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#FF9933]/20">
                    {[
                      "Order ID",
                      "Product",
                      "Member Index",
                      "Member ID",
                      "Timestamp",
                    ].map((h) => (
                      <TableHead
                        key={h}
                        className="text-[#FF9933] font-bold text-xs uppercase tracking-widest whitespace-nowrap"
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderList.map(([id, order], index) => (
                    <TableRow
                      key={id.toString()}
                      className="border-b border-border/50 hover:bg-muted/30"
                      data-ocid={`orders.item.${index + 1}`}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{id.toString()}
                      </TableCell>
                      <TableCell className="text-xs font-semibold">
                        {order.productName}
                      </TableCell>
                      <TableCell>
                        <span className="bg-saffron/10 text-saffron text-xs font-black px-2 py-0.5 rounded-full">
                          Member {Number(order.memberIndex) + 1}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {order.assignedMemberId || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(order.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PagesCmsSection() {
  const { actor } = useActor();
  const qc = useQueryClient();

  const pages = [
    { slug: "about", title: "About Us" },
    { slug: "contact", title: "Contact Us" },
    { slug: "terms", title: "Terms & Conditions" },
    { slug: "privacy", title: "Privacy Policy" },
  ];

  const [selectedSlug, setSelectedSlug] = useState<string>(pages[0].slug);
  const [editorHtml, setEditorHtml] = useState<string>("");
  const [pageTitle, setPageTitle] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const { data: allPages, isLoading } = useQuery({
    queryKey: ["allPageContents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPageContents();
    },
    enabled: !!actor,
  });

  // Populate editor when page selection or data changes

  if (!initialized && allPages && allPages.length >= 0) {
    const found = allPages.find(([slug]) => slug === selectedSlug);
    if (found) {
      setPageTitle(found[1].title);
      setEditorHtml(found[1].content);
      if (editorRef.current) {
        editorRef.current.innerHTML = found[1].content;
      }
    }
    setInitialized(true);
  }

  function selectPage(slug: string) {
    setSelectedSlug(slug);
    setInitialized(false);
    const found = allPages?.find(([s]) => s === slug);
    const html = found ? found[1].content : "";
    const title = found
      ? found[1].title
      : (pages.find((p) => p.slug === slug)?.title ?? "");
    setEditorHtml(html);
    setPageTitle(title);
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
      }
    }, 0);
  }

  function execCmd(cmd: string, value?: string) {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    setEditorHtml(editorRef.current?.innerHTML ?? "");
  }

  async function handleSave() {
    if (!actor) return;
    setSaving(true);
    try {
      const html = editorRef.current?.innerHTML ?? editorHtml;
      await actor.setPageContent(selectedSlug, {
        title: pageTitle,
        content: html,
      });
      qc.invalidateQueries({ queryKey: ["allPageContents"] });
      qc.invalidateQueries({ queryKey: ["pageContent", selectedSlug] });
      toast.success("Page saved successfully!");
    } catch {
      toast.error("Failed to save page.");
    } finally {
      setSaving(false);
    }
  }

  const selectedPageMeta = pages.find((p) => p.slug === selectedSlug);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      data-ocid="pages.section"
    >
      <h2 className="text-2xl font-black uppercase tracking-wide text-saffron mb-6">
        Pages &amp; Content
      </h2>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Page selector */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-[#FF9933]/5 border-b border-border">
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF9933]">
                Select Page
              </p>
            </div>
            {pages.map((page) => (
              <button
                key={page.slug}
                type="button"
                onClick={() => selectPage(page.slug)}
                className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors border-b border-border last:border-0 ${
                  selectedSlug === page.slug
                    ? "bg-[#FF9933] text-white"
                    : "text-foreground hover:bg-[#FF9933]/5 hover:text-[#FF9933]"
                }`}
                data-ocid="pages.tab"
              >
                {page.title}
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1">
          <Card className="shadow-card" data-ocid="pages.panel">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="text-sm uppercase tracking-widest text-saffron">
                  Editing: {selectedPageMeta?.title}
                </CardTitle>
                <a
                  href={`/${selectedSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#FF9933] underline font-semibold uppercase tracking-wider"
                >
                  Preview &rarr;
                </a>
              </div>
              <div className="mt-3">
                <Label className="text-xs uppercase tracking-widest font-bold mb-1 block">
                  Page Title
                </Label>
                <Input
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="Page title..."
                  className="mt-1"
                  data-ocid="pages.input"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {isLoading ? (
                <div className="space-y-3" data-ocid="pages.loading_state">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : (
                <>
                  {/* Toolbar */}
                  <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 border border-border rounded-lg">
                    {[
                      {
                        cmd: "bold",
                        label: "B",
                        title: "Bold",
                        style: "font-bold",
                      },
                      {
                        cmd: "italic",
                        label: "I",
                        title: "Italic",
                        style: "italic",
                      },
                      {
                        cmd: "underline",
                        label: "U",
                        title: "Underline",
                        style: "underline",
                      },
                    ].map((btn) => (
                      <button
                        key={btn.cmd}
                        type="button"
                        title={btn.title}
                        onClick={() => execCmd(btn.cmd)}
                        className={`px-2.5 py-1 text-xs border border-[#FF9933]/30 rounded hover:bg-[#FF9933] hover:text-white transition-colors font-semibold ${btn.style}`}
                        data-ocid="pages.button"
                      >
                        {btn.label}
                      </button>
                    ))}
                    <div className="w-px bg-border mx-1" />
                    <button
                      type="button"
                      title="Heading 2"
                      onClick={() => execCmd("formatBlock", "H2")}
                      className="px-2.5 py-1 text-xs border border-[#FF9933]/30 rounded hover:bg-[#FF9933] hover:text-white transition-colors font-bold"
                      data-ocid="pages.button"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      title="Heading 3"
                      onClick={() => execCmd("formatBlock", "H3")}
                      className="px-2.5 py-1 text-xs border border-[#FF9933]/30 rounded hover:bg-[#FF9933] hover:text-white transition-colors font-bold"
                      data-ocid="pages.button"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      title="Paragraph"
                      onClick={() => execCmd("formatBlock", "P")}
                      className="px-2.5 py-1 text-xs border border-[#FF9933]/30 rounded hover:bg-[#FF9933] hover:text-white transition-colors"
                      data-ocid="pages.button"
                    >
                      ¶
                    </button>
                    <div className="w-px bg-border mx-1" />
                    <button
                      type="button"
                      title="Unordered List"
                      onClick={() => execCmd("insertUnorderedList")}
                      className="px-2.5 py-1 text-xs border border-[#FF9933]/30 rounded hover:bg-[#FF9933] hover:text-white transition-colors"
                      data-ocid="pages.button"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      title="Ordered List"
                      onClick={() => execCmd("insertOrderedList")}
                      className="px-2.5 py-1 text-xs border border-[#FF9933]/30 rounded hover:bg-[#FF9933] hover:text-white transition-colors"
                      data-ocid="pages.button"
                    >
                      1. List
                    </button>
                  </div>

                  {/* Content editable */}
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={() =>
                      setEditorHtml(editorRef.current?.innerHTML ?? "")
                    }
                    className="min-h-[300px] border border-border rounded-lg p-4 text-sm leading-relaxed outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] prose prose-sm max-w-none prose-headings:text-[#FF9933]"
                    data-ocid="pages.editor"
                    style={{ direction: "ltr" }}
                  />

                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-4 bg-[#FF9933] text-white font-bold uppercase tracking-widest text-xs w-full hover:bg-orange-600"
                    data-ocid="pages.save_button"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Page
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminPage() {
  const [isAdminAuthed, setIsAdminAuthed] = useState(
    () => localStorage.getItem("ebs_admin_auth") === "true",
  );
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [addOpen, setAddOpen] = useState(false);

  const [importedMembers, setImportedMembers] = useState<ImportedMember[]>([]);

  const { data: products, isLoading: productsLoading } = useAllProducts();
  const { data: users, isLoading: usersLoading } = useListAllUsers();
  const { data: siteSettings, isLoading: settingsLoading } = useSiteSettings();
  const { data: totalVisitors } = useVisitorCount();
  const { data: liveVisitors } = useLiveVisitorCount();
  const { mutate: deleteProduct, isPending: deletingProduct } =
    useDeleteProduct();
  const { mutate: updateSettings, isPending: savingSettings } =
    useUpdateSiteSettings();

  const { data: affiliateStatus } = useAffiliateConfigStatus();
  const [settingsForm, setSettingsForm] = useState({
    siteTitle: "",
    announcementText: "",
    clickbankApiKey: "",
    clickbankClerkId: "",
    amazonAccessKey: "",
    amazonSecretKey: "",
    amazonAssociateTag: "",
  });
  const [settingsInit, setSettingsInit] = useState(false);

  if (!settingsInit && siteSettings) {
    setSettingsForm({
      siteTitle: siteSettings.siteTitle,
      announcementText: siteSettings.announcementText,
      clickbankApiKey: siteSettings.clickbankApiKey || "",
      clickbankClerkId: siteSettings.clickbankClerkId || "",
      amazonAccessKey: siteSettings.amazonAccessKey || "",
      amazonSecretKey: siteSettings.amazonSecretKey || "",
      amazonAssociateTag: siteSettings.amazonAssociateTag || "",
    });
    setSettingsInit(true);
  }

  if (!isAdminAuthed) {
    return (
      <main
        className="min-h-screen flex items-center justify-center bg-white"
        data-ocid="admin.page"
      >
        <div className="w-full max-w-md px-6">
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-black tracking-widest uppercase"
              style={{ color: "#FF9933" }}
            >
              EarningBySurfing
            </h1>
          </div>
          <div className="bg-white border border-[#FF9933]/30 rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-black uppercase tracking-wide text-center mb-1">
              Admin Panel Login
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Enter your admin password to continue
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (pwInput === "Admin@EBS2026") {
                  localStorage.setItem("ebs_admin_auth", "true");
                  setIsAdminAuthed(true);
                  setPwError(false);
                } else {
                  setPwError(true);
                }
              }}
              className="space-y-4"
            >
              <div>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={pwInput}
                  onChange={(e) => {
                    setPwInput(e.target.value);
                    setPwError(false);
                  }}
                  className="border-[#FF9933]/40 focus-visible:ring-[#FF9933]"
                  data-ocid="admin.input"
                />
                {pwError && (
                  <p
                    className="text-destructive text-xs mt-2 font-semibold"
                    data-ocid="admin.error_state"
                  >
                    Incorrect password. Please try again.
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full font-black uppercase tracking-widest text-white"
                style={{ backgroundColor: "#FF9933" }}
                data-ocid="admin.submit_button"
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  const navItems: {
    id: AdminSection;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: "agentStatus", label: "Agent Status", icon: Radio },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "users", label: "Users", icon: Users },
    { id: "members", label: "Members", icon: Users2 },
    { id: "payouts", label: "Payouts", icon: DollarSign },
    { id: "globalInsights", label: "Global Insights", icon: Globe },
    { id: "inventory", label: "Product Inventory", icon: ShoppingBag },
    { id: "vendorRequests", label: "Vendor Requests", icon: Store },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "pages", label: "Pages", icon: FileText },
  ];

  const dashStats = [
    { label: "Total Products", value: products?.length?.toString() ?? "—" },
    { label: "Total Users", value: users?.length?.toString() ?? "—" },
    { label: "Total Visitors", value: totalVisitors?.toString() ?? "—" },
    { label: "Live Now", value: liveVisitors?.toString() ?? "—" },
  ];

  return (
    <main className="min-h-screen bg-muted/30 flex" data-ocid="admin.page">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col shadow-xs">
        <div className="bg-saffron text-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-black uppercase tracking-widest">
                Admin Panel
              </h1>
              <p className="text-white/70 text-xs normal-case mt-1">
                EarningBySurfing
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("ebs_admin_auth");
                setIsAdminAuthed(false);
              }}
              className="text-xs font-bold uppercase tracking-widest border border-white/60 rounded px-2 py-1 hover:bg-white/10 transition-colors"
              data-ocid="admin.close_button"
            >
              Logout
            </button>
          </div>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                section === item.id
                  ? "bg-saffron/10 text-saffron border-r-2 border-saffron"
                  : "text-foreground hover:bg-muted hover:text-saffron"
              }`}
              data-ocid={`admin.${item.id}.tab`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Agent Status */}
          {section === "agentStatus" && (
            <AgentStatusTab
              onNavigateToSettings={() => setSection("settings")}
            />
          )}

          {/* Dashboard */}
          {section === "dashboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-black uppercase tracking-wide text-saffron mb-6">
                Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dashStats.map((stat) => (
                  <Card key={stat.label} className="shadow-card">
                    <CardContent className="pt-5">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-black text-saffron">
                        {stat.value}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Products */}
          {section === "products" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black uppercase tracking-wide text-saffron">
                  Products
                </h2>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-saffron text-white font-bold uppercase text-xs tracking-wider"
                      data-ocid="products.open_modal_button"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent data-ocid="products.dialog">
                    <DialogHeader>
                      <DialogTitle className="uppercase tracking-widest text-saffron">
                        Add New Product
                      </DialogTitle>
                    </DialogHeader>
                    <AddProductDialog onClose={() => setAddOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
              {productsLoading ? (
                <div className="space-y-2" data-ocid="products.loading_state">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={`skel-p-${i}`} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Card className="shadow-card">
                  <Table data-ocid="products.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="uppercase text-xs tracking-widest">
                          Title
                        </TableHead>
                        <TableHead className="uppercase text-xs tracking-widest">
                          Category
                        </TableHead>
                        <TableHead className="uppercase text-xs tracking-widest">
                          Featured
                        </TableHead>
                        <TableHead className="uppercase text-xs tracking-widest text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products && products.length > 0 ? (
                        products.map(([id, product], i) => (
                          <TableRow
                            key={id.toString()}
                            data-ocid={`products.row.${i + 1}`}
                          >
                            <TableCell className="font-semibold normal-case text-sm">
                              {product.title}
                            </TableCell>
                            <TableCell className="text-xs uppercase tracking-wider text-muted-foreground">
                              {product.category}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`text-xs font-bold uppercase ${product.featured ? "text-saffron" : "text-muted-foreground"}`}
                              >
                                {product.featured ? "Yes" : "No"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() =>
                                  deleteProduct(id, {
                                    onSuccess: () =>
                                      toast.success("Product deleted"),
                                    onError: () =>
                                      toast.error("Failed to delete"),
                                  })
                                }
                                disabled={deletingProduct}
                                data-ocid={`products.delete_button.${i + 1}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-8 text-muted-foreground"
                            data-ocid="products.empty_state"
                          >
                            No products yet. Add your first product.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </motion.div>
          )}

          {/* Users */}
          {section === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-black uppercase tracking-wide text-saffron mb-6">
                Users
              </h2>
              {usersLoading ? (
                <div className="space-y-2" data-ocid="users.loading_state">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={`skel-u-${i}`} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Card className="shadow-card">
                  <Table data-ocid="users.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="uppercase text-xs tracking-widest">
                          Principal
                        </TableHead>
                        <TableHead className="uppercase text-xs tracking-widest">
                          Name
                        </TableHead>
                        <TableHead className="uppercase text-xs tracking-widest">
                          Joined
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users && users.length > 0 ? (
                        users.map(([principal, profile], i) => (
                          <TableRow
                            key={principal.toString()}
                            data-ocid={`users.row.${i + 1}`}
                          >
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {principal.toString().slice(0, 24)}...
                            </TableCell>
                            <TableCell className="font-semibold normal-case">
                              {profile.name || "—"}
                            </TableCell>
                            <TableCell className="text-xs normal-case text-muted-foreground">
                              {new Date(
                                Number(profile.joinDate / BigInt(1_000_000)),
                              ).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center py-8 text-muted-foreground"
                            data-ocid="users.empty_state"
                          >
                            No users registered yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </motion.div>
          )}

          {/* Members */}
          {section === "members" && (
            <MembersSection
              members={importedMembers}
              setMembers={setImportedMembers}
            />
          )}

          {/* Payouts */}
          {section === "payouts" && (
            <PayoutsSection
              members={importedMembers}
              setMembers={setImportedMembers}
            />
          )}

          {/* Global Insights */}
          {section === "globalInsights" && <GlobalInsightsSection />}

          {/* Product Inventory */}
          {section === "inventory" && <ProductInventorySection />}

          {/* Vendor Requests */}
          {section === "vendorRequests" && <VendorRequestsSection />}

          {/* Orders */}
          {section === "orders" && <OrdersSection />}

          {/* Settings */}
          {section === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-black uppercase tracking-wide text-saffron mb-6">
                Settings
              </h2>
              <Card className="shadow-card max-w-xl" data-ocid="settings.panel">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-widest text-saffron">
                    Site Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {settingsLoading ? (
                    <div
                      className="space-y-3"
                      data-ocid="settings.loading_state"
                    >
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateSettings(settingsForm, {
                          onSuccess: () => toast.success("Settings saved!"),
                          onError: () =>
                            toast.error("Failed to save settings."),
                        });
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <Label className="text-xs uppercase tracking-widest font-bold">
                          Site Title
                        </Label>
                        <Input
                          value={settingsForm.siteTitle}
                          onChange={(e) =>
                            setSettingsForm((p) => ({
                              ...p,
                              siteTitle: e.target.value,
                            }))
                          }
                          placeholder="EarningBySurfing"
                          className="mt-1"
                          data-ocid="settings.input"
                        />
                      </div>
                      <div>
                        <Label className="text-xs uppercase tracking-widest font-bold">
                          Announcement Text
                        </Label>
                        <Textarea
                          value={settingsForm.announcementText}
                          onChange={(e) =>
                            setSettingsForm((p) => ({
                              ...p,
                              announcementText: e.target.value,
                            }))
                          }
                          placeholder="Enter announcement for the top bar..."
                          rows={3}
                          className="mt-1"
                          data-ocid="settings.textarea"
                        />
                      </div>
                      {/* Affiliate API Configuration */}
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs font-black uppercase tracking-widest text-saffron mb-3">
                          Affiliate API Configuration
                        </p>

                        {/* ClickBank */}
                        <div className="mb-4 p-3 rounded-lg border border-[#FF9933]/20 bg-[#FF9933]/5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                              ClickBank
                            </span>
                            {affiliateStatus?.clickbankConfigured ? (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                ● Connected
                              </span>
                            ) : (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                ○ Not Configured
                              </span>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div>
                              <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                API Key
                              </Label>
                              <Input
                                type="password"
                                value={settingsForm.clickbankApiKey}
                                onChange={(e) =>
                                  setSettingsForm((p) => ({
                                    ...p,
                                    clickbankApiKey: e.target.value,
                                  }))
                                }
                                placeholder="Enter ClickBank API Key"
                                className="mt-1 text-xs"
                                data-ocid="settings.input"
                              />
                            </div>
                            <div>
                              <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                Clerk ID
                              </Label>
                              <Input
                                type="password"
                                value={settingsForm.clickbankClerkId}
                                onChange={(e) =>
                                  setSettingsForm((p) => ({
                                    ...p,
                                    clickbankClerkId: e.target.value,
                                  }))
                                }
                                placeholder="Enter ClickBank Clerk ID"
                                className="mt-1 text-xs"
                                data-ocid="settings.input"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Amazon */}
                        <div className="p-3 rounded-lg border border-[#FF9933]/20 bg-[#FF9933]/5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                              Amazon Associates
                            </span>
                            {affiliateStatus?.amazonConfigured ? (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                ● Connected
                              </span>
                            ) : (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                ○ Not Configured
                              </span>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div>
                              <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                Access Key
                              </Label>
                              <Input
                                type="password"
                                value={settingsForm.amazonAccessKey}
                                onChange={(e) =>
                                  setSettingsForm((p) => ({
                                    ...p,
                                    amazonAccessKey: e.target.value,
                                  }))
                                }
                                placeholder="Enter Amazon Access Key"
                                className="mt-1 text-xs"
                                data-ocid="settings.input"
                              />
                            </div>
                            <div>
                              <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                Secret Key
                              </Label>
                              <Input
                                type="password"
                                value={settingsForm.amazonSecretKey}
                                onChange={(e) =>
                                  setSettingsForm((p) => ({
                                    ...p,
                                    amazonSecretKey: e.target.value,
                                  }))
                                }
                                placeholder="Enter Amazon Secret Key"
                                className="mt-1 text-xs"
                                data-ocid="settings.input"
                              />
                            </div>
                            <div>
                              <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                Associate Tag
                              </Label>
                              <Input
                                type="text"
                                value={settingsForm.amazonAssociateTag}
                                onChange={(e) =>
                                  setSettingsForm((p) => ({
                                    ...p,
                                    amazonAssociateTag: e.target.value,
                                  }))
                                }
                                placeholder="e.g. yoursite-21"
                                className="mt-1 text-xs"
                                data-ocid="settings.input"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="bg-saffron text-white font-bold uppercase tracking-widest text-xs w-full"
                        disabled={savingSettings}
                        data-ocid="settings.submit_button"
                      >
                        {savingSettings ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Settings
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Pages CMS */}
          {section === "pages" && <PagesCmsSection />}
        </div>
      </div>
    </main>
  );
}
