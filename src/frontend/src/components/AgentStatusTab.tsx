import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Database,
  Loader2,
  Radio,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface LeadResult {
  id: number;
  name: string;
  niche: string;
  commission: string;
  gravity: number;
  scannedAt: string;
}

interface AgentLogEntry {
  id: string;
  message: string;
  timestamp: string;
  type: "scan" | "sync" | "status" | "error";
}

const SIMULATED_LEADS: Omit<LeadResult, "id" | "scannedAt">[] = [
  {
    name: "ClickBank University Affiliates",
    niche: "Digital Marketing",
    commission: "75%",
    gravity: 142,
  },
  {
    name: "Dropship Lifestyle Network",
    niche: "E-Commerce / Dropshipping",
    commission: "50%",
    gravity: 98,
  },
  {
    name: "Amazon FBA Masters",
    niche: "Product Sourcing",
    commission: "40%",
    gravity: 87,
  },
  {
    name: "Wealthy Affiliate Partners",
    niche: "Affiliate Marketing",
    commission: "60%",
    gravity: 134,
  },
  {
    name: "ShopifyDropship Pro Group",
    niche: "Dropshipping / Shopify",
    commission: "45%",
    gravity: 76,
  },
  {
    name: "Commission Hero Network",
    niche: "Paid Ads & Affiliate",
    commission: "65%",
    gravity: 110,
  },
  {
    name: "Digital Nomad Sellers",
    niche: "Online Business",
    commission: "55%",
    gravity: 91,
  },
  {
    name: "Global eCommerce Insiders",
    niche: "International Dropship",
    commission: "35%",
    gravity: 68,
  },
  {
    name: "Passive Income Affiliates",
    niche: "Passive Income / Blogging",
    commission: "70%",
    gravity: 128,
  },
  {
    name: "ClickFunnels Affiliates Hub",
    niche: "Sales Funnels / SaaS",
    commission: "40%",
    gravity: 85,
  },
  {
    name: "AliExpress Dropship Masters",
    niche: "AliExpress / Dropship",
    commission: "30%",
    gravity: 62,
  },
  {
    name: "High Ticket Closers Network",
    niche: "High-Ticket Sales",
    commission: "80%",
    gravity: 155,
  },
  {
    name: "Social Media Marketing Pros",
    niche: "SMM / Instagram",
    commission: "50%",
    gravity: 103,
  },
  {
    name: "Email Marketing Elite Club",
    niche: "Email / List Building",
    commission: "60%",
    gravity: 119,
  },
  {
    name: "YouTube Affiliate Goldmine",
    niche: "Video Marketing",
    commission: "45%",
    gravity: 79,
  },
];

function getStoredLeads(): LeadResult[] {
  try {
    const raw = localStorage.getItem("ebs_lead_scan_results");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getStoredLog(): AgentLogEntry[] {
  try {
    const raw = localStorage.getItem("ebs_agent_log");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function appendLog(message: string, type: AgentLogEntry["type"]) {
  const existing = getStoredLog();
  const entry: AgentLogEntry = {
    id: Date.now().toString(),
    message,
    timestamp: new Date().toLocaleString(),
    type,
  };
  const updated = [entry, ...existing].slice(0, 50);
  localStorage.setItem("ebs_agent_log", JSON.stringify(updated));
  return updated;
}

function getMemberCount(): number {
  try {
    const raw = localStorage.getItem("ebs_members");
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.length : 0;
    }
    return 4000;
  } catch {
    return 4000;
  }
}

function getMemberSource(): string {
  try {
    const raw = localStorage.getItem("ebs_members");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0]?.source === "csv" ? "CSV Upload" : "Seed Data";
      }
    }
    return "Seed Data";
  } catch {
    return "Seed Data";
  }
}

function hasClickbankKeys(): boolean {
  try {
    const raw = localStorage.getItem("ebs_settings");
    if (raw) {
      const s = JSON.parse(raw);
      return !!(s.clickbankApiKey && s.clickbankClerkId);
    }
    return false;
  } catch {
    return false;
  }
}

interface AgentStatusTabProps {
  onNavigateToSettings?: () => void;
}

export default function AgentStatusTab({
  onNavigateToSettings,
}: AgentStatusTabProps) {
  const [leads, setLeads] = useState<LeadResult[]>(getStoredLeads);
  const [isScanning, setIsScanning] = useState(false);
  const [memberCount, setMemberCount] = useState(getMemberCount);
  const [memberSource, setMemberSource] = useState(getMemberSource);
  const [cbKeysActive, setCbKeysActive] = useState(hasClickbankKeys);
  const [log, setLog] = useState<AgentLogEntry[]>(getStoredLog);

  useEffect(() => {
    const updated = appendLog("Agent Status Dashboard opened", "status");
    setLog(updated);
  }, []);

  const handleScanLeads = async () => {
    setIsScanning(true);
    const startLog = appendLog(
      "Marketing Agent: Lead scan initiated...",
      "scan",
    );
    setLog(startLog);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const now = new Date().toLocaleString();
    const results: LeadResult[] = SIMULATED_LEADS.map((l, i) => ({
      ...l,
      id: i + 1,
      scannedAt: now,
    }));

    localStorage.setItem("ebs_lead_scan_results", JSON.stringify(results));
    setLeads(results);
    setIsScanning(false);

    const doneLog = appendLog(
      `Marketing Agent: Scan complete — ${results.length} leads found across ${new Set(results.map((r) => r.niche)).size} niches`,
      "scan",
    );
    setLog(doneLog);
    toast.success(`Scan complete! ${results.length} affiliate leads found.`);
  };

  const handleSyncMembers = () => {
    const count = getMemberCount();
    const source = getMemberSource();
    setMemberCount(count);
    setMemberSource(source);
    const updated = appendLog(
      `Member Agent: Database synced — ${count} members active (${source})`,
      "sync",
    );
    setLog(updated);
    toast.success("Member database synced successfully.");
  };

  const handleCheckApiStatus = () => {
    const active = hasClickbankKeys();
    setCbKeysActive(active);
    const updated = appendLog(
      `AI Product Hunter: API status check — ${active ? "ClickBank connected" : "Awaiting API keys"}`,
      "status",
    );
    setLog(updated);
  };

  const handleClearLog = () => {
    localStorage.removeItem("ebs_agent_log");
    setLog([]);
    toast.success("Activity log cleared.");
  };

  const lastScan = leads.length > 0 ? leads[0].scannedAt : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-ocid="agent_status.section"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-[#F37D22] rounded-lg p-2">
            <Radio className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wide text-[#F37D22]">
            Agent Command Center
          </h2>
        </div>
        <p className="text-sm text-muted-foreground ml-13 pl-0.5">
          Real-Time Status of All Agents
        </p>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Marketing Agent */}
        <Card
          className="rounded-xl shadow-md border border-gray-100"
          data-ocid="agent_status.marketing.card"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-[#F37D22]" />
                <CardTitle className="text-sm font-black uppercase tracking-widest">
                  Marketing Agent
                </CardTitle>
              </div>
              {leads.length > 0 ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-bold">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> ACTIVE
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs font-bold">
                  <AlertCircle className="h-3 w-3 mr-1" /> STANDBY
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-[#F37D22]">
                  {leads.length}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Leads Found
                </span>
              </div>
              {lastScan && (
                <p className="text-xs text-muted-foreground">
                  Last scan: {lastScan}
                </p>
              )}
              {!lastScan && (
                <p className="text-xs text-muted-foreground">No scan run yet</p>
              )}
            </div>
            <Button
              onClick={handleScanLeads}
              disabled={isScanning}
              className="w-full bg-[#F37D22] hover:bg-[#e6871f] text-white font-bold text-xs uppercase tracking-widest"
              data-ocid="agent_status.scan_button"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Scanning...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" /> Scan for Leads
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Member Agent */}
        <Card
          className="rounded-xl shadow-md border border-gray-100"
          data-ocid="agent_status.member.card"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#F37D22]" />
                <CardTitle className="text-sm font-black uppercase tracking-widest">
                  Member Agent
                </CardTitle>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-bold">
                <CheckCircle2 className="h-3 w-3 mr-1" /> ACTIVE
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-[#F37D22]">
                  {memberCount.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Members in DB
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Source: {memberSource}
                </p>
              </div>
            </div>
            <Button
              onClick={handleSyncMembers}
              variant="outline"
              className="w-full border-[#F37D22] text-[#F37D22] hover:bg-[#F37D22]/10 font-bold text-xs uppercase tracking-widest"
              data-ocid="agent_status.sync_button"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Sync Database
            </Button>
          </CardContent>
        </Card>

        {/* AI Product Hunter */}
        <Card
          className="rounded-xl shadow-md border border-gray-100"
          data-ocid="agent_status.hunter.card"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#F37D22]" />
                <CardTitle className="text-sm font-black uppercase tracking-widest">
                  AI Product Hunter
                </CardTitle>
              </div>
              {cbKeysActive ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-bold">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> ACTIVE
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs font-bold">
                  <AlertCircle className="h-3 w-3 mr-1" /> STANDBY
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-black ${cbKeysActive ? "text-green-600" : "text-yellow-600"}`}
                >
                  {cbKeysActive ? "Connected" : "Awaiting Keys"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {cbKeysActive
                  ? "ClickBank API is active and fetching products"
                  : "Enter ClickBank keys in Settings tab to activate"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCheckApiStatus}
                variant="outline"
                className="flex-1 border-[#F37D22] text-[#F37D22] hover:bg-[#F37D22]/10 font-bold text-xs uppercase tracking-widest"
                data-ocid="agent_status.check_api_button"
              >
                <Activity className="h-4 w-4 mr-1" /> Refresh
              </Button>
              <Button
                onClick={() => {
                  if (onNavigateToSettings) onNavigateToSettings();
                  else
                    toast.info(
                      "Navigate to Settings tab to enter ClickBank API keys.",
                    );
                }}
                className="flex-1 bg-[#F37D22] hover:bg-[#e6871f] text-white font-bold text-xs uppercase tracking-widest"
                data-ocid="agent_status.settings_button"
              >
                <Settings className="h-4 w-4 mr-1" /> Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scan Results Table */}
      {leads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          data-ocid="agent_status.leads.table"
        >
          <Card className="rounded-xl shadow-md border border-gray-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-[#F37D22]" />
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-[#F37D22]">
                    Scanned Affiliate Leads ({leads.length})
                  </CardTitle>
                </div>
                <Button
                  onClick={() => {
                    localStorage.removeItem("ebs_lead_scan_results");
                    setLeads([]);
                    const updated = appendLog(
                      "Marketing Agent: Lead results cleared",
                      "scan",
                    );
                    setLog(updated);
                    toast.success("Lead results cleared.");
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-destructive"
                  data-ocid="agent_status.leads.delete_button"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[360px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow className="border-b border-[#F37D22]/20">
                      <TableHead className="text-[#F37D22] font-bold text-xs uppercase tracking-widest w-10">
                        #
                      </TableHead>
                      <TableHead className="text-[#F37D22] font-bold text-xs uppercase tracking-widest">
                        Lead Name
                      </TableHead>
                      <TableHead className="text-[#F37D22] font-bold text-xs uppercase tracking-widest">
                        Niche
                      </TableHead>
                      <TableHead className="text-[#F37D22] font-bold text-xs uppercase tracking-widest text-center">
                        Commission
                      </TableHead>
                      <TableHead className="text-[#F37D22] font-bold text-xs uppercase tracking-widest text-center">
                        Gravity
                      </TableHead>
                      <TableHead className="text-[#F37D22] font-bold text-xs uppercase tracking-widest text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead, idx) => (
                      <TableRow
                        key={lead.id}
                        className="hover:bg-muted/30"
                        data-ocid={`agent_status.leads.row.${idx + 1}`}
                      >
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {lead.id}
                        </TableCell>
                        <TableCell className="font-semibold text-sm">
                          {lead.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-xs border-[#F37D22]/40 text-[#F37D22]"
                          >
                            {lead.niche}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-black text-green-600 text-sm">
                            {lead.commission}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-bold text-sm text-foreground">
                            {lead.gravity}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            className="bg-[#F37D22] hover:bg-[#e6871f] text-white font-bold text-xs h-7 px-3"
                            onClick={() =>
                              toast.info("Lead contact feature coming soon.")
                            }
                            data-ocid={`agent_status.leads.button.${idx + 1}`}
                          >
                            Contact
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Activity Log */}
      <Card
        className="rounded-xl shadow-md border border-gray-100"
        data-ocid="agent_status.log.panel"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#F37D22]" />
              <CardTitle className="text-sm font-black uppercase tracking-widest">
                Agent Activity Log
              </CardTitle>
            </div>
            <Button
              onClick={handleClearLog}
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-destructive"
              data-ocid="agent_status.log.delete_button"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {log.length === 0 ? (
            <p
              className="text-xs text-muted-foreground text-center py-6"
              data-ocid="agent_status.log.empty_state"
            >
              No log entries yet. Activity will appear here.
            </p>
          ) : (
            <div className="overflow-y-auto max-h-[200px] space-y-1.5 pr-1">
              {log.slice(0, 20).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-2.5 py-1.5 border-b border-gray-50 last:border-0"
                  data-ocid="agent_status.log.row"
                >
                  <span
                    className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                      entry.type === "scan"
                        ? "bg-[#F37D22]"
                        : entry.type === "sync"
                          ? "bg-blue-400"
                          : entry.type === "error"
                            ? "bg-red-400"
                            : "bg-gray-300"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-tight">
                      {entry.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {entry.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
