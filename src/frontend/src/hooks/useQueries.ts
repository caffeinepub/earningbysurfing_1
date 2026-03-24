import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Category,
  type Product,
  type SiteSettings,
  type UserProfile,
  type UserRole,
} from "../backend";
import { useActor } from "./useActor";

export { Category };

export function useVisitorCount() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["visitorCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getVisitorCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLiveVisitorCount() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["liveVisitorCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getLiveVisitorCount();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["callerUserRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["callerUserProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMemberStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["memberStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMemberStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSiteSettings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSiteSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("No actor");
      return actor.createProduct(product);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allProducts"] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, product }: { id: bigint; product: Product }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProduct(id, product);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allProducts"] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allProducts"] }),
  });
}

export function useUpdateSiteSettings() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: SiteSettings) => {
      if (!actor) throw new Error("No actor");
      return actor.updateSiteSettings(settings);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["siteSettings"] }),
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("No actor");
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUsers"] }),
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("No actor");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["callerUserProfile"] }),
  });
}

export function useTrackVisitor() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      return actor.trackVisitor();
    },
  });
}

export function useAutoPostCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["autoPostCategories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAutoPostCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAutoPostCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (category: string) => {
      if (!actor) throw new Error("No actor");
      return actor.addAutoPostCategory(category);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["autoPostCategories"] }),
  });
}

export function useRemoveAutoPostCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (category: string) => {
      if (!actor) throw new Error("No actor");
      return actor.removeAutoPostCategory(category);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["autoPostCategories"] }),
  });
}

export function useAllInventoryProducts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["inventoryProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInventoryProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddInventoryProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      name: string;
      price: number;
      category: string;
      affiliateLink: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addInventoryProduct(
        args.name,
        args.price,
        args.category,
        args.affiliateLink,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inventoryProducts"] }),
  });
}

export function useDeleteInventoryProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteInventoryProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inventoryProducts"] }),
  });
}

export function useVendorRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["vendorRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVendorRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitVendorRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      vendorName: string;
      businessName: string;
      productName: string;
      category: string;
      description: string;
      price: number;
      websiteLink: string;
      contactEmail: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.submitVendorRequest({
        id: BigInt(0),
        vendorName: args.vendorName,
        businessName: args.businessName,
        productName: args.productName,
        category: args.category,
        description: args.description,
        price: args.price,
        websiteLink: args.websiteLink,
        contactEmail: args.contactEmail,
        status: "pending",
        submittedAt: BigInt(Date.now()) * BigInt(1000000),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendorRequests"] }),
  });
}

export function useUpdateVendorRequestStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: bigint; status: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateVendorRequestStatus(args.id, args.status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendorRequests"] }),
  });
}

export function useOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRoundRobinIndex() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["roundRobinIndex"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getRoundRobinIndex();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { productName: string; totalMembers: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.submitOrder(args.productName, args.totalMembers);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["roundRobinIndex"] });
    },
  });
}

export function useAffiliateConfigStatus() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["affiliateConfigStatus"],
    queryFn: async () => {
      if (!actor)
        return { clickbankConfigured: false, amazonConfigured: false };
      return actor.getAffiliateConfigStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFetchClickbankProducts() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (searchQuery: string) => {
      if (!actor) throw new Error("No actor");
      return actor.fetchClickbankProducts(searchQuery);
    },
  });
}
