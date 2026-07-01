const fs = require('fs');
const path = require('path');

// Um parser markdown extremamente básico em vanilla JS para não precisar instalar nenhum pacote pesado.
// Ele lida com títulos, listas, tabelas básicas, negrito, blocos de código e parágrafos.
function simpleMarkdownToHtml(md) {
  let html = md;

  // Substitui quebras de linha do Windows
  html = html.replace(/\r\n/g, '\n');

  // Blocos de código ```ts ... ```
  html = html.replace(/```(?:ts|typescript|json|env|sql|bash|yaml)?\n([\s\S]*?)\n```/g, (match, code) => {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre style="background: #f4f4f4; border: 1px solid #ddd; padding: 15px; font-family: Consolas, monospace; overflow-x: auto; font-size: 11pt; margin: 15px 0;"><code>${escapedCode}</code></pre>`;
  });

  // Códigos inline `code`
  html = html.replace(/`([^`\n]+)`/g, '<code style="background: #f4f4f4; padding: 2px 5px; font-family: Consolas, monospace;">$1</code>');

  // Títulos # H1, ## H2, ### H3, #### H4
  html = html.replace(/^# (.*?)$/gm, '<h1 style="color: #2F5496; font-family: Calibri, sans-serif; border-bottom: 1px solid #2F5496; padding-bottom: 5px; margin-top: 24pt;">$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2 style="color: #2F5496; font-family: Calibri, sans-serif; margin-top: 18pt;">$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3 style="color: #1F3763; font-family: Calibri, sans-serif; margin-top: 14pt;">$1</h3>');
  html = html.replace(/^#### (.*?)$/gm, '<h4 style="color: #1F3763; font-family: Calibri, sans-serif; font-style: italic; margin-top: 12pt;">$1</h4>');

  // Negrito **bold**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Tabelas
  // Esta regex detecta blocos de tabelas em markdown e converte para HTML
  const lines = html.split('\n');
  let inTable = false;
  let tableRows = [];
  let processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      // Ignora a linha divisória |---|---|
      if (!line.includes('---')) {
        const cells = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
        tableRows.push(cells);
      }
    } else {
      if (inTable) {
        inTable = false;
        let tableHtml = '<table style="border-collapse: collapse; width: 100%; margin: 20px 0; font-size: 11pt; font-family: Calibri, sans-serif;">';
        tableRows.forEach((row, rIdx) => {
          tableHtml += '<tr>';
          row.forEach(cell => {
            const tag = rIdx === 0 ? 'th' : 'td';
            const style = rIdx === 0 
              ? 'background-color: #2F5496; color: white; border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: bold;'
              : 'border: 1px solid #ddd; padding: 8px; text-align: left;';
            tableHtml += `<${tag} style="${style}">${cell}</${tag}>`;
          });
          tableHtml += '</tr>';
        });
        tableHtml += '</table>';
        processedLines.push(tableHtml);
      }
      processedLines.push(lines[i]);
    }
  }
  html = processedLines.join('\n');

  // Listas não ordenadas - (linhas começando com "- ")
  html = html.replace(/^\- (.*?)$/gm, '<li style="margin-left: 20px; font-family: Calibri, sans-serif;">$1</li>');
  // Envolve grupos de <li> em <ul>
  html = html.replace(/((?:<li style="margin-left: 20px; font-family: Calibri, sans-serif;">.*?<\/li>\n?)+)/g, '<ul style="margin-bottom: 12pt;">$1</ul>');

  // Listas ordenadas (ex: 1. item)
  html = html.replace(/^\d+\.\s(.*?)$/gm, '<li style="margin-left: 20px; font-family: Calibri, sans-serif;">$1</li>');
  html = html.replace(/((?:<li style="margin-left: 20px; font-family: Calibri, sans-serif;">.*?<\/li>\n?)+)/g, '<ol style="margin-bottom: 12pt;">$1</ol>');

  // Linhas horizontais ---
  html = html.replace(/^---$/gm, '<hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;" />');

  // Parágrafos (linhas não vazias que não começam com tags HTML)
  const finalLines = html.split('\n');
  for (let i = 0; i < finalLines.length; i++) {
    const line = finalLines[i].trim();
    if (line && 
        !line.startsWith('<h') && 
        !line.startsWith('<ul') && 
        !line.startsWith('<ol') && 
        !line.startsWith('<li') && 
        !line.startsWith('<pre') && 
        !line.startsWith('<code') && 
        !line.startsWith('</pre') && 
        !line.startsWith('</code') && 
        !line.startsWith('<table') && 
        !line.startsWith('</table') && 
        !line.startsWith('<tr') && 
        !line.startsWith('</tr') && 
        !line.startsWith('<td') && 
        !line.startsWith('<th') && 
        !line.startsWith('<hr')) {
      finalLines[i] = `<p style="margin-bottom: 10pt; text-align: justify; font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.5;">${finalLines[i]}</p>`;
    }
  }
  
  return finalLines.join('\n');
}

try {
  const mdPath = path.join(__dirname, '..', 'relatorio_tecnico.md');
  const htmlPath = path.join(__dirname, '..', 'relatorio_tecnico.html');
  
  if (!fs.existsSync(mdPath)) {
    console.error("Erro: arquivo relatorio_tecnico.md não encontrado.");
    process.exit(1);
  }

  const markdown = fs.readFileSync(mdPath, 'utf8');
  
  const bodyContent = simpleMarkdownToHtml(markdown);

  const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Relatório Técnico - pgvector</title>
</head>
<body style="padding: 40px; max-width: 800px; margin: 0 auto; font-family: Calibri, sans-serif;">
  ${bodyContent}
</body>
</html>`;

  fs.writeFileSync(htmlPath, htmlTemplate, 'utf8');
  console.log("Sucesso: relatorio_tecnico.html foi gerado na raiz do projeto!");
} catch (err) {
  console.error("Erro durante a conversão:", err);
}
