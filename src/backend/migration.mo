import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldCategory = {
    #books;
    #shoesAndClothes;
    #technology;
    #toys;
  };

  type NewCategory = {
    #tech;
    #lifestyle;
    #wellness;
    #books;
    #shoesAndClothes;
    #technology;
    #toys;
  };

  type OldProduct = {
    title : Text;
    description : Text;
    category : OldCategory;
    imageUrl : Text;
    featured : Bool;
  };

  type NewProduct = {
    title : Text;
    description : Text;
    category : NewCategory;
    imageUrl : Text;
    featured : Bool;
    aiReview : Text;
    qualityScore : Nat;
  };

  type UserProfile = {
    name : Text;
    joinDate : Time.Time;
    activityCount : Nat;
  };

  type SiteSettings = {
    siteTitle : Text;
    announcementText : Text;
  };

  type OldActor = {
    visitorCount : Nat;
    liveVisitorCount : Nat;
    products : Map.Map<Nat, OldProduct>;
    nextProductId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    siteSettings : SiteSettings;
  };

  type NewActor = {
    visitorCount : Nat;
    liveVisitorCount : Nat;
    products : Map.Map<Nat, NewProduct>;
    nextProductId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    siteSettings : SiteSettings;
  };

  func migrateCategory(old : OldCategory) : NewCategory {
    switch (old) {
      case (#books) { #books };
      case (#shoesAndClothes) { #shoesAndClothes };
      case (#technology) { #technology };
      case (#toys) { #toys };
    };
  };

  func migrateProduct(old : OldProduct) : NewProduct {
    {
      old with
      category = migrateCategory(old.category);
      aiReview = "";
      qualityScore = 100;
    };
  };

  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Nat, OldProduct, NewProduct>(
      func(_id, oldProduct) {
        migrateProduct(oldProduct);
      }
    );
    {
      old with
      products = newProducts;
    };
  };
};
