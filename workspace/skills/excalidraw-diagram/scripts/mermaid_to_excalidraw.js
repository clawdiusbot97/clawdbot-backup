#!/usr/bin/env node
/**
 * Convert Mermaid code to Excalidraw JSON
 * Usage: node mermaid_to_excalidraw.js <input.mmd> <output.json>
 */

const fs = require('fs');
const path = require('path');

// Load the installed module
const modulePath = '/home/manpac/.npm-global/lib/node_modules/@excalidraw/mermaid-to-excalidraw';
let mermaidToExcalidraw;
try {
  mermaidToExcalidraw = require(modulePath).mermaidToExcalidraw;
} catch (err) {
  console.error('Failed to load @excalidraw/mermaid-to-excalidraw:', err.message);
  console.error('Make sure it is installed globally: npm install -g @excalidraw/mermaid-to-excalidraw');
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node mermaid_to_excalidraw.js <input.mmd> <output.json>');
    console.log('   or: node mermaid_to_excalidraw.js --stdin <output.json>');
    process.exit(1);
  }
  
  let mermaidCode;
  if (args[0] === '--stdin') {
    // Read from stdin
    mermaidCode = fs.readFileSync(0, 'utf8');
    outputPath = args[1];
  } else {
    const inputPath = args[0];
    outputPath = args[1];
    mermaidCode = fs.readFileSync(inputPath, 'utf8');
  }
  
  try {
    console.error('Converting Mermaid to Excalidraw...');
    const result = await mermaidToExcalidraw(mermaidCode);
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (outputDir && !fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.error(`✅ Excalidraw JSON saved to: ${outputPath}`);
    console.error(`   Elements: ${result.elements?.length || 0}`);
    console.error(`   Files: ${result.files?.length || 0}`);
    
    // Also output path for piping
    console.log(outputPath);
  } catch (error) {
    console.error('❌ Conversion failed:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { mermaidToExcalidraw };