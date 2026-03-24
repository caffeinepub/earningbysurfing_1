import Set "mo:core/Set";
import Text "mo:core/Text";

module {
  type OldSiteSettings = {
    siteTitle : Text;
    announcementText : Text;
  };

  type OldActor = {
    siteSettings : OldSiteSettings;
  };

  type NewSiteSettings = {
    siteTitle : Text;
    announcementText : Text;
    clickbankApiKey : Text;
    clickbankClerkId : Text;
    amazonAccessKey : Text;
    amazonSecretKey : Text;
    amazonAssociateTag : Text;
  };

  type NewActor = {
    siteSettings : NewSiteSettings;
    blockedCountries : Set.Set<Text>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      siteSettings = {
        old.siteSettings with
        clickbankApiKey = "";
        clickbankClerkId = "";
        amazonAccessKey = "";
        amazonSecretKey = "";
        amazonAssociateTag = "";
      };
      blockedCountries = Set.fromArray<Text>(["PK"]);
    };
  };
};
