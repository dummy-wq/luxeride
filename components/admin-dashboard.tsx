"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Search,
    ShieldCheck,
    Mail,
    Phone,
    Calendar,
    Ban,
    Trash2,
    Clock,
    Unlock,
    Key,
    Package,
    Settings,
    Copy,
    Download,
    Check,
    Palette,
    Type,
    Layers,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { siteConfig } from "@/template/config";
import { FleetManager } from "@/components/fleet-manager";

// ─── Script content (mirrors scripts/theme-wizard.js) ───────────────────────
const THEME_WIZARD_JS = `const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const globalsPath = path.join(__dirname, '../app/globals.css');
const question = (q) => new Promise((res) => rl.question(q, res));

async function main() {
  console.log('\\n🎨 Welcome to the LuxeRide Theme & Font Wizard\\n');
  console.log('[1/3] LIGHT MODE COLORS');
  const lightPrimary = await question('   Primary Brand Color (Hex): ') || '#af3a03';
  const lightBg      = await question('   Background Color (Hex): ')    || '#f9f5d7';
  console.log('\\n[2/3] DARK MODE COLORS');
  const darkPrimary  = await question('   Primary Brand Color (Hex): ') || '#a6a922';
  const darkBg       = await question('   Background Color (Hex): ')    || '#141311';
  console.log('\\n[3/3] TYPOGRAPHY');
  const headingFont  = await question('   Heading Font Family: ')       || "'Montserrat', sans-serif";
  const bodyFont     = await question('   Body/Sans Font Family: ')     || "'Inter', sans-serif";

  console.log('\\n🚀 Updating globals.css...');
  let content = fs.readFileSync(globalsPath, 'utf8');
  content = updateVar(content, ':root',        '--primary',      lightPrimary);
  content = updateVar(content, ':root',        '--background',   lightBg);
  content = updateVar(content, ':root',        '--ring',         lightPrimary);
  content = updateVar(content, '.dark',        '--primary',      darkPrimary);
  content = updateVar(content, '.dark',        '--background',   darkBg);
  content = updateVar(content, '.dark',        '--ring',         darkPrimary);
  content = updateVar(content, '@theme inline','--font-heading', headingFont);
  content = updateVar(content, '@theme inline','--font-sans',    bodyFont);
  fs.writeFileSync(globalsPath, content);
  console.log('\\n✨ Done! Run npm run dev to see your changes.\\n');
  rl.close();
}

function updateVar(content, block, variable, value) {
  const esc     = block.replace('.', '\\\\.').replace('@', '\\\\@');
  const blockRx = new RegExp(\`\${esc}\\\\s*{([^}]*)}\`, 's');
  const match   = content.match(blockRx);
  if (!match) return content;
  let bc = match[1];
  const varRx = new RegExp(\`\${variable}:\\\\s*[^;]+;\`, 'g');
  bc = varRx.test(bc) ? bc.replace(varRx, \`\${variable}: \${value};\`) : bc + \`\\n  \${variable}: \${value};\`;
  return content.replace(match[1], bc);
}

main();
`;

const THEME_WIZARD_SH = `#!/bin/bash
# Theme Wizard Launcher for Bash/Zsh
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed."
  exit 1
fi
node "$(dirname "$0")/theme-wizard.js"
`;

const THEME_WIZARD_PS1 = `# Theme Wizard Launcher for PowerShell
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "❌ Node.js is not installed." -ForegroundColor Red
  exit
}
node "$PSScriptRoot/theme-wizard.js"
`;

const SCRIPT_FILES = [
    { name: "theme-wizard.js", content: THEME_WIZARD_JS, type: "application/javascript" },
    { name: "theme-wizard.sh", content: THEME_WIZARD_SH, type: "text/x-sh" },
    { name: "theme-wizard.ps1", content: THEME_WIZARD_PS1, type: "text/plain" },
];

// ─── Fonts available for selection ──────────────────────────────────────────
const FONT_PAIRS = [
    { label: "Montserrat + Inter",   heading: "'Montserrat', sans-serif",  body: "'Inter', sans-serif" },
    { label: "Playfair + Lato",      heading: "'Playfair Display', serif", body: "'Lato', sans-serif" },
    { label: "Raleway + Open Sans",  heading: "'Raleway', sans-serif",     body: "'Open Sans', sans-serif" },
    { label: "Poppins + Poppins",    heading: "'Poppins', sans-serif",     body: "'Poppins', sans-serif" },
    { label: "Oswald + Roboto",      heading: "'Oswald', sans-serif",      body: "'Roboto', sans-serif" },
    { label: "DM Serif + DM Sans",   heading: "'DM Serif Display', serif", body: "'DM Sans', sans-serif" },
];

// ─── Customise Tab ───────────────────────────────────────────────────────────
function CustomisePanel() {
    const { toast } = useToast();
    const [copied, setCopied] = useState<string | null>(null);

    // Live values (cosmetic only – script generates the real output)
    const [lightPrimary, setLightPrimary] = useState("#af3a03");
    const [lightBg,      setLightBg]      = useState("#f9f5d7");
    const [darkPrimary,  setDarkPrimary]  = useState("#a6a922");
    const [darkBg,       setDarkBg]       = useState("#141311");
    const [selectedFont, setSelectedFont] = useState(0);

    const handleCopy = useCallback(async (content: string, fileName: string) => {
        await navigator.clipboard.writeText(content);
        setCopied(fileName);
        toast({ title: "Copied!", description: `${fileName} copied to clipboard.` });
        setTimeout(() => setCopied(null), 2000);
    }, [toast]);

    const handleDownload = useCallback((file: { name: string; content: string; type: string }) => {
        const blob = new Blob([file.content], { type: file.type });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href     = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Downloaded!", description: `${file.name} saved to your downloads.` });
    }, [toast]);

    const handleDownloadAll = useCallback(() => {
        SCRIPT_FILES.forEach((f) => handleDownload(f));
    }, [handleDownload]);

    const swatch = (color: string) => (
        <span
            className="inline-block w-4 h-4 rounded-full border border-border/50 flex-shrink-0"
            style={{ background: color }}
        />
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Colors */}
            <Card className="p-6 bg-card border-border shadow-md rounded-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <Palette className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-black text-foreground tracking-tight text-lg">Colour Palette</h2>
                        <p className="text-xs text-muted-foreground">Preview your brand colours before running the wizard</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Light Mode */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Light Mode</p>
                        <label className="flex items-center gap-3 text-sm text-foreground">
                            <span className="w-28 text-muted-foreground">Primary</span>
                            <input type="color" value={lightPrimary} onChange={(e) => setLightPrimary(e.target.value)}
                                className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent p-0.5" />
                            {swatch(lightPrimary)}
                            <span className="font-mono text-xs text-muted-foreground">{lightPrimary}</span>
                        </label>
                        <label className="flex items-center gap-3 text-sm text-foreground">
                            <span className="w-28 text-muted-foreground">Background</span>
                            <input type="color" value={lightBg} onChange={(e) => setLightBg(e.target.value)}
                                className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent p-0.5" />
                            {swatch(lightBg)}
                            <span className="font-mono text-xs text-muted-foreground">{lightBg}</span>
                        </label>
                    </div>

                    {/* Dark Mode */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Dark Mode</p>
                        <label className="flex items-center gap-3 text-sm text-foreground">
                            <span className="w-28 text-muted-foreground">Primary</span>
                            <input type="color" value={darkPrimary} onChange={(e) => setDarkPrimary(e.target.value)}
                                className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent p-0.5" />
                            {swatch(darkPrimary)}
                            <span className="font-mono text-xs text-muted-foreground">{darkPrimary}</span>
                        </label>
                        <label className="flex items-center gap-3 text-sm text-foreground">
                            <span className="w-28 text-muted-foreground">Background</span>
                            <input type="color" value={darkBg} onChange={(e) => setDarkBg(e.target.value)}
                                className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent p-0.5" />
                            {swatch(darkBg)}
                            <span className="font-mono text-xs text-muted-foreground">{darkBg}</span>
                        </label>
                    </div>
                </div>
            </Card>

            {/* Typography */}
            <Card className="p-6 bg-card border-border shadow-md rounded-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <Type className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-black text-foreground tracking-tight text-lg">Typography</h2>
                        <p className="text-xs text-muted-foreground">Choose a font pairing for headings and body copy</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {FONT_PAIRS.map((fp, i) => (
                        <button
                            key={fp.label}
                            onClick={() => setSelectedFont(i)}
                            className={`group text-left p-4 rounded-xl border transition-all duration-200 ${
                                selectedFont === i
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-border hover:border-primary/40 hover:bg-secondary/30"
                            }`}
                        >
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{fp.label}</p>
                            <p className="text-base font-bold text-foreground leading-snug" style={{ fontFamily: fp.heading }}>
                                The Quick Brown Fox
                            </p>
                            <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: fp.body }}>
                                Jumps over the lazy dog
                            </p>
                        </button>
                    ))}
                </div>
            </Card>

            {/* Script Download */}
            <Card className="p-6 bg-card border-border shadow-md rounded-2xl space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <Settings className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-black text-foreground tracking-tight text-lg">Theme Wizard Scripts</h2>
                            <p className="text-xs text-muted-foreground">
                                Drop these into your own <span className="font-mono">scripts/</span> folder and run to apply your brand
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={handleDownloadAll}
                        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                        size="sm"
                    >
                        <Download className="w-4 h-4" /> Download All
                    </Button>
                </div>

                <div className="space-y-3">
                    {SCRIPT_FILES.map((file) => (
                        <div
                            key={file.name}
                            className="flex items-center justify-between gap-4 p-3.5 bg-secondary/30 rounded-xl border border-border hover:bg-secondary/50 transition-colors animate-scale-in"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="p-1.5 bg-background rounded-lg border border-border">
                                    <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                                </span>
                                <span className="font-mono text-sm text-foreground truncate">{file.name}</span>
                                <span className="hidden sm:inline text-xs text-muted-foreground">
                                    {file.name.endsWith(".js") && "Node.js wizard"}
                                    {file.name.endsWith(".sh") && "Bash / Zsh launcher"}
                                    {file.name.endsWith(".ps1") && "PowerShell launcher"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 rounded-lg gap-1.5 text-xs"
                                    onClick={() => handleCopy(file.content, file.name)}
                                >
                                    {copied === file.name
                                        ? <><Check className="w-3.5 h-3.5 text-green-500" /> Copied</>
                                        : <><Copy className="w-3.5 h-3.5" /> Copy</>
                                    }
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 rounded-lg gap-1.5 text-xs"
                                    onClick={() => handleDownload(file)}
                                >
                                    <Download className="w-3.5 h-3.5" /> Save
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-xl bg-secondary/30 border border-border p-4 space-y-1">
                    <p className="text-xs font-bold text-foreground uppercase tracking-wider">How to use</p>
                    <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Download all three files into your project's <span className="font-mono">scripts/</span> folder.</li>
                        <li>On Linux / Mac run: <span className="font-mono">bash scripts/theme-wizard.sh</span></li>
                        <li>On Windows run: <span className="font-mono">pwsh scripts/theme-wizard.ps1</span></li>
                        <li>Follow the prompts to set colours and fonts, then restart your dev server.</li>
                    </ol>
                </div>
            </Card>
        </div>
    );
}

// ─── Template Settings Tab ──────────────────────────────────────────────────
function TemplateSettingsPanel() {
    const { template, taxonomy, metadataSchema, ui } = siteConfig;

    const configEntries = [
        { label: "Template Mode", value: template.mode, highlight: true },
        { label: "Show Availability", value: template.showAvailability ? "Yes" : "No" },
        { label: "Booking Enabled", value: template.enableBooking ? "Yes" : "No" },
        { label: "Item Label", value: `${taxonomy.itemLabelSingular} / ${taxonomy.itemLabelPlural}` },
        { label: "Category Label", value: taxonomy.categoryLabel },
        { label: "CTA Text", value: taxonomy.actionLabel },
        { label: "Price Suffix", value: taxonomy.priceSuffix || "(none)" },
        { label: "Currency", value: ui.currencySymbol },
        { label: "Orders Label", value: taxonomy.ordersLabel },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Current Config Summary */}
            <Card className="p-6 bg-card border-border shadow-md rounded-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <Layers className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-black text-foreground tracking-tight text-lg">Current Configuration</h2>
                        <p className="text-xs text-muted-foreground">These values are read from <span className="font-mono">lib/config.ts</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {configEntries.map((entry) => (
                        <div
                            key={entry.label}
                            className={`p-4 rounded-xl border transition-all ${
                                entry.highlight
                                    ? "border-primary/30 bg-primary/5"
                                    : "border-border bg-secondary/20"
                            }`}
                        >
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                {entry.label}
                            </p>
                            <p className={`text-sm font-bold ${
                                entry.highlight ? "text-primary" : "text-foreground"
                            }`}>
                                {entry.value}
                            </p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Metadata Schema */}
            <Card className="p-6 bg-card border-border shadow-md rounded-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <Settings className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-black text-foreground tracking-tight text-lg">Metadata Schema</h2>
                        <p className="text-xs text-muted-foreground">These fields appear as &ldquo;Quick Specs&rdquo; on cards and detail pages</p>
                    </div>
                </div>

                <div className="space-y-2">
                    {metadataSchema.map((spec, i) => (
                        <div
                            key={spec.key}
                            className="flex items-center gap-4 p-3 bg-secondary/20 rounded-xl border border-border"
                        >
                            <span className="text-xs font-bold text-muted-foreground w-6 text-center">{i + 1}</span>
                            <div className="flex-1">
                                <span className="text-sm font-bold text-foreground">{spec.label}</span>
                                <span className="text-xs text-muted-foreground ml-2">key: <span className="font-mono">{spec.key}</span></span>
                            </div>
                            <span className="text-xs text-muted-foreground font-mono bg-background px-2 py-1 rounded border border-border">
                                {spec.icon}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* How to Customise */}
            <Card className="p-6 bg-card border-border shadow-md rounded-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <ExternalLink className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-black text-foreground tracking-tight text-lg">How to Customise</h2>
                        <p className="text-xs text-muted-foreground">Make this template your own in 3 easy steps</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        {
                            step: "1",
                            title: "Set your template mode",
                            desc: `Open lib/config.ts and change template.mode to "service" (rentals, bookings) or "shopping" (e-commerce, direct purchase).`,
                        },
                        {
                            step: "2",
                            title: "Update taxonomy & labels",
                            desc: `Change taxonomy.itemLabelSingular (e.g. "Fruit"), itemLabelPlural ("Fruits"), actionLabel ("Buy Now"), priceSuffix ("/kg" or ""), etc.`,
                        },
                        {
                            step: "3",
                            title: "Define your product specs",
                            desc: `Edit metadataSchema to list the specs you want shown on product cards. E.g. { key: "origin", label: "Origin", icon: "MapPin" }. The admin form and cards update automatically.`,
                        },
                    ].map((item) => (
                        <div key={item.step} className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-black text-sm">
                                {item.step}
                            </div>
                            <div>
                                <p className="font-bold text-foreground text-sm">{item.title}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                    <p className="text-xs text-foreground">
                        <span className="font-bold">📄 Full documentation:</span> See <span className="font-mono">WHITE_LABELING.md</span> and <span className="font-mono">PLUG_AND_PLAY.md</span> in the project root for detailed guides.
                    </p>
                </div>
            </Card>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function AdminDashboard() {
    const { toast } = useToast();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"users" | "catalog" | "customise" | "template">("users");
    const router = useRouter();

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("auth_token");
            if (!token) { router.push("/login"); return; }

            const response = await fetch("/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                if (response.status === 401) setError("Unauthorized. Admin access required.");
                else throw new Error("Failed to fetch users");
                return;
            }

            const data = await response.json();
            setUsers(data.users || []);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load admin data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, [router]);

    const handleAction = async (userId: string, action: string, minutes?: number) => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) return;

            const response = await fetch(`/api/admin/users/${userId}`, {
                method: action === "delete" ? "DELETE" : "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: action !== "delete" ? JSON.stringify({ action, minutes }) : undefined,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Action failed");
            }

            fetchUsers();
            toast({ title: "Action Successful", description: `Action ${action} has been performed.` });
        } catch (err: unknown) {
            toast({
                title: "Action Failed",
                description: err instanceof Error ? err.message : "Failed to perform administrative action",
                variant: "destructive",
            });
        }
    };

    const filteredUsers = users.filter((user: any) =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground font-medium">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="max-w-md w-full p-8 text-center space-y-6 border-destructive/20 shadow-2xl">
                    <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                        <ShieldCheck className="w-10 h-10 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                    <Button onClick={() => router.push("/")} className="w-full">Return to Safety</Button>
                </Card>
            </div>
        );
    }

    const tabHeadings: Record<typeof activeTab, { title: string; subtitle: string }> = {
        users:     { title: "User Management",    subtitle: `Monitor and manage all ${siteConfig.brand.name} members` },
        catalog:   { title: "Catalog Management", subtitle: `Manage your ${siteConfig.taxonomy.itemLabelPlural.toLowerCase()} inventory and pricing` },
        customise: { title: "Customise",          subtitle: "Adjust your brand colours, typography and scripts" },
        template:  { title: "Template Settings",  subtitle: "View your current template configuration and customisation guide" },
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">Admin Portal</span>
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">
                            {tabHeadings[activeTab].title}
                        </h1>
                        <p className="text-muted-foreground">{tabHeadings[activeTab].subtitle}</p>
                    </div>

                    {/* Tab switcher */}
                    <div className="flex items-center gap-1.5 bg-secondary/50 p-1.5 rounded-2xl border border-border flex-wrap">
                        {(["users", "catalog", "customise", "template"] as const).map((tab) => (
                            <Button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                variant={activeTab === tab ? "default" : "ghost"}
                                className={`rounded-xl gap-2 capitalize ${activeTab === tab ? "shadow-lg" : ""}`}
                            >
                                {tab === "users"     && <Users   className="w-4 h-4" />}
                                {tab === "catalog"   && <Package className="w-4 h-4" />}
                                {tab === "customise" && <Palette className="w-4 h-4" />}
                                {tab === "template"  && <Layers  className="w-4 h-4" />}
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Tab content */}
                {activeTab === "users" && (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <Card className="p-6 bg-card border-border shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 rounded-xl"><Users className="w-6 h-6 text-primary" /></div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Members</p>
                                        <p className="text-3xl font-black text-foreground">{users.length}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6 bg-card border-border shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-500/10 rounded-xl"><ShieldCheck className="w-6 h-6 text-green-500" /></div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Active Today</p>
                                        <p className="text-3xl font-black text-foreground">{Math.floor(users.length * 0.4)}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6 bg-card border-border shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-accent/10 rounded-xl"><Calendar className="w-6 h-6 text-accent-foreground" /></div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">New This Week</p>
                                        <p className="text-3xl font-black text-foreground">{Math.floor(users.length * 0.1)}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Search */}
                        <div className="mb-6">
                            <div className="relative group max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search users by name, email or phone..."
                                    className="pl-10 pr-4 py-2.5 bg-input border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Users table */}
                        <Card className="bg-card border-border shadow-xl overflow-hidden rounded-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-secondary/50 border-b border-border">
                                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Member</th>
                                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Contact</th>
                                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Password (Hash)</th>
                                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <tr key={user.id || user._id} className="hover:bg-secondary/20 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg select-none">
                                                                {user.fullName?.[0]?.toUpperCase() || <Users className="w-5 h-5" />}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-foreground group-hover:text-primary transition-colors">{user.fullName || "Unnamed User"}</p>
                                                                <p className="text-xs text-muted-foreground font-mono">ID: {user.id?.slice(-8) || user._id?.slice(-8)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-sm text-foreground/80">
                                                                <Mail className="w-3.5 h-3.5 text-muted-foreground" />{user.email}
                                                            </div>
                                                            {user.phone && (
                                                                <div className="flex items-center gap-2 text-sm text-foreground/80">
                                                                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />{user.phone}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-secondary/30 p-2 rounded truncate max-w-[150px]">
                                                            <Key className="w-3 h-3" />{user.passwordHash || "N/A"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        {user.isBanned ? (
                                                            <span className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider rounded border border-red-500/20">Banned</span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider rounded border border-green-500/20">Active</span>
                                                        )}
                                                        {user.bannedUntil && new Date(user.bannedUntil) > new Date() && (
                                                            <p className="text-[9px] text-muted-foreground mt-1">Until: {new Date(user.bannedUntil).toLocaleTimeString()}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {user.isBanned ? (
                                                                <Button onClick={() => handleAction(user.id || user._id, "unban")} variant="outline" size="sm" className="h-8 px-2 border-green-500/20 text-green-500 hover:bg-green-500/10">
                                                                    <Unlock className="w-3.5 h-3.5 mr-1" /> Unban
                                                                </Button>
                                                            ) : (
                                                                <>
                                                                    <Button onClick={() => handleAction(user.id || user._id, "ban")} variant="outline" size="sm" className="h-8 px-2 border-red-500/20 text-red-500 hover:bg-red-500/10">
                                                                        <Ban className="w-3.5 h-3.5 mr-1" /> Ban
                                                                    </Button>
                                                                    <Button onClick={() => handleAction(user.id || user._id, "timeout", 30)} variant="outline" size="sm" className="h-8 px-2 border-orange-500/20 text-orange-500 hover:bg-orange-500/10">
                                                                        <Clock className="w-3.5 h-3.5 mr-1" /> Time
                                                                    </Button>
                                                                </>
                                                            )}
                                                            <Button onClick={() => handleAction(user.id || user._id, "delete")} variant="outline" size="sm" className="h-8 px-2 border-destructive/20 text-destructive hover:bg-destructive/10">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="p-4 bg-secondary rounded-full"><Users className="w-8 h-8 text-muted-foreground" /></div>
                                                        <p className="text-lg font-bold text-foreground">No users found</p>
                                                        <p className="text-muted-foreground">Try adjusting your search terms</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </>
                )}

                {activeTab === "catalog" && <FleetManager />}

                {activeTab === "customise" && <CustomisePanel />}

                {activeTab === "template" && <TemplateSettingsPanel />}

                {/* Footer */}
                <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
                    <p>Showing {activeTab === "users" ? filteredUsers.length : activeTab === "catalog" ? "all" : "—"} items</p>
                    <p className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        {siteConfig.brand.name} Secure Admin Workspace
                    </p>
                </div>
            </div>
        </div>
    );
}
