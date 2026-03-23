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
import {
  LayoutDashboard,
  Loader2,
  Package,
  Plus,
  Save,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  Category,
  useAllProducts,
  useCreateProduct,
  useDeleteProduct,
  useIsAdmin,
  useListAllUsers,
  useLiveVisitorCount,
  useSiteSettings,
  useUpdateSiteSettings,
  useVisitorCount,
} from "../hooks/useQueries";

const CATEGORY_OPTIONS = [
  { value: Category.shoesAndClothes, label: "Shoes & Clothes" },
  { value: Category.toys, label: "Toys" },
  { value: Category.technology, label: "Technology" },
  { value: Category.books, label: "Books" },
];

type AdminSection = "dashboard" | "products" | "users" | "settings";

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

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [addOpen, setAddOpen] = useState(false);

  const { data: products, isLoading: productsLoading } = useAllProducts();
  const { data: users, isLoading: usersLoading } = useListAllUsers();
  const { data: siteSettings, isLoading: settingsLoading } = useSiteSettings();
  const { data: totalVisitors } = useVisitorCount();
  const { data: liveVisitors } = useLiveVisitorCount();
  const { mutate: deleteProduct, isPending: deletingProduct } =
    useDeleteProduct();
  const { mutate: updateSettings, isPending: savingSettings } =
    useUpdateSiteSettings();

  const [settingsForm, setSettingsForm] = useState({
    siteTitle: "",
    announcementText: "",
  });
  const [settingsInit, setSettingsInit] = useState(false);

  if (!settingsInit && siteSettings) {
    setSettingsForm({
      siteTitle: siteSettings.siteTitle,
      announcementText: siteSettings.announcementText,
    });
    setSettingsInit(true);
  }

  if (!identity) {
    return (
      <main
        className="min-h-screen flex items-center justify-center bg-muted/30"
        data-ocid="admin.page"
      >
        <div className="text-center" data-ocid="admin.error_state">
          <h2 className="text-2xl font-black uppercase text-saffron">
            Login Required
          </h2>
          <p className="text-muted-foreground mt-2 normal-case">
            You must be logged in to access the admin panel.
          </p>
        </div>
      </main>
    );
  }

  if (checkingAdmin) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-saffron" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main
        className="min-h-screen flex items-center justify-center bg-muted/30"
        data-ocid="admin.page"
      >
        <div className="text-center" data-ocid="admin.error_state">
          <h2 className="text-2xl font-black uppercase text-destructive">
            Access Denied
          </h2>
          <p className="text-muted-foreground mt-2 normal-case">
            You do not have admin privileges to access this panel.
          </p>
        </div>
      </main>
    );
  }

  const navItems: {
    id: AdminSection;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
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
          <h1 className="text-sm font-black uppercase tracking-widest">
            Admin Panel
          </h1>
          <p className="text-white/70 text-xs normal-case mt-1">
            EarningBySurfing
          </p>
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
          {/* Dashboard Section */}
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

          {/* Products Section */}
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
                    <Skeleton key={i} className="h-12 w-full" />
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
                                className={`text-xs font-bold uppercase ${
                                  product.featured
                                    ? "text-saffron"
                                    : "text-muted-foreground"
                                }`}
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

          {/* Users Section */}
          {section === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-black uppercase tracking-wide text-saffron mb-6">
                Users
              </h2>
              {usersLoading ? (
                <div className="space-y-2" data-ocid="users.loading_state">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
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

          {/* Settings Section */}
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
        </div>
      </div>
    </main>
  );
}
