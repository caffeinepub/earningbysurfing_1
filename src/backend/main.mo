import Text "mo:core/Text";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  // Types
  public type Category = {
    #tech;
    #lifestyle;
    #wellness;
    #books;
    #shoesAndClothes;
    #technology;
    #toys;
  };
  public type Product = {
    title : Text;
    description : Text;
    category : Category;
    imageUrl : Text;
    featured : Bool;
    aiReview : Text;
    qualityScore : Nat;
  };

  public type UserProfile = {
    name : Text;
    joinDate : Time.Time;
    activityCount : Nat;
  };

  public type SiteSettings = {
    siteTitle : Text;
    announcementText : Text;
  };

  // State
  var visitorCount : Nat = 0;
  var liveVisitorCount : Nat = 0;
  let visitorTimeout : Int = 1_000_000_000 * 60 * 10;
  let liveVisitors = Map.empty<Principal, Time.Time>();

  public type ProductId = Nat;

  let products = Map.empty<Nat, Product>();
  var nextProductId : Nat = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  var siteSettings : SiteSettings = {
    siteTitle = "EarningBySurfing";
    announcementText = "Welcome to EarningBySurfing — your AI-powered affiliate platform!";
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Seed data
  let seedProducts : [Product] = [
    // Tech
    {
      title = "Sony WH-1000XM5 Noise-Cancelling Headphones";
      description = "Industry-leading noise cancellation with 30-hour battery life and crystal-clear call quality.";
      category = #tech;
      imageUrl = "";
      featured = true;
      aiReview = "The Sony WH-1000XM5 sets a new standard for consumer audio. Its adaptive noise cancellation performs brilliantly in all environments, from busy offices to packed airports. Exceptional build quality and comfort make this a top-tier affiliate pick with consistent high conversions.";
      qualityScore = 97;
    },
    {
      title = "Apple AirTag 4-Pack Tracker";
      description = "Precision finding with ultra-wideband technology. Never lose your belongings again.";
      category = #tech;
      imageUrl = "";
      featured = true;
      aiReview = "Apple AirTags continue to dominate the item-tracking category with seamless iOS integration and a massive Find My network. The 4-pack offers excellent value and sees strong repeat purchases. Highly recommended for tech-focused affiliate campaigns.";
      qualityScore = 94;
    },
    {
      title = "Anker 737 Power Bank 24000mAh";
      description = "65W fast charging for laptops, phones, and tablets. Portable powerhouse for travelers and professionals.";
      category = #tech;
      imageUrl = "";
      featured = false;
      aiReview = "Anker's 737 Power Bank delivers on every promise — massive capacity, fast charging, and a reliable brand with strong customer trust. It consistently ranks among the top-selling portable chargers globally, making it a proven high-conversion affiliate product.";
      qualityScore = 92;
    },
    {
      title = "Logitech MX Master 3S Wireless Mouse";
      description = "Ergonomic precision mouse with ultra-fast MagSpeed scrolling and 8K DPI sensor.";
      category = #tech;
      imageUrl = "";
      featured = false;
      aiReview = "The MX Master 3S is a productivity powerhouse loved by developers, designers, and remote workers alike. Its cross-device functionality and whisper-quiet clicks set it apart. This product has a loyal user base and excellent affiliate commission potential.";
      qualityScore = 95;
    },
    // Lifestyle
    {
      title = "YETI Rambler 30 oz Travel Tumbler";
      description = "Double-wall vacuum insulation keeps drinks hot or cold for hours. The gold standard in premium drinkware.";
      category = #lifestyle;
      imageUrl = "";
      featured = true;
      aiReview = "YETI's Rambler Tumbler has achieved near-cult status among outdoor enthusiasts and office professionals. Its superior insulation and rugged build justify the premium price, resulting in strong customer satisfaction and low return rates — ideal for affiliate promotion.";
      qualityScore = 96;
    },
    {
      title = "Kindle Paperwhite 16GB E-Reader";
      description = "Waterproof, glare-free display with 3-month battery life. Carry your entire library anywhere.";
      category = #lifestyle;
      imageUrl = "";
      featured = true;
      aiReview = "The Kindle Paperwhite remains the definitive e-reader for millions worldwide. Its waterproof design, crisp display, and Amazon ecosystem integration drive consistent sales year-round. A perennial bestseller with outstanding affiliate commission history.";
      qualityScore = 93;
    },
    {
      title = "Nespresso Vertuo Next Coffee Machine";
      description = "One-touch brewing with barcode-reading technology. Espresso and full cups from a single machine.";
      category = #lifestyle;
      imageUrl = "";
      featured = false;
      aiReview = "The Vertuo Next is a gateway product that drives long-term value through capsule subscriptions. Its sleek design and foolproof operation appeal to a wide demographic. Strong initial sale conversion combined with subscription upsell makes this a top lifestyle affiliate pick.";
      qualityScore = 90;
    },
    {
      title = "Osprey Farpoint 40 Travel Backpack";
      description = "Carry-on compliant travel pack with integrated suspension and dedicated laptop sleeve.";
      category = #lifestyle;
      imageUrl = "";
      featured = false;
      aiReview = "Osprey's Farpoint 40 is the go-to choice for minimalist travelers and digital nomads. Its quality craftsmanship and carry-on dimensions make it highly sought-after in travel communities. Consistent 4.8-star ratings and strong community endorsements drive reliable affiliate conversions.";
      qualityScore = 91;
    },
    // Wellness
    {
      title = "Theragun Prime Percussive Therapy Device";
      description = "Professional-grade muscle treatment with 5 attachments and 16mm amplitude for deep tissue relief.";
      category = #wellness;
      imageUrl = "";
      featured = true;
      aiReview = "The Theragun Prime has revolutionized at-home recovery for athletes and office workers alike. Its quiet motor and clinical-grade efficacy have made it a household name in wellness. High average order value and strong repeat purchase potential make this an elite affiliate product.";
      qualityScore = 98;
    },
    {
      title = "Fitbit Charge 6 Advanced Fitness Tracker";
      description = "Built-in GPS, heart rate monitoring, stress management, and Google integration in a sleek band.";
      category = #wellness;
      imageUrl = "";
      featured = true;
      aiReview = "The Fitbit Charge 6 bridges fitness tracking and smartwatch functionality at an accessible price point. Google integration and comprehensive health metrics appeal to health-conscious consumers. A reliable affiliate product with strong brand recognition and steady seasonal demand spikes.";
      qualityScore = 89;
    },
    {
      title = "Manduka PRO Yoga Mat 6mm";
      description = "Lifetime guarantee yoga mat with unmatched cushioning and non-slip grip for all yoga styles.";
      category = #wellness;
      imageUrl = "";
      featured = false;
      aiReview = "The Manduka PRO is the premium choice for serious yoga practitioners and studio owners. Its lifetime guarantee and eco-certified materials command a loyal following willing to pay premium prices. Excellent for wellness-focused affiliate campaigns targeting mindful consumers.";
      qualityScore = 88;
    },
    {
      title = "Hydro Flask 32 oz Wide Mouth Water Bottle";
      description = "TempShield insulation keeps cold 24hrs, hot 12hrs. Durable powder coat finish. BPA-free.";
      category = #wellness;
      imageUrl = "";
      featured = false;
      aiReview = "Hydro Flask has become synonymous with premium hydration, particularly among outdoor and wellness communities. The wide-mouth design and variety of color options drive gift purchases alongside personal use. A social-media-friendly product with outstanding organic affiliate reach.";
      qualityScore = 93;
    }
  ];

  // Init: seed products on first deploy
  func initProducts() {
    if (products.size() == 0) {
      for (p in seedProducts.vals()) {
        products.add(nextProductId, p);
        nextProductId += 1;
      };
    };
  };

  initProducts();

  // Helper function for admin enforcement
  func enforceAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  // Helper function for member enforcement
  func enforceMember(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only members can perform this action");
    };
  };

  // Visitor tracking helper
  func updateLiveVisitors() {
    let currentTime = Time.now();
    let expiredThreshold = currentTime - visitorTimeout;
    var activeCount : Nat = 0;
    for ((principal, timestamp) in liveVisitors.entries()) {
      if (timestamp < expiredThreshold) {
        liveVisitors.remove(principal);
      } else {
        activeCount += 1;
      };
    };
    liveVisitorCount := activeCount;
  };

  // Product CRUD Operations (Admin only)
  public shared ({ caller }) func createProduct(product : Product) : async ProductId {
    enforceAdmin(caller);
    let productId = nextProductId;
    products.add(productId, product);
    nextProductId += 1;
    productId;
  };

  public query func getProduct(productId : Nat) : async ?Product {
    products.get(productId);
  };

  public query func getAllProducts() : async [(ProductId, Product)] {
    let entries = products.entries().toArray();
    entries.sort(func(a : (ProductId, Product), b : (ProductId, Product)) : Order.Order {
      Text.compare(a.1.title, b.1.title);
    });
  };

  public query func getProductsByCategory(category : Category) : async [(ProductId, Product)] {
    let entries = products.entries().toArray();
    entries.filter(func((_, p) : (ProductId, Product)) : Bool { p.category == category });
  };

  public shared ({ caller }) func updateProduct(productId : Nat, product : Product) : async () {
    enforceAdmin(caller);
    if (products.containsKey(productId)) {
      products.add(productId, product);
    } else {
      Runtime.trap("Product does not exist");
    };
  };

  public shared ({ caller }) func deleteProduct(productId : Nat) : async () {
    enforceAdmin(caller);
    products.remove(productId);
  };

  public shared ({ caller }) func deleteAllProducts() : async () {
    enforceAdmin(caller);
    products.clear();
    nextProductId := 1;
  };

  // Visitor Tracking
  public shared ({ caller }) func trackVisitor() : async () {
    visitorCount += 1;
    let currentTime = Time.now();
    liveVisitors.add(caller, currentTime);
    updateLiveVisitors();
  };

  public query func getVisitorCount() : async Nat {
    visitorCount;
  };

  public query func getLiveVisitorCount() : async Nat {
    liveVisitorCount;
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    enforceMember(caller);
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    enforceMember(caller);
    let existingProfile = userProfiles.get(caller);
    let updatedProfile = switch (existingProfile) {
      case (?existing) {
        { name = profile.name; joinDate = existing.joinDate; activityCount = existing.activityCount + 1 };
      };
      case null {
        { name = profile.name; joinDate = Time.now(); activityCount = 1 };
      };
    };
    userProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getMemberStats() : async ?{ joinDate : Time.Time; activityCount : Nat } {
    enforceMember(caller);
    switch (userProfiles.get(caller)) {
      case (?profile) { ?{ joinDate = profile.joinDate; activityCount = profile.activityCount } };
      case null { null };
    };
  };

  public query ({ caller }) func listAllUsers() : async [(Principal, UserProfile)] {
    enforceAdmin(caller);
    userProfiles.entries().toArray();
  };

  public query func getSiteSettings() : async SiteSettings {
    siteSettings;
  };

  public shared ({ caller }) func updateSiteSettings(newSettings : SiteSettings) : async () {
    enforceAdmin(caller);
    siteSettings := newSettings;
  };
};
