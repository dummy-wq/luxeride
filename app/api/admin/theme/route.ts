import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const themeCssPath = path.join(process.cwd(), "template", "theme.css");
    const content = await fs.readFile(themeCssPath, "utf8");

    function extractVar(block: string, variable: string) {
      const esc = block.replace('.', '\\.').replace('@', '\\@');
      const blockRx = new RegExp(`${esc}\\s*\\{([^]*?)\\}`, 's');
      const match = content.match(blockRx);
      if (!match) return "";
      const varRx = new RegExp(`${variable.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}:\\s*([^;]+);`);
      const vMatch = match[1].match(varRx);
      return vMatch ? vMatch[1].trim() : "";
    }

    return NextResponse.json({
      theme: {
        lightPrimary: extractVar(':root', '--primary'),
        lightBg: extractVar(':root', '--background'),
        lightCard: extractVar(':root', '--card'),
        lightSecondary: extractVar(':root', '--secondary'),
        lightAccent: extractVar(':root', '--accent'),
        
        darkPrimary: extractVar('.dark', '--primary'),
        darkBg: extractVar('.dark', '--background'),
        darkCard: extractVar('.dark', '--card'),
        darkSecondary: extractVar('.dark', '--secondary'),
        darkAccent: extractVar('.dark', '--accent'),
        
        headingFont: extractVar(':root', '--font-heading'),
        bodyFont: extractVar(':root', '--font-sans')
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { 
      lightPrimary, lightBg, lightCard, lightSecondary, lightAccent,
      darkPrimary, darkBg, darkCard, darkSecondary, darkAccent,
      headingFont, bodyFont 
    } = await req.json();

    // The logic below updates both template/theme.css and app/globals.css
    // to ensure complete compatibility whether the user uses var() or literal fonts.

    /* 1. Update template/theme.css */
    const themeCssPath = path.join(process.cwd(), "template", "theme.css");
    let themeCssContent = await fs.readFile(themeCssPath, "utf8");

    function updateVar(content: string, block: string, variable: string, value: string) {
      if (!value) return content;
      const esc = block.replace('.', '\\.').replace('@', '\\@');
      const blockRx = new RegExp(`${esc}\\s*\\{([^]*?)\\}`, 's');
      const match = content.match(blockRx);
      if (!match) return content;
      
      let bc = match[1];
      const varRx = new RegExp(`${variable.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}:\\s*[^;]+;`, 'g');
      if (varRx.test(bc)) {
        bc = bc.replace(varRx, `${variable}: ${value};`);
      } else {
        bc = bc + `\n  ${variable}: ${value};`;
      }
      return content.replace(match[0], `${block} {${bc}}`);
    }

    themeCssContent = updateVar(themeCssContent, ':root', '--primary', lightPrimary);
    themeCssContent = updateVar(themeCssContent, ':root', '--background', lightBg);
    themeCssContent = updateVar(themeCssContent, ':root', '--card', lightCard);
    themeCssContent = updateVar(themeCssContent, ':root', '--secondary', lightSecondary);
    themeCssContent = updateVar(themeCssContent, ':root', '--accent', lightAccent);
    themeCssContent = updateVar(themeCssContent, ':root', '--ring', lightPrimary);
    themeCssContent = updateVar(themeCssContent, ':root', '--sidebar-primary', lightPrimary);
    themeCssContent = updateVar(themeCssContent, ':root', '--sidebar-ring', lightPrimary);
    
    themeCssContent = updateVar(themeCssContent, '.dark', '--primary', darkPrimary);
    themeCssContent = updateVar(themeCssContent, '.dark', '--background', darkBg);
    themeCssContent = updateVar(themeCssContent, '.dark', '--card', darkCard);
    themeCssContent = updateVar(themeCssContent, '.dark', '--secondary', darkSecondary);
    themeCssContent = updateVar(themeCssContent, '.dark', '--accent', darkAccent);
    themeCssContent = updateVar(themeCssContent, '.dark', '--ring', darkPrimary);
    themeCssContent = updateVar(themeCssContent, '.dark', '--sidebar-primary', darkPrimary);
    themeCssContent = updateVar(themeCssContent, '.dark', '--sidebar-ring', darkPrimary);

    function getContrastForeground(hex: string) {
      if (!hex) return "#141311";
      hex = hex.replace("#", "");
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      const r = parseInt(hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.substring(4, 6), 16) || 0;
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? "#141311" : "#fbf1c7";
    }

    if (lightPrimary) themeCssContent = updateVar(themeCssContent, ':root', '--primary-foreground', getContrastForeground(lightPrimary));
    if (lightBg) themeCssContent = updateVar(themeCssContent, ':root', '--foreground', getContrastForeground(lightBg));
    if (lightCard) themeCssContent = updateVar(themeCssContent, ':root', '--card-foreground', getContrastForeground(lightCard));
    if (lightSecondary) themeCssContent = updateVar(themeCssContent, ':root', '--secondary-foreground', getContrastForeground(lightSecondary));
    if (lightAccent) themeCssContent = updateVar(themeCssContent, ':root', '--accent-foreground', getContrastForeground(lightAccent));
    if (lightPrimary) themeCssContent = updateVar(themeCssContent, ':root', '--sidebar-primary-foreground', getContrastForeground(lightPrimary));
    if (lightBg) themeCssContent = updateVar(themeCssContent, ':root', '--sidebar-foreground', getContrastForeground(lightBg));

    // Derive structural colors for light mode dynamically
    themeCssContent = updateVar(themeCssContent, ':root', '--muted', 'color-mix(in srgb, var(--foreground) 8%, var(--background))');
    themeCssContent = updateVar(themeCssContent, ':root', '--muted-foreground', 'color-mix(in srgb, var(--foreground) 65%, var(--background))');
    themeCssContent = updateVar(themeCssContent, ':root', '--border', 'color-mix(in srgb, var(--foreground) 15%, var(--background))');
    themeCssContent = updateVar(themeCssContent, ':root', '--sidebar-border', 'color-mix(in srgb, var(--foreground) 15%, var(--background))');
    themeCssContent = updateVar(themeCssContent, ':root', '--input', 'color-mix(in srgb, var(--foreground) 15%, var(--background))');
    themeCssContent = updateVar(themeCssContent, ':root', '--secondary', 'color-mix(in srgb, var(--foreground) 4%, var(--background))');
    themeCssContent = updateVar(themeCssContent, ':root', '--secondary-foreground', 'var(--foreground)');
    themeCssContent = updateVar(themeCssContent, ':root', '--card', 'color-mix(in srgb, var(--foreground) 2%, var(--background))');
    themeCssContent = updateVar(themeCssContent, ':root', '--card-foreground', 'var(--foreground)');
    themeCssContent = updateVar(themeCssContent, ':root', '--popover', 'var(--background)');
    themeCssContent = updateVar(themeCssContent, ':root', '--popover-foreground', 'var(--foreground)');

    if (darkPrimary) themeCssContent = updateVar(themeCssContent, '.dark', '--primary-foreground', getContrastForeground(darkPrimary));
    if (darkBg) themeCssContent = updateVar(themeCssContent, '.dark', '--foreground', getContrastForeground(darkBg));
    if (darkPrimary) themeCssContent = updateVar(themeCssContent, '.dark', '--sidebar-primary-foreground', getContrastForeground(darkPrimary));
    if (darkBg) themeCssContent = updateVar(themeCssContent, '.dark', '--sidebar-foreground', getContrastForeground(darkBg));

    // Derive structural colors for dark mode dynamically
    themeCssContent = updateVar(themeCssContent, '.dark', '--muted', 'color-mix(in srgb, var(--foreground) 10%, var(--background))');
    themeCssContent = updateVar(themeCssContent, '.dark', '--muted-foreground', 'color-mix(in srgb, var(--foreground) 65%, var(--background))');
    themeCssContent = updateVar(themeCssContent, '.dark', '--border', 'color-mix(in srgb, var(--foreground) 15%, var(--background))');
    themeCssContent = updateVar(themeCssContent, '.dark', '--sidebar-border', 'color-mix(in srgb, var(--foreground) 15%, var(--background))');
    themeCssContent = updateVar(themeCssContent, '.dark', '--input', 'color-mix(in srgb, var(--foreground) 15%, var(--background))');
    themeCssContent = updateVar(themeCssContent, '.dark', '--secondary', 'color-mix(in srgb, var(--foreground) 10%, var(--background))');
    themeCssContent = updateVar(themeCssContent, '.dark', '--secondary-foreground', 'var(--foreground)');
    themeCssContent = updateVar(themeCssContent, '.dark', '--card', 'color-mix(in srgb, var(--foreground) 3%, var(--background))');
    themeCssContent = updateVar(themeCssContent, '.dark', '--card-foreground', 'var(--foreground)');
    themeCssContent = updateVar(themeCssContent, '.dark', '--popover', 'var(--background)');
    themeCssContent = updateVar(themeCssContent, '.dark', '--popover-foreground', 'var(--foreground)');
    
    if (headingFont) themeCssContent = updateVar(themeCssContent, ':root', '--font-heading', headingFont);
    if (bodyFont) themeCssContent = updateVar(themeCssContent, ':root', '--font-sans', bodyFont);
    
    await fs.writeFile(themeCssPath, themeCssContent, "utf8");

    /* 2. Update app/globals.css (for Tailwind 4 @theme) */
    const globalsPath = path.join(process.cwd(), "app", "globals.css");
    let globalsContent = await fs.readFile(globalsPath, "utf8");
    globalsContent = updateVar(globalsContent, '@theme inline', '--font-heading', `var(--font-heading, ${headingFont})`);
    globalsContent = updateVar(globalsContent, '@theme inline', '--font-sans', `var(--font-sans, ${bodyFont})`);
    await fs.writeFile(globalsPath, globalsContent, "utf8");

    return NextResponse.json({ success: true, message: "Theme updated successfully" });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
