#!/usr/bin/env node
/**
 * Convert Mermaid to Excalidraw JSON (ES module compatible)
 */

import { parseMermaidToExcalidraw } from '/home/manpac/.npm-global/lib/node_modules/@excalidraw/mermaid-to-excalidraw/dist/index.js';

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('Usage: node convert_mermaid.mjs <input.mmd> <output.json>');
        process.exit(1);
    }
    
    const inputPath = args[0];
    const outputPath = args[1];
    
    // Read Mermaid
    const fs = await import('fs');
    const mermaidCode = fs.readFileSync(inputPath, 'utf8');
    
    try {
        console.error('Converting Mermaid to Excalidraw...');
        const result = await parseMermaidToExcalidraw(mermaidCode);
        
        // Ensure output directory exists
        const path = await import('path');
        const outputDir = path.dirname(outputPath);
        if (outputDir && !fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Write JSON
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
        console.error(`✅ Excalidraw JSON saved to: ${outputPath}`);
        console.error(`   Elements: ${result.elements?.length || 0}`);
        console.error(`   Files: ${Object.keys(result.files || {}).length}`);
        
        // Output path for piping
        console.log(outputPath);
    } catch (error) {
        console.error('❌ Conversion failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});