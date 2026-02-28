const { mermaidToExcalidraw } = require('@excalidraw/mermaid-to-excalidraw');
const fs = require('fs');

const mermaidCode = `
flowchart TD
    A[Inicio proceso] --> B[Registro cliente]
    B --> C[Análisis riesgo]
    C --> D{Cumple requisitos?}
    D -- Sí --> E[Generar cotización]
    D -- No --> F[Notificar rechazo]
    E --> G[Enviar al cliente]
`;

async function test() {
    try {
        console.log('Converting Mermaid to Excalidraw...');
        const result = await mermaidToExcalidraw(mermaidCode);
        
        // Save JSON
        const jsonPath = '/tmp/test.excalidraw.json';
        fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
        console.log('JSON saved to:', jsonPath);
        
        // Show basic info
        console.log('Elements:', result.elements?.length || 0);
        console.log('Files:', result.files?.length || 0);
        
        return jsonPath;
    } catch (error) {
        console.error('Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

test();