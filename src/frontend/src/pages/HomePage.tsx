import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  ChevronRight,
  Cpu,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { Category } from "../backend";
import { useAllProducts } from "../hooks/useQueries";

const CATEGORY_LABELS: Record<Category, string> = {
  [Category.shoesAndClothes]: "Fashion",
  [Category.toys]: "Toys",
  [Category.technology]: "Tech",
  [Category.books]: "Books",
  [Category.tech]: "Tech",
  [Category.lifestyle]: "Lifestyle",
  [Category.wellness]: "Wellness",
};

function CategoryBadge({ category }: { category: Category }) {
  return (
    <Badge className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-saffron/10 text-saffron border-0 rounded-full hover:bg-saffron/10">
      {CATEGORY_LABELS[category]}
    </Badge>
  );
}

function QualityScoreBadge({ score }: { score: bigint }) {
  const num = Number(score);
  return (
    <div className="absolute top-3 right-3 flex items-center gap-1 bg-saffron text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-md">
      <Star className="h-3 w-3 fill-white" />
      {num}
    </div>
  );
}

function ProductCard({
  title,
  category,
  description,
  aiReview,
  qualityScore,
  index,
}: {
  title: string;
  category: Category;
  description: string;
  aiReview?: string;
  qualityScore?: bigint;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-lg shadow-card border border-border overflow-hidden group hover:shadow-lg transition-shadow"
      data-ocid={`products.item.${index + 1}`}
    >
      {/* Product image */}
      <div className="product-image-placeholder h-48 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <TrendingUp className="h-12 w-12 text-white/40" />
        </div>
        <div className="absolute top-3 left-3">
          <CategoryBadge category={category} />
        </div>
        {qualityScore !== undefined && (
          <QualityScoreBadge score={qualityScore} />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground normal-case font-medium leading-relaxed mb-3 line-clamp-2">
          {description}
        </p>
        {aiReview && (
          <div className="flex items-start gap-1.5 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-saffron flex-shrink-0 mt-0.5" />
            <p className="text-xs italic text-muted-foreground normal-case line-clamp-1">
              {aiReview}
            </p>
          </div>
        )}
        <Button
          size="sm"
          className="w-full bg-saffron hover:bg-saffron-dark text-white text-xs uppercase tracking-widest font-bold"
          data-ocid={`products.button.${index + 1}`}
        >
          View Product
        </Button>
      </div>
    </motion.div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data: products, isLoading } = useAllProducts();

  const displayProducts = products?.slice(0, 4).map(([, p]) => p) ?? [];

  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] flex items-center overflow-hidden"
        data-ocid="hero.section"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #1a0a00 0%, #3d1f00 40%, #6b3800 70%, #ff9933 130%)",
          }}
        />
        <div className="hero-gradient absolute inset-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="text-white/70 text-xs font-semibold uppercase tracking-[0.3em] mb-4">
              Welcome to EarningBySurfing
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-none mb-6">
              <span className="text-saffron">Discover</span>
              <br />
              <span className="text-white">Premium</span>
              <br />
              <span className="text-saffron">Products</span>
            </h1>
            <p className="text-white/80 text-lg normal-case font-medium leading-relaxed mb-10 max-w-lg">
              AI-curated high-demand affiliate products — Tech, Lifestyle &
              Wellness — with verified quality scores and expert reviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-saffron hover:bg-saffron-dark text-white font-black uppercase tracking-widest text-sm px-8"
                data-ocid="hero.primary_button"
              >
                SHOP NOW <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-transparent hover:bg-white/10 font-black uppercase tracking-widest text-sm px-8"
                data-ocid="hero.secondary_button"
              >
                EXPLORE TRENDING
              </Button>
            </div>
          </motion.div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
        />
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-white" data-ocid="trending.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">
              AI-Powered Discovery
            </p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wide text-saffron mb-2">
              Trending Products
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Cpu className="h-4 w-4 text-saffron" />
              <span className="text-xs text-muted-foreground normal-case">
                Each product AI-scored and reviewed for quality
              </span>
            </div>
            <div className="w-16 h-1 bg-saffron mx-auto rounded-full" />
          </motion.div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            data-ocid="products.list"
          >
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                  <ProductSkeleton key={i} />
                ))
              : displayProducts.map((product, i) => (
                  <ProductCard
                    key={product.title}
                    title={product.title}
                    category={product.category}
                    description={product.description}
                    aiReview={product.aiReview}
                    qualityScore={product.qualityScore}
                    index={i}
                  />
                ))}
          </div>

          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              className="border-saffron text-saffron hover:bg-saffron hover:text-white font-bold uppercase tracking-widest text-sm"
              data-ocid="trending.button"
            >
              VIEW ALL PRODUCTS <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Collections + Mission */}
      <section className="py-20 bg-muted/30" data-ocid="collections.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-wide text-saffron mb-6">
                Featured Collections
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="collection-tile-1 rounded-lg h-48 flex items-end p-4 cursor-pointer overflow-hidden"
                >
                  <div>
                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">
                      Collection
                    </p>
                    <p className="text-white font-black uppercase text-lg">
                      Tech Essentials
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="collection-tile-2 rounded-lg h-48 flex items-end p-4 cursor-pointer overflow-hidden"
                >
                  <div>
                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">
                      Collection
                    </p>
                    <p className="text-white font-black uppercase text-lg">
                      Lifestyle Picks
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-2xl font-black uppercase tracking-wide text-saffron mb-6">
                Our Mission
              </h2>
              <p className="text-foreground text-base normal-case leading-relaxed mb-4 font-medium">
                At EarningBySurfing, we believe that great products should be
                accessible to everyone. Our AI hunts only the highest-demand
                items across Tech, Lifestyle, and Wellness categories.
              </p>
              <p className="text-muted-foreground text-sm normal-case leading-relaxed mb-6">
                Every product receives an AI-generated quality score and expert
                review — so you always know exactly what you're promoting.
              </p>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-5 w-5 fill-saffron text-saffron" />
                ))}
                <span className="text-sm font-bold text-foreground uppercase tracking-wide ml-1">
                  Trusted Platform
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-saffron" data-ocid="cta.section">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wide text-white mb-4">
              Start Earning Today
            </h2>
            <p className="text-white/80 text-lg normal-case font-medium mb-8">
              Join our platform and get access to AI-curated products, smart
              affiliate links, and WhatsApp marketing tools.
            </p>
            <Button
              size="lg"
              className="bg-white text-saffron hover:bg-white/90 font-black uppercase tracking-widest text-sm px-10"
              data-ocid="cta.primary_button"
            >
              GET STARTED FREE
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
