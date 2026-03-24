import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface VendorRequest {
    id: bigint;
    websiteLink: string;
    status: string;
    businessName: string;
    submittedAt: Time;
    description: string;
    productName: string;
    contactEmail: string;
    category: string;
    price: number;
    vendorName: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface AffiliateConfigStatus {
    clickbankConfigured: boolean;
    amazonConfigured: boolean;
}
export interface Order {
    id: bigint;
    productName: string;
    assignedMemberId: string;
    timestamp: Time;
    memberIndex: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface SiteSettings {
    amazonAssociateTag: string;
    siteTitle: string;
    announcementText: string;
    amazonAccessKey: string;
    clickbankClerkId: string;
    amazonSecretKey: string;
    clickbankApiKey: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface PageContent {
    title: string;
    content: string;
}
export interface InventoryProduct {
    id: bigint;
    name: string;
    category: string;
    affiliateLink: string;
    price: number;
}
export type ProductId = bigint;
export interface Product {
    title: string;
    featured: boolean;
    description: string;
    qualityScore: bigint;
    imageUrl: string;
    category: Category;
    aiReview: string;
}
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
    addAutoPostCategory(category: string): Promise<void>;
    addInventoryProduct(name: string, price: number, category: string, affiliateLink: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkCountryAccess(countryCode: string): Promise<boolean>;
    createProduct(originalProduct: Product): Promise<ProductId>;
    deleteAllProducts(): Promise<void>;
    deleteInventoryProduct(id: bigint): Promise<void>;
    deleteProduct(productId: bigint): Promise<void>;
    fetchClickbankProducts(searchQuery: string): Promise<string>;
    getAffiliateConfigStatus(): Promise<AffiliateConfigStatus>;
    getAllInventoryProducts(): Promise<Array<[bigint, InventoryProduct]>>;
    getAllPageContents(): Promise<Array<[string, PageContent]>>;
    getAllProducts(): Promise<Array<[ProductId, Product]>>;
    getAutoPostCategories(): Promise<Array<string>>;
    getBlockedCountries(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLiveVisitorCount(): Promise<bigint>;
    getMemberStats(): Promise<{
        joinDate: Time;
        activityCount: bigint;
    } | null>;
    getOrders(): Promise<Array<[bigint, Order]>>;
    getPageContent(slug: string): Promise<PageContent | null>;
    getProduct(productId: bigint): Promise<Product | null>;
    getProductsByCategory(category: Category): Promise<Array<[ProductId, Product]>>;
    getRoundRobinIndex(): Promise<bigint>;
    getSiteSettings(): Promise<SiteSettings>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVendorRequests(): Promise<Array<[bigint, VendorRequest]>>;
    getVisitorCount(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    isCategoryAutoPosted(category: string): Promise<boolean>;
    listAllUsers(): Promise<Array<[Principal, UserProfile]>>;
    removeAutoPostCategory(category: string): Promise<void>;
    resetRoundRobinIndex(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setPageContent(slug: string, content: PageContent): Promise<void>;
    submitOrder(productName: string, totalMembers: bigint): Promise<bigint>;
    submitVendorRequest(newRequest: VendorRequest): Promise<bigint>;
    trackVisitor(): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateBlockedCountries(newCountries: Array<string>): Promise<void>;
    updateInventoryProduct(id: bigint, name: string, price: number, category: string, affiliateLink: string): Promise<void>;
    updateProduct(productId: bigint, product: Product): Promise<void>;
    updateSiteSettings(newSettings: SiteSettings): Promise<void>;
    updateVendorRequestStatus(id: bigint, status: string): Promise<void>;
}
