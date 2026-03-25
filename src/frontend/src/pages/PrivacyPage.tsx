import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";

export default function PrivacyPage() {
  const { actor, isFetching } = useActor();
  const { data: pageContent, isLoading } = useQuery({
    queryKey: ["pageContent", "privacy"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPageContent("privacy");
    },
    enabled: !!actor && !isFetching,
  });

  return (
    <div className="min-h-[60vh] bg-white">
      <div className="bg-[#F37D22] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3 text-white/70">
              Legal
            </p>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest">
              Privacy Policy
            </h1>
            <div className="w-16 h-1 bg-white/40 mt-4" />
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="space-y-3" data-ocid="privacy.loading_state">
            {["a", "b", "c", "d", "e"].map((key, i) => (
              <div
                key={key}
                className="h-4 bg-gray-100 rounded animate-pulse"
                style={{ width: `${80 - i * 8}%` }}
              />
            ))}
          </div>
        ) : pageContent?.content ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="prose prose-lg max-w-none prose-headings:text-[#F37D22] prose-headings:font-black prose-headings:uppercase prose-headings:tracking-wide"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Admin-managed CMS content
            dangerouslySetInnerHTML={{ __html: pageContent.content }}
            data-ocid="privacy.section"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
            data-ocid="privacy.empty_state"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F37D22]/10 mb-6">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-[#F37D22] mb-4">
              Privacy Policy
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Your privacy is important to us. EarningBySurfing is committed to
              protecting your personal data and never shares your information
              with third parties without explicit consent. Full privacy policy
              details will be published here soon.
            </p>
            <p className="text-xs text-muted-foreground mt-6 uppercase tracking-widest">
              Content coming soon &mdash; Admin can update this in the Pages
              section.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
