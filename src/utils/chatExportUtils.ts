import jsPDF from 'jspdf';

interface ParsedTable {
  title: string;
  headers: string[];
  rows: string[][];
}

/**
 * Parse markdown content to extract tables with their section headers
 */
function parseMarkdownTables(markdown: string): { tables: ParsedTable[]; textSections: string[] } {
  const lines = markdown.split('\n');
  const tables: ParsedTable[] = [];
  const textSections: string[] = [];
  let currentTitle = 'Data';
  let currentHeaders: string[] = [];
  let currentRows: string[][] = [];
  let inTable = false;
  let headerParsed = false;
  let textBuffer = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // Track section headers
    if (trimmed.startsWith('#')) {
      if (inTable && currentHeaders.length > 0) {
        tables.push({ title: currentTitle, headers: currentHeaders, rows: currentRows });
        currentHeaders = [];
        currentRows = [];
        inTable = false;
        headerParsed = false;
      }
      if (textBuffer.trim()) {
        textSections.push(textBuffer.trim());
        textBuffer = '';
      }
      currentTitle = trimmed.replace(/^#+\s*/, '');
      textBuffer += trimmed + '\n';
      continue;
    }

    // Detect table rows
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1).map(c => c.trim());

      // Skip separator row (|---|---|)
      if (cells.every(c => /^[-:\s]+$/.test(c))) {
        headerParsed = true;
        continue;
      }

      if (!inTable) {
        inTable = true;
        currentHeaders = cells;
        headerParsed = false;
      } else if (headerParsed) {
        currentRows.push(cells);
      }
    } else {
      if (inTable && currentHeaders.length > 0) {
        tables.push({ title: currentTitle, headers: currentHeaders, rows: currentRows });
        currentHeaders = [];
        currentRows = [];
        inTable = false;
        headerParsed = false;
      }
      textBuffer += trimmed + '\n';
    }
  }

  // Flush remaining table
  if (inTable && currentHeaders.length > 0) {
    tables.push({ title: currentTitle, headers: currentHeaders, rows: currentRows });
  }
  if (textBuffer.trim()) {
    textSections.push(textBuffer.trim());
  }

  return { tables, textSections };
}

/**
 * Download content as CSV/Excel file
 */
export function downloadAsExcel(markdown: string, filename = 'portiq-export') {
  const { tables } = parseMarkdownTables(markdown);

  if (tables.length === 0) {
    // No tables found - export raw text as single-column CSV
    const blob = new Blob([markdown], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, `${filename}.csv`);
    return;
  }

  // For multiple tables, create separate CSV files or a combined one
  if (tables.length === 1) {
    const csv = tableToCsv(tables[0]);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, `${filename}.csv`);
  } else {
    // Combined CSV with sheet separators
    let combined = '';
    tables.forEach((table, i) => {
      if (i > 0) combined += '\n\n';
      combined += `"${table.title}"\n`;
      combined += tableToCsv(table);
    });
    const blob = new Blob(['\ufeff' + combined], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, `${filename}.csv`);
  }
}

function tableToCsv(table: ParsedTable): string {
  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
  const headerRow = table.headers.map(escape).join(',');
  const dataRows = table.rows.map(row => row.map(escape).join(','));
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download content as professional PDF
 */
export function downloadAsPdf(markdown: string, filename = 'portiq-report') {
  const { tables, textSections } = parseMarkdownTables(markdown);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  // Colors
  const navy: [number, number, number] = [15, 23, 42];
  const gold: [number, number, number] = [196, 164, 105];
  const slate: [number, number, number] = [100, 116, 139];
  const white: [number, number, number] = [255, 255, 255];
  const lightGray: [number, number, number] = [248, 250, 252];

  // Header bar
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, 18, 'F');
  doc.setFillColor(...gold);
  doc.rect(0, 18, pageWidth, 1.5, 'F');

  doc.setTextColor(...white);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Collaborative for Frontier Finance', margin, 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`PortIQ Report  •  ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth - margin, 12, { align: 'right' });

  y = 25;

  // Extract title from markdown
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    doc.setTextColor(...navy);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(titleMatch[1], margin, y);
    y += 8;

    // Gold underline
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + 60, y);
    y += 6;
  }

  // Helper: add new page with header
  const addPage = () => {
    doc.addPage();
    doc.setFillColor(...navy);
    doc.rect(0, 0, pageWidth, 12, 'F');
    doc.setFillColor(...gold);
    doc.rect(0, 12, pageWidth, 0.8, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('CFF PortIQ Report', margin, 8);
    doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin, 8, { align: 'right' });
    y = 18;
  };

  // Render text sections (simplified - just key paragraphs)
  const renderText = (text: string) => {
    const cleanLines = text.split('\n').filter(l => l.trim() && !l.startsWith('#'));
    for (const line of cleanLines) {
      if (y > pageHeight - 20) addPage();
      
      const clean = line.replace(/\*\*/g, '').replace(/\*/g, '').replace(/^[-•]\s*/, '  • ');
      doc.setTextColor(...slate);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const splitLines = doc.splitTextToSize(clean, contentWidth);
      doc.text(splitLines, margin, y);
      y += splitLines.length * 4 + 1;
    }
  };

  // Render tables
  const renderTable = (table: ParsedTable) => {
    if (y > pageHeight - 40) addPage();

    // Table title
    doc.setTextColor(...navy);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(table.title, margin, y);
    y += 6;

    const cols = table.headers.length;
    const colWidth = Math.min(contentWidth / cols, 50);
    const tableWidth = colWidth * cols;
    const cellPadding = 2;
    const fontSize = Math.min(7, 50 / cols);

    // Header row
    doc.setFillColor(...navy);
    doc.rect(margin, y, tableWidth, 7, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'bold');
    table.headers.forEach((header, i) => {
      const cellX = margin + i * colWidth + cellPadding;
      const truncated = header.length > (colWidth / 2) ? header.substring(0, Math.floor(colWidth / 2)) + '…' : header;
      doc.text(truncated, cellX, y + 5);
    });
    y += 7;

    // Data rows
    table.rows.forEach((row, rowIdx) => {
      if (y > pageHeight - 15) {
        addPage();
        // Re-draw header on new page
        doc.setFillColor(...navy);
        doc.rect(margin, y, tableWidth, 7, 'F');
        doc.setTextColor(...white);
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', 'bold');
        table.headers.forEach((header, i) => {
          const cellX = margin + i * colWidth + cellPadding;
          const truncated = header.length > (colWidth / 2) ? header.substring(0, Math.floor(colWidth / 2)) + '…' : header;
          doc.text(truncated, cellX, y + 5);
        });
        y += 7;
      }

      const bgColor = rowIdx % 2 === 0 ? white : lightGray;
      doc.setFillColor(...bgColor);
      doc.rect(margin, y, tableWidth, 6, 'F');

      // Row border
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.1);
      doc.line(margin, y + 6, margin + tableWidth, y + 6);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');
      row.forEach((cell, i) => {
        const cellX = margin + i * colWidth + cellPadding;
        const maxChars = Math.floor(colWidth / (fontSize * 0.35));
        const truncated = cell.length > maxChars ? cell.substring(0, maxChars - 1) + '…' : cell;
        doc.text(truncated, cellX, y + 4);
      });
      y += 6;
    });

    y += 6;
  };

  // Render all content
  let tableIdx = 0;
  const allContent = markdown.split('\n');
  let currentText = '';

  for (const line of allContent) {
    if (line.trim().startsWith('|') && tableIdx < tables.length) {
      if (currentText.trim()) {
        renderText(currentText);
        currentText = '';
      }
      // Find and render the next table
      renderTable(tables[tableIdx]);
      // Skip all table lines
      tableIdx++;
      // Skip until end of this table in source
      continue;
    }
    if (!(line.trim().startsWith('|') || (line.trim().match(/^\|[-:\s|]+\|$/)))) {
      currentText += line + '\n';
    }
  }
  if (currentText.trim()) renderText(currentText);

  // Footer on last page
  const footerY = pageHeight - 8;
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);
  doc.setTextColor(...slate);
  doc.setFontSize(7);
  doc.text('Generated by PortIQ  •  Collaborative for Frontier Finance  •  Confidential', pageWidth / 2, footerY, { align: 'center' });

  doc.save(`${filename}.pdf`);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
