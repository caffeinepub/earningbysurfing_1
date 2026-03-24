import Float "mo:core/Float";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";

import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Time "mo:core/Time";
import OutCall "http-outcalls/outcall";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Data migration at upgrade

actor {
  type Category = {
    #tech;
    #lifestyle;
    #wellness;
    #books;
    #shoesAndClothes;
    #technology;
    #toys;
  };

  public type PageSlug = {
    #about;
    #contact;
    #terms;
    #privacy;
  };

  public type PageContent = {
    title : Text;
    content : Text;
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
    clickbankApiKey : Text;
    clickbankClerkId : Text;
    amazonAccessKey : Text;
    amazonSecretKey : Text;
    amazonAssociateTag : Text;
  };

  public type InventoryProduct = {
    id : Nat;
    name : Text;
    price : Float;
    category : Text;
    affiliateLink : Text;
  };

  type ProductId = Nat;

  type VendorRequest = {
    id : Nat;
    vendorName : Text;
    businessName : Text;
    productName : Text;
    category : Text;
    description : Text;
    price : Float;
    websiteLink : Text;
    contactEmail : Text;
    status : Text; // "pending", "approved", "rejected"
    submittedAt : Time.Time;
  };

  type Order = {
    id : Nat;
    productName : Text;
    memberIndex : Nat;
    assignedMemberId : Text;
    timestamp : Time.Time;
  };

  let seedProducts : [Product] = [
    {
      title = "Sony WH-1000XM5 Noise-Cancelling Headphones";
      description = "Industry-leading noise cancellation with 30-hour battery life.";
      category = #tech;
      imageUrl = "";
      featured = true;
      aiReview = "Top-tier affiliate pick with consistent high conversions.";
      qualityScore = 97;
    },
    {
      title = "Apple AirTag 4-Pack Tracker";
      description = "Precision finding with ultra-wideband technology.";
      category = #tech;
      imageUrl = "";
      featured = true;
      aiReview = "Dominates item-tracking category with seamless iOS integration.";
      qualityScore = 94;
    },
    {
      title = "Anker 737 Power Bank 24000mAh";
      description = "65W fast charging for laptops, phones, and tablets.";
      category = #tech;
      imageUrl = "";
      featured = false;
      aiReview = "Proven high-conversion affiliate product.";
      qualityScore = 92;
    },
    {
      title = "Logitech MX Master 3S Wireless Mouse";
      description = "Ergonomic precision mouse with ultra-fast MagSpeed scrolling.";
      category = #tech;
      imageUrl = "";
      featured = false;
      aiReview = "Excellent affiliate commission potential.";
      qualityScore = 95;
    },
    {
      title = "YETI Rambler 30 oz Travel Tumbler";
      description = "Double-wall vacuum insulation. Gold standard in premium drinkware.";
      category = #lifestyle;
      imageUrl = "";
      featured = true;
      aiReview = "Strong customer satisfaction and low return rates.";
      qualityScore = 96;
    },
    {
      title = "Kindle Paperwhite 16GB E-Reader";
      description = "Waterproof, glare-free display with 3-month battery life.";
      category = #lifestyle;
      imageUrl = "";
      featured = true;
      aiReview = "Perennial bestseller with outstanding affiliate commission history.";
      qualityScore = 93;
    },
    {
      title = "Nespresso Vertuo Next Coffee Machine";
      description = "One-touch brewing with barcode-reading technology.";
      category = #lifestyle;
      imageUrl = "";
      featured = false;
      aiReview = "Top lifestyle affiliate pick with subscription upsell potential.";
      qualityScore = 90;
    },
    {
      title = "Osprey Farpoint 40 Travel Backpack";
      description = "Carry-on compliant travel pack with integrated suspension.";
      category = #lifestyle;
      imageUrl = "";
      featured = false;
      aiReview = "Consistent 4.8-star ratings and strong community endorsements.";
      qualityScore = 91;
    },
    {
      title = "Theragun Prime Percussive Therapy Device";
      description = "Professional-grade muscle treatment with 5 attachments.";
      category = #wellness;
      imageUrl = "";
      featured = true;
      aiReview = "Elite affiliate product with high average order value.";
      qualityScore = 98;
    },
    {
      title = "Fitbit Charge 6 Advanced Fitness Tracker";
      description = "Built-in GPS, heart rate monitoring, and Google integration.";
      category = #wellness;
      imageUrl = "";
      featured = true;
      aiReview = "Reliable affiliate product with strong brand recognition.";
      qualityScore = 89;
    },
    {
      title = "Manduka PRO Yoga Mat 6mm";
      description = "Lifetime guarantee yoga mat with non-slip grip.";
      category = #wellness;
      imageUrl = "";
      featured = false;
      aiReview = "Excellent for wellness-focused affiliate campaigns.";
      qualityScore = 88;
    },
    {
      title = "Hydro Flask 32 oz Wide Mouth Water Bottle";
      description = "TempShield insulation. Keeps cold 24hrs, hot 12hrs. BPA-free.";
      category = #wellness;
      imageUrl = "";
      featured = false;
      aiReview = "Outstanding organic affiliate reach in wellness communities.";
      qualityScore = 93;
    }
  ];

  let seedInventory : [(Text, Float, Text, Text)] = [
    // Tech (40 products)
    ("Samsung 65\" 4K QLED Smart TV", 1299.99, "Tech", "https://www.amazon.com/s?k=Samsung+65+4K+QLED+Smart+TV"),
    ("Apple MacBook Air M3 13-inch", 1099.00, "Tech", "https://www.amazon.com/s?k=Apple+MacBook+Air+M3"),
    ("Sony WH-1000XM5 Headphones", 279.99, "Tech", "https://www.amazon.com/s?k=Sony+WH-1000XM5"),
    ("Anker 737 Power Bank 24000mAh", 85.99, "Tech", "https://www.amazon.com/s?k=Anker+737+Power+Bank"),
    ("Logitech MX Master 3S Mouse", 99.99, "Tech", "https://www.amazon.com/s?k=Logitech+MX+Master+3S"),
    ("Apple AirTag 4-Pack", 99.00, "Tech", "https://www.amazon.com/s?k=Apple+AirTag+4+Pack"),
    ("Bose QuietComfort 45 Headphones", 229.00, "Tech", "https://www.amazon.com/s?k=Bose+QuietComfort+45"),
    ("DJI Mini 4 Pro Drone", 759.00, "Tech", "https://www.amazon.com/s?k=DJI+Mini+4+Pro"),
    ("GoPro HERO12 Black", 349.99, "Tech", "https://www.amazon.com/s?k=GoPro+HERO12+Black"),
    ("iPad Pro 12.9-inch M2", 1099.00, "Tech", "https://www.amazon.com/s?k=iPad+Pro+12.9+M2"),
    ("Garmin Fenix 7 Pro GPS Watch", 799.99, "Tech", "https://www.amazon.com/s?k=Garmin+Fenix+7+Pro"),
    ("Sony PlayStation 5 Console", 499.99, "Tech", "https://www.amazon.com/s?k=Sony+PlayStation+5"),
    ("Meta Quest 3 VR Headset", 499.99, "Tech", "https://www.amazon.com/s?k=Meta+Quest+3"),
    ("ASUS ROG Zephyrus G14 Laptop", 1449.99, "Tech", "https://www.amazon.com/s?k=ASUS+ROG+Zephyrus+G14"),
    ("Ring Video Doorbell Pro 2", 249.99, "Tech", "https://www.amazon.com/s?k=Ring+Video+Doorbell+Pro+2"),
    ("Anker USB-C Hub 10-in-1", 45.99, "Tech", "https://www.amazon.com/s?k=Anker+USB-C+Hub+10-in-1"),
    ("Razer BlackWidow V3 Keyboard", 129.99, "Tech", "https://www.amazon.com/s?k=Razer+BlackWidow+V3"),
    ("LG 27\" 4K UHD Monitor", 449.99, "Tech", "https://www.amazon.com/s?k=LG+27+4K+UHD+Monitor"),
    ("Kindle Paperwhite 16GB", 139.99, "Tech", "https://www.amazon.com/s?k=Kindle+Paperwhite+16GB"),
    ("Google Pixel 8 Pro Smartphone", 899.00, "Tech", "https://www.amazon.com/s?k=Google+Pixel+8+Pro"),
    ("Philips Hue Starter Kit", 179.99, "Tech", "https://www.amazon.com/s?k=Philips+Hue+Starter+Kit"),
    ("Dyson V15 Detect Vacuum", 749.99, "Tech", "https://www.amazon.com/s?k=Dyson+V15+Detect"),
    ("iRobot Roomba i7+ Robot Vacuum", 599.99, "Tech", "https://www.amazon.com/s?k=iRobot+Roomba+i7+Plus"),
    ("Nest Learning Thermostat 4th Gen", 279.99, "Tech", "https://www.amazon.com/s?k=Nest+Learning+Thermostat"),
    ("TP-Link Archer AXE75 Wi-Fi 6E", 199.99, "Tech", "https://www.amazon.com/s?k=TP-Link+Archer+AXE75"),
    ("JBL Charge 5 Portable Speaker", 149.95, "Tech", "https://www.amazon.com/s?k=JBL+Charge+5"),
    ("Fujifilm Instax Mini 12 Camera", 79.99, "Tech", "https://www.amazon.com/s?k=Fujifilm+Instax+Mini+12"),
    ("Xbox Series X Console", 499.99, "Tech", "https://www.amazon.com/s?k=Xbox+Series+X"),
    ("Elgato Stream Deck MK.2", 149.99, "Tech", "https://www.amazon.com/s?k=Elgato+Stream+Deck+MK2"),
    ("Corsair K100 RGB Keyboard", 229.99, "Tech", "https://www.amazon.com/s?k=Corsair+K100+RGB+Keyboard"),
    ("SteelSeries Arctis Nova Pro Headset", 249.99, "Tech", "https://www.amazon.com/s?k=SteelSeries+Arctis+Nova+Pro"),
    ("Arlo Pro 4 Security Camera 4-Pack", 349.99, "Tech", "https://www.amazon.com/s?k=Arlo+Pro+4+Security+Camera"),
    ("Western Digital 4TB External HDD", 89.99, "Tech", "https://www.amazon.com/s?k=Western+Digital+4TB+External"),
    ("Samsung T7 2TB Portable SSD", 129.99, "Tech", "https://www.amazon.com/s?k=Samsung+T7+2TB+SSD"),
    ("Amazfit GTR 4 Smart Watch", 199.99, "Tech", "https://www.amazon.com/s?k=Amazfit+GTR+4"),
    ("Tile Mate 4-Pack Bluetooth Tracker", 59.99, "Tech", "https://www.amazon.com/s?k=Tile+Mate+4+Pack"),
    ("Eufy RoboVac 11S Max", 219.99, "Tech", "https://www.amazon.com/s?k=Eufy+RoboVac+11S+Max"),
    ("Belkin MagSafe 3-in-1 Charger", 99.99, "Tech", "https://www.amazon.com/s?k=Belkin+MagSafe+3-in-1"),
    ("Anker Soundcore Motion X600", 99.99, "Tech", "https://www.amazon.com/s?k=Anker+Soundcore+Motion+X600"),
    ("Wacom Intuos Pro Medium Tablet", 349.95, "Tech", "https://www.amazon.com/s?k=Wacom+Intuos+Pro+Medium"),
    // Lifestyle (30 products)
    ("YETI Rambler 30 oz Tumbler", 34.99, "Lifestyle", "https://www.amazon.com/s?k=YETI+Rambler+30+oz"),
    ("Osprey Farpoint 40 Backpack", 160.00, "Lifestyle", "https://www.amazon.com/s?k=Osprey+Farpoint+40"),
    ("Nespresso Vertuo Next Coffee Machine", 179.00, "Lifestyle", "https://www.amazon.com/s?k=Nespresso+Vertuo+Next"),
    ("Moleskine Classic Notebook Large", 22.99, "Lifestyle", "https://www.amazon.com/s?k=Moleskine+Classic+Notebook+Large"),
    ("Levi's 501 Original Jeans", 69.50, "Lifestyle", "https://www.amazon.com/s?k=Levis+501+Original+Jeans"),
    ("Beats Studio Pro Wireless Headphones", 349.95, "Lifestyle", "https://www.amazon.com/s?k=Beats+Studio+Pro"),
    ("Peak Design Everyday Backpack 20L", 279.95, "Lifestyle", "https://www.amazon.com/s?k=Peak+Design+Everyday+Backpack"),
    ("Ember Temperature Control Mug 2", 99.95, "Lifestyle", "https://www.amazon.com/s?k=Ember+Temperature+Control+Mug+2"),
    ("Le Creuset Dutch Oven 5.5 Qt", 399.95, "Lifestyle", "https://www.amazon.com/s?k=Le+Creuset+Dutch+Oven"),
    ("Patagonia Nano Puff Jacket", 229.00, "Lifestyle", "https://www.amazon.com/s?k=Patagonia+Nano+Puff+Jacket"),
    ("KitchenAid Stand Mixer 5 Qt", 449.99, "Lifestyle", "https://www.amazon.com/s?k=KitchenAid+Stand+Mixer"),
    ("Instant Pot Duo 7-in-1 6 Qt", 89.95, "Lifestyle", "https://www.amazon.com/s?k=Instant+Pot+Duo+7-in-1"),
    ("Cuisinart Air Fryer Toaster Oven", 229.95, "Lifestyle", "https://www.amazon.com/s?k=Cuisinart+Air+Fryer+Toaster+Oven"),
    ("Ninja Creami Ice Cream Maker", 179.99, "Lifestyle", "https://www.amazon.com/s?k=Ninja+Creami+Ice+Cream+Maker"),
    ("Vitamix 5200 Blender", 449.95, "Lifestyle", "https://www.amazon.com/s?k=Vitamix+5200+Blender"),
    ("Nike Air Max 270 Sneakers", 150.00, "Lifestyle", "https://www.amazon.com/s?k=Nike+Air+Max+270"),
    ("Ray-Ban Classic Aviator Sunglasses", 161.00, "Lifestyle", "https://www.amazon.com/s?k=Ray-Ban+Classic+Aviator"),
    ("Rimowa Essential Cabin Suitcase", 725.00, "Lifestyle", "https://www.amazon.com/s?k=Rimowa+Essential+Cabin"),
    ("S'well Stainless Steel Bottle 17 oz", 35.00, "Lifestyle", "https://www.amazon.com/s?k=Swell+Stainless+Steel+Bottle"),
    ("Caudalie Beauty Elixir Face Mist", 49.00, "Lifestyle", "https://www.amazon.com/s?k=Caudalie+Beauty+Elixir"),
    ("Barefoot Dreams CozyChic Throw Blanket", 120.00, "Lifestyle", "https://www.amazon.com/s?k=Barefoot+Dreams+CozyChic+Throw"),
    ("Diptyque Baies Scented Candle", 75.00, "Lifestyle", "https://www.amazon.com/s?k=Diptyque+Baies+Candle"),
    ("Braun Series 9 Pro Electric Shaver", 329.99, "Lifestyle", "https://www.amazon.com/s?k=Braun+Series+9+Pro"),
    ("Dyson Airwrap Complete Styler", 599.99, "Lifestyle", "https://www.amazon.com/s?k=Dyson+Airwrap+Complete"),
    ("OXO Good Grips 20-Piece Storage Set", 79.99, "Lifestyle", "https://www.amazon.com/s?k=OXO+Good+Grips+Storage+Set"),
    ("Cuisinart 12-Cup Coffee Maker", 89.95, "Lifestyle", "https://www.amazon.com/s?k=Cuisinart+12+Cup+Coffee+Maker"),
    ("Weber Spirit II E-310 Gas Grill", 549.00, "Lifestyle", "https://www.amazon.com/s?k=Weber+Spirit+II+E-310"),
    ("Pendleton Wool Throw Blanket", 129.00, "Lifestyle", "https://www.amazon.com/s?k=Pendleton+Wool+Throw+Blanket"),
    ("All-Clad D3 Stainless Cookware Set 10-Piece", 699.95, "Lifestyle", "https://www.amazon.com/s?k=All-Clad+D3+Cookware+Set"),
    ("Zulay Kitchen Milk Frother", 19.99, "Lifestyle", "https://www.amazon.com/s?k=Zulay+Kitchen+Milk+Frother"),
    // Wellness (30 products)
    ("Theragun Prime Therapy Device", 299.00, "Wellness", "https://www.amazon.com/s?k=Theragun+Prime"),
    ("Fitbit Charge 6 Fitness Tracker", 159.95, "Wellness", "https://www.amazon.com/s?k=Fitbit+Charge+6"),
    ("Manduka PRO Yoga Mat 6mm", 120.00, "Wellness", "https://www.amazon.com/s?k=Manduka+PRO+Yoga+Mat"),
    ("Hydro Flask 32 oz Water Bottle", 44.95, "Wellness", "https://www.amazon.com/s?k=Hydro+Flask+32+oz"),
    ("Withings Body+ Smart Scale", 99.95, "Wellness", "https://www.amazon.com/s?k=Withings+Body+Plus+Smart+Scale"),
    ("Oura Ring Gen 3 Health Tracker", 299.00, "Wellness", "https://www.amazon.com/s?k=Oura+Ring+Gen+3"),
    ("NordicTrack T 6.5 S Treadmill", 999.00, "Wellness", "https://www.amazon.com/s?k=NordicTrack+T+6.5+S+Treadmill"),
    ("Bowflex SelectTech 552 Dumbbells", 399.00, "Wellness", "https://www.amazon.com/s?k=Bowflex+SelectTech+552"),
    ("TRX All-in-One Suspension Trainer", 169.95, "Wellness", "https://www.amazon.com/s?k=TRX+All-in-One+Suspension+Trainer"),
    ("Garmin Venu 3 GPS Smartwatch", 449.99, "Wellness", "https://www.amazon.com/s?k=Garmin+Venu+3"),
    ("Therabody RecoveryAir JetBoots", 749.00, "Wellness", "https://www.amazon.com/s?k=Therabody+RecoveryAir+JetBoots"),
    ("Onnit Alpha Brain Nootropic", 79.95, "Wellness", "https://www.amazon.com/s?k=Onnit+Alpha+Brain"),
    ("Garden of Life Raw Organic Protein", 49.95, "Wellness", "https://www.amazon.com/s?k=Garden+of+Life+Raw+Protein"),
    ("Nutribullet Pro 900 Blender", 89.99, "Wellness", "https://www.amazon.com/s?k=Nutribullet+Pro+900"),
    ("Calm Premium Meditation App (1yr)", 69.99, "Wellness", "https://www.amazon.com/s?k=Calm+Premium+Subscription"),
    ("Peloton Guide Strength Trainer", 295.00, "Wellness", "https://www.amazon.com/s?k=Peloton+Guide"),
    ("Casper Original Foam Pillow", 65.00, "Wellness", "https://www.amazon.com/s?k=Casper+Original+Foam+Pillow"),
    ("Manta Sleep Mask", 35.00, "Wellness", "https://www.amazon.com/s?k=Manta+Sleep+Mask"),
    ("Eight Sleep Pod 3 Cover", 2295.00, "Wellness", "https://www.amazon.com/s?k=Eight+Sleep+Pod+3"),
    ("Goli Apple Cider Vinegar Gummies", 19.99, "Wellness", "https://www.amazon.com/s?k=Goli+Apple+Cider+Vinegar+Gummies"),
    ("Vital Proteins Collagen Peptides", 43.00, "Wellness", "https://www.amazon.com/s?k=Vital+Proteins+Collagen+Peptides"),
    ("Lululemon Align High-Rise Leggings", 98.00, "Wellness", "https://www.amazon.com/s?k=Lululemon+Align+Leggings"),
    ("Gaiam Premium Yoga Block Set", 22.98, "Wellness", "https://www.amazon.com/s?k=Gaiam+Premium+Yoga+Block"),
    ("Hyperice Normatec 3 Leg System", 699.00, "Wellness", "https://www.amazon.com/s?k=Hyperice+Normatec+3+Leg"),
    ("Acupressure Mat and Pillow Set", 39.99, "Wellness", "https://www.amazon.com/s?k=Acupressure+Mat+Pillow+Set"),
    ("Sunlighten mPulse Believe Sauna", 4999.00, "Wellness", "https://www.amazon.com/s?k=Sunlighten+Infrared+Sauna"),
    ("Pranamat ECO Massage Mat", 149.00, "Wellness", "https://www.amazon.com/s?k=Pranamat+ECO+Massage+Mat"),
    ("Ancient Nutrition Multi Collagen", 49.95, "Wellness", "https://www.amazon.com/s?k=Ancient+Nutrition+Multi+Collagen"),
    ("Meross Smart Plug Mini 4-Pack", 25.99, "Wellness", "https://www.amazon.com/s?k=Meross+Smart+Plug+Mini"),
    ("RENPHO Eye Massager with Heat", 49.99, "Wellness", "https://www.amazon.com/s?k=RENPHO+Eye+Massager")
  ];

  let blockedCountries = Set.fromArray(["PK"]);

  type AffiliateConfigStatus = {
    clickbankConfigured : Bool;
    amazonConfigured : Bool;
  };

  let autoPostCategories = List.empty<Text>();
  let liveVisitors = Map.empty<Principal, Time.Time>();
  let products = Map.empty<Nat, Product>();
  let inventoryProducts = Map.empty<Nat, InventoryProduct>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let vendorRequests = Map.empty<Nat, VendorRequest>();
  let orders = Map.empty<Nat, Order>();
  let pageContents = Map.empty<Text, PageContent>();

  // State
  var visitorCount : Nat = 0;
  var liveVisitorCount : Nat = 0;
  var nextProductId = 1;
  var nextInventoryProductId = 1;
  var nextVendorRequestId = 1;
  var nextOrderId = 1;
  var roundRobinIndex = 1;
  var siteSettings : SiteSettings = {
    siteTitle = "EarningBySurfing";
    announcementText = "Welcome to EarningBySurfing — your AI-powered affiliate platform!";
    clickbankApiKey = "";
    clickbankClerkId = "";
    amazonAccessKey = "";
    amazonSecretKey = "";
    amazonAssociateTag = "";
  };
  let visitorTimeout : Int = 1_000_000_000 * 60 * 10;

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  func initProducts() {
    if (products.size() == 0) {
      for (p in seedProducts.vals()) {
        products.add(nextProductId, p);
        nextProductId += 1;
      };
    };
  };

  func initInventory() {
    if (inventoryProducts.size() == 0) {
      for ((name, price, category, affiliateLink) in seedInventory.vals()) {
        let id = nextInventoryProductId;
        inventoryProducts.add(id, { id; name; price; category; affiliateLink });
        nextInventoryProductId += 1;
      };
    };
  };

  func initPageContents() {
    if (pageContents.size() == 0) {
      pageContents.add("about", {
        title = "About EarningBySurfing";
        content = "Earning by surfing is a decentralized platform on the Internet Computer (ICP) designed to help users earn cryptocurrency rewards by viewing and interacting with online content. Our mission is to create a fair and transparent ecosystem where both advertisers and users benefit, ensuring that your attention is valued and rewarded.";
      });

      pageContents.add("contact", {
        title = "Contact";
        content = "If you have any questions, feedback, or need support, please reach out to us at [support@earningbysurfing.com].";
      });

      pageContents.add("terms", {
        title = "Terms & Conditions";
        content = "By using this platform, you agree to comply with our terms and conditions, which outline the rules and guidelines for participating in the earning by surfing ecosystem.";
      });

      pageContents.add("privacy", {
        title = "Privacy Policy";
        content = "We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information while you use our platform.";
      });
    };
  };

  initProducts();
  initInventory();
  initPageContents();

  func updateLiveVisitors() {
    let currentTime = Time.now();
    let expiredThreshold = currentTime - visitorTimeout : Time.Time;
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

  // Pages/CMS Functionality
  public query func getPageContent(slug : Text) : async ?PageContent {
    pageContents.get(slug);
  };

  public query func getAllPageContents() : async [(Text, PageContent)] {
    pageContents.entries().toArray();
  };

  public shared ({ caller }) func setPageContent(slug : Text, content : PageContent) : async () {
    enforceAdmin(caller);
    if (not pageContents.containsKey(slug)) {
      Runtime.trap("Page does not exist. You can only update existing CMS pages" # slug);
    };
    pageContents.add(slug, content);
  };

  // Product CRUD Operations (Admin only)
  public shared ({ caller }) func createProduct(originalProduct : Product) : async ProductId {
    enforceAdmin(caller);
    let productId = nextProductId;
    products.add(productId, originalProduct);
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

  // InventoryProduct CRUD (Admin Only)
  public shared ({ caller }) func addInventoryProduct(name : Text, price : Float, category : Text, affiliateLink : Text) : async Nat {
    enforceAdmin(caller);
    let id = nextInventoryProductId;
    let newProduct : InventoryProduct = {
      id;
      name;
      price;
      category;
      affiliateLink;
    };
    inventoryProducts.add(id, newProduct);
    nextInventoryProductId += 1;
    id;
  };

  public shared ({ caller }) func updateInventoryProduct(id : Nat, name : Text, price : Float, category : Text, affiliateLink : Text) : async () {
    enforceAdmin(caller);
    if (inventoryProducts.containsKey(id)) {
      let updatedProduct : InventoryProduct = {
        id;
        name;
        price;
        category;
        affiliateLink;
      };
      inventoryProducts.add(id, updatedProduct);
    } else {
      Runtime.trap("Inventory product not found");
    };
  };

  public shared ({ caller }) func deleteInventoryProduct(id : Nat) : async () {
    enforceAdmin(caller);
    inventoryProducts.remove(id);
  };

  public query func getAllInventoryProducts() : async [(Nat, InventoryProduct)] {
    inventoryProducts.toArray();
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
      case (null) {
        { name = profile.name; joinDate = Time.now(); activityCount = 1 };
      };
    };
    userProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getMemberStats() : async ?{ joinDate : Time.Time; activityCount : Nat } {
    enforceMember(caller);
    switch (userProfiles.get(caller)) {
      case (?profile) { ?{ joinDate = profile.joinDate; activityCount = profile.activityCount } };
      case (null) { null };
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

  // Category Autosave Functions
  public query func getAutoPostCategories() : async [Text] {
    autoPostCategories.toArray();
  };

  public shared ({ caller }) func addAutoPostCategory(category : Text) : async () {
    enforceAdmin(caller);
    if (autoPostCategories.any(func(c) { c == category })) {
      Runtime.trap("Category already exists in auto-post list");
    };
    autoPostCategories.add(category);
  };

  public shared ({ caller }) func removeAutoPostCategory(category : Text) : async () {
    enforceAdmin(caller);

    let initialSize = autoPostCategories.size();

    // Remove category using persistent List's in-place filter
    let filteredList = autoPostCategories.filter(
      func(cat) { cat != category }
    );
    autoPostCategories.clear();
    autoPostCategories.addAll(filteredList.values());

    // Check if category was found and removed
    if (autoPostCategories.size() == initialSize) {
      Runtime.trap("Category not found in auto-post list");
    };
  };

  public query func isCategoryAutoPosted(category : Text) : async Bool {
    autoPostCategories.any(func(c) { c == category });
  };

  // Vendor Requests
  public shared ({ caller }) func submitVendorRequest(newRequest : VendorRequest) : async Nat {
    let id = nextVendorRequestId;
    let request : VendorRequest = {
      id;
      vendorName = newRequest.vendorName;
      businessName = newRequest.businessName;
      productName = newRequest.productName;
      category = newRequest.category;
      description = newRequest.description;
      price = newRequest.price;
      websiteLink = newRequest.websiteLink;
      contactEmail = newRequest.contactEmail;
      status = "pending";
      submittedAt = Time.now();
    };
    vendorRequests.add(id, request);
    nextVendorRequestId += 1;
    id;
  };

  public query ({ caller }) func getVendorRequests() : async [(Nat, VendorRequest)] {
    enforceAdmin(caller);
    vendorRequests.entries().toArray();
  };

  public shared ({ caller }) func updateVendorRequestStatus(id : Nat, status : Text) : async () {
    enforceAdmin(caller);
    if (vendorRequests.containsKey(id)) {
      let request = vendorRequests.get(id);
      switch (request) {
        case (null) {
          Runtime.trap("Vendor request not found for id " # id.toText());
        };
        case (?request) {
          let updatedRequest = { request with status };
          vendorRequests.add(id, updatedRequest);
        };
      };
    };
  };

  // Orders
  public shared ({ caller }) func submitOrder(productName : Text, totalMembers : Nat) : async Nat {
    if (totalMembers == 0) {
      Runtime.trap("No members available on platform");
    };

    let memberIndex = roundRobinIndex % totalMembers; // Start from 0

    let id = nextOrderId;

    let order : Order = {
      id;
      productName;
      memberIndex;
      assignedMemberId = memberIndex.toText();
      timestamp = Time.now();
    };
    orders.add(id, order);

    nextOrderId += 1;
    roundRobinIndex += 1; // Always increment
    memberIndex; // Return the assigned member index
  };

  public query ({ caller }) func getOrders() : async [(Nat, Order)] {
    enforceAdmin(caller);
    orders.entries().toArray();
  };

  public query ({ caller }) func getRoundRobinIndex() : async Nat {
    enforceAdmin(caller);
    roundRobinIndex; // Return 1-based index
  };

  public shared ({ caller }) func resetRoundRobinIndex() : async () {
    enforceAdmin(caller);
    roundRobinIndex := 1;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Affiliate Platform Features

  // Fetch raw ClickBank products JSON using stored credentials (admin only for security)
  public shared ({ caller }) func fetchClickbankProducts(searchQuery : Text) : async Text {
    enforceAdmin(caller);
    if (siteSettings.clickbankApiKey == "" or siteSettings.clickbankClerkId == "") {
      return "API_NOT_CONFIGURED";
    };

    let clickbankUrl = "https://api.clickbank.com/rest/1.3/products/list?site=&keywords=" # searchQuery;
    //let clickbankUrl = "https://rest.api.clickbank.com/rest/1.3/products/list?site=&keywords=" # query; // legacy url fallback

    let authHeaderValue = "CBU username=" # siteSettings.clickbankClerkId # ", CBT apikey=" # siteSettings.clickbankApiKey;

    let headers = [
      {
        name = "Authorization";
        value = authHeaderValue;
      },
      {
        name = "Content-Type";
        value = "application/json";
      },
    ];

    await OutCall.httpGetRequest(clickbankUrl, headers, transform);
  };

  // Check if a country is blocked
  public query ({ caller }) func checkCountryAccess(countryCode : Text) : async Bool {
    not blockedCountries.contains(countryCode.toUpper());
  };

  // Get list of blocked countries (admin only)
  public query ({ caller }) func getBlockedCountries() : async [Text] {
    enforceAdmin(caller);
    blockedCountries.toArray();
  };

  // Update list of blocked countries (admin only)
  public shared ({ caller }) func updateBlockedCountries(newCountries : [Text]) : async () {
    enforceAdmin(caller);
    blockedCountries.clear();
    blockedCountries.addAll(newCountries.map(func(c) { c.toUpper() }).values());
  };

  // Get affiliate config status (admin)
  public query ({ caller }) func getAffiliateConfigStatus() : async AffiliateConfigStatus {
    enforceAdmin(caller);
    {
      clickbankConfigured = siteSettings.clickbankApiKey != "" and siteSettings.clickbankClerkId != "";
      amazonConfigured = siteSettings.amazonAccessKey != "" and siteSettings.amazonSecretKey != "" and siteSettings.amazonAssociateTag != "";
    };
  };
};

