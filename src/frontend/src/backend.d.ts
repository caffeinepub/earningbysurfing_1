import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    title: string;
    featured: boolean;
    description: string;
    qualityScore: bigint;
    imageUrl: string;
    category: Category;
    aiReview: string;
}
export interface SiteSettings {
    siteTitle: string;
    announcementText: string;
}
export type Time = bigint;
export type ProductId = bigint;
export interface UserProfile {
    joinDate: Time;
    name: string;
    activityCount: bigint;
}
export enum Category {
    shoesAndClothes = "shoesAndClothes",
    tech = "tech",
    toys = "toys",
    technology = "technology",
    wellness = "wellness",
    books = "books",
    lifestyle = "lifestyle"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(product: Product): Promise<ProductId>;
    deleteAllProducts(): Promise<void>;
    deleteProduct(productId: bigint): Promise<void>;
    getAllProducts(): Promise<Array<[ProductId, Product]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLiveVisitorCount(): Promise<bigint>;
    getMemberStats(): Promise<{
        joinDate: Time;
        activityCount: bigint;
    } | null>;
    getProduct(productId: bigint): Promise<Product | null>;
    getProductsByCategory(category: Category): Promise<Array<[ProductId, Product]>>;
    getSiteSettings(): Promise<SiteSettings>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisitorCount(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    listAllUsers(): Promise<Array<[Principal, UserProfile]>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    trackVisitor(): Promise<void>;
    updateProduct(productId: bigint, product: Product): Promise<void>;
    updateSiteSettings(newSettings: SiteSettings): Promise<void>;
}
