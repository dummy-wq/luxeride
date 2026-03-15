const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const globalsPath = path.join(__dirname, '../app/globals.css');

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('\n🎨 \x1b[1m\x1b[36mWelcome to the LuxeRide Theme & Font Wizard\x1b[0m');
  console.log('This script will help you update your brand identity across colors and typography.\n');

  try {
    // 1. Gather Light Mode Colors
    console.log('\x1b[33m[1/3] LIGHT MODE COLORS\x1b[0m');
    const lightPrimary = await question('   Enter Primary Brand Color (Hex, e.g. #af3a03): ') || '#af3a03';
    const lightBg = await question('   Enter Background Color (Hex, default #f9f5d7): ') || '#f9f5d7';

    // 2. Gather Dark Mode Colors
    console.log('\n\x1b[33m[2/3] DARK MODE COLORS\x1b[0m');
    const darkPrimary = await question('   Enter Primary Brand Color (Hex, e.g. #a6a922): ') || '#a6a922';
    const darkBg = await question('   Enter Background Color (Hex, default #141311): ') || '#141311';

    // 3. Gather Typograpy
    console.log('\n\x1b[33m[3/3] TYPOGRAPHY\x1b[0m');
    console.log('   (Paste the full font family string from the Theme Designer)');
    const headingFont = await question('   Enter Heading Font Family: ') || "'Montserrat', sans-serif";
    const bodyFont = await question('   Enter Body/Sans Font Family: ') || "'Inter', sans-serif";

    console.log('\n🚀 Processing styles and updating globals.css...');

    let content = fs.readFileSync(globalsPath, 'utf8');

    // Update Light Mode (:root)
    content = updateVariable(content, ':root', '--primary', lightPrimary);
    content = updateVariable(content, ':root', '--background', lightBg);
    content = updateVariable(content, ':root', '--ring', lightPrimary);
    
    // Update Dark Mode (.dark)
    content = updateVariable(content, '.dark', '--primary', darkPrimary);
    content = updateVariable(content, '.dark', '--background', darkBg);
    content = updateVariable(content, '.dark', '--ring', darkPrimary);

    // Update Global Fonts
    content = updateVariable(content, '@theme inline', '--font-heading', headingFont);
    content = updateVariable(content, '@theme inline', '--font-sans', bodyFont);

    fs.writeFileSync(globalsPath, content);

    console.log('\n\x1b[32m✨ Success! Your brand identity has been updated.\x1b[0m');
    console.log('Run \x1b[1mnpm run dev\x1b[0m to see the changes.\n');

  } catch (err) {
    console.error('\n❌ An error occurred:', err.message);
  } finally {
    rl.close();
  }
}

/**
 * Helper to update a single CSS variable within a specific block
 */
function updateVariable(content, blockSelector, variable, newValue) {
  // Special handling for @theme inline because of its structure
  const isThemeBlock = blockSelector.includes('@theme');
  const selectorEscaped = blockSelector.replace('.', '\\.').replace('@', '\\@');
  const blockRegex = new RegExp(`${selectorEscaped}\\s*{([^}]*)}`, 's');
  
  const match = content.match(blockRegex);
  
  if (!match) return content;

  let blockContent = match[1];
  
  // Regex to find the variable (handles both direct assignment and var() defaults)
  // We want to replace the entire value part of the declaration
  const varRegex = new RegExp(`${variable}:\\s*[^;]+;`, 'g');
  const newDeclaration = `${variable}: ${newValue};`;
  
  if (varRegex.test(blockContent)) {
    blockContent = blockContent.replace(varRegex, newDeclaration);
  } else {
    // If variable doesn't exist, append it
    blockContent += `\n  ${newDeclaration}`;
  }

  return content.replace(match[1], blockContent);
}

main();
