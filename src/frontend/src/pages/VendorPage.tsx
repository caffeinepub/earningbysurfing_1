import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, ShieldX, Store } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitVendorRequest } from "../hooks/useQueries";

const CATEGORIES = [
  "Tech",
  "Lifestyle",
  "Wellness",
  "Food & Beverage",
  "Beauty",
  "Other",
];

export default function VendorPage() {
  const [form, setForm] = useState({
    vendorName: "",
    businessName: "",
    productName: "",
    category: "",
    description: "",
    price: "",
    websiteLink: "",
    contactEmail: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync, isPending } = useSubmitVendorRequest();

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.vendorName ||
      !form.businessName ||
      !form.productName ||
      !form.category ||
      !form.contactEmail
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await mutateAsync({
        ...form,
        price: Number.parseFloat(form.price) || 0,
      });
      setSubmitted(true);
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-muted/20 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
          data-ocid="vendor.success_state"
        >
          <div className="w-20 h-20 rounded-full bg-saffron/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-saffron" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-foreground mb-3">
            Submission Received!
          </h2>
          <p className="text-muted-foreground normal-case leading-relaxed mb-6">
            Your product details have been submitted for review. Our admin team
            will evaluate your request and respond within 2–3 business days.
          </p>
          <Button
            className="bg-saffron hover:bg-saffron-dark text-white font-bold uppercase tracking-widest"
            onClick={() => {
              setSubmitted(false);
              setForm({
                vendorName: "",
                businessName: "",
                productName: "",
                category: "",
                description: "",
                price: "",
                websiteLink: "",
                contactEmail: "",
              });
            }}
            data-ocid="vendor.secondary_button"
          >
            Submit Another Product
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/20" data-ocid="vendor.page">
      {/* Hero banner */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a0a00 0%, #3d1f00 50%, #ff9933 130%)",
        }}
      >
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-14 h-14 rounded-xl bg-saffron flex items-center justify-center mx-auto mb-5">
              <Store className="h-7 w-7 text-white" />
            </div>
            <p className="text-white/60 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
              Private Vendor Portal
            </p>
            <h1 className="text-4xl sm:text-5xl font-black uppercase text-white leading-tight mb-4">
              List Your <span className="text-saffron">Product</span>
            </h1>
            <p className="text-white/75 normal-case text-base leading-relaxed max-w-xl mx-auto">
              Join our global affiliate network. Submit your product for review
              and reach thousands of active members worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pakistan Block Notice */}
      <div className="bg-red-950 border-b border-red-800 py-2 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <ShieldX className="h-4 w-4 text-red-400" />
          <span className="text-red-300 text-xs font-semibold uppercase tracking-wider">
            Pakistan traffic restricted — Submissions from Pakistan are not
            accepted.
          </span>
        </div>
      </div>

      {/* Form */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className="shadow-lg border border-border"
              data-ocid="vendor.panel"
            >
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-lg font-black uppercase tracking-widest text-saffron">
                  Product Submission Form
                </CardTitle>
                <p className="text-xs text-muted-foreground normal-case mt-1">
                  All fields marked * are required. Our team reviews every
                  submission within 48 hours.
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-widest">
                        Vendor Name *
                      </Label>
                      <Input
                        placeholder="Your full name"
                        value={form.vendorName}
                        onChange={(e) =>
                          handleChange("vendorName", e.target.value)
                        }
                        className="border-border focus-visible:ring-saffron"
                        data-ocid="vendor.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-widest">
                        Business Name *
                      </Label>
                      <Input
                        placeholder="Your company or shop name"
                        value={form.businessName}
                        onChange={(e) =>
                          handleChange("businessName", e.target.value)
                        }
                        className="border-border focus-visible:ring-saffron"
                        data-ocid="vendor.input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-widest">
                        Product Name *
                      </Label>
                      <Input
                        placeholder="Name of the product"
                        value={form.productName}
                        onChange={(e) =>
                          handleChange("productName", e.target.value)
                        }
                        className="border-border focus-visible:ring-saffron"
                        data-ocid="vendor.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-widest">
                        Category *
                      </Label>
                      <Select
                        value={form.category}
                        onValueChange={(v) => handleChange("category", v)}
                      >
                        <SelectTrigger
                          className="border-border focus:ring-saffron"
                          data-ocid="vendor.select"
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-widest">
                      Product Description
                    </Label>
                    <Textarea
                      placeholder="Describe your product — features, benefits, target audience..."
                      value={form.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      rows={4}
                      className="border-border focus-visible:ring-saffron normal-case resize-none"
                      data-ocid="vendor.textarea"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-widest">
                        Price (USD)
                      </Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={form.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        className="border-border focus-visible:ring-saffron"
                        data-ocid="vendor.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-widest">
                        Website / Product Link
                      </Label>
                      <Input
                        placeholder="https://yoursite.com/product"
                        value={form.websiteLink}
                        onChange={(e) =>
                          handleChange("websiteLink", e.target.value)
                        }
                        className="border-border focus-visible:ring-saffron"
                        data-ocid="vendor.input"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-widest">
                      Contact Email *
                    </Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={form.contactEmail}
                      onChange={(e) =>
                        handleChange("contactEmail", e.target.value)
                      }
                      className="border-border focus-visible:ring-saffron"
                      data-ocid="vendor.input"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-saffron hover:bg-saffron-dark text-white font-black uppercase tracking-widest py-3"
                    data-ocid="vendor.submit_button"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit for Approval"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
