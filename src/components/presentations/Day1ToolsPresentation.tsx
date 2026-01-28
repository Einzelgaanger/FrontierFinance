import { jsPDF } from 'jspdf';

// CFF Brand Colors - Updated
const BRAND = {
  navy: '#28098d',      // Primary navy blue
  gold: '#f8b521',      // Primary gold/yellow
  white: '#ffffff',     // White
  lightGold: '#fef9e7', // Light gold background
  darkNavy: '#1e0758',  // Darker navy for contrast
  lightNavy: '#e8e5f5', // Light navy background
};

// Helper function to convert hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Helper function to add logo
const addLogo = async (doc: jsPDF, x: number, y: number, width: number = 60) => {
  try {
    const logoPath = '/CCF_ColorLogoHorizontal (1).png';
    const img = new Image();
    img.src = logoPath;
    
    await new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          const height = (img.height / img.width) * width;
          doc.addImage(img, 'PNG', x, y, width, height);
          resolve(true);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = reject;
    });
  } catch (e) {
    // Fallback: Draw text logo if image fails
    doc.setFontSize(16);
    doc.setTextColor(hexToRgb(BRAND.navy)!.r, hexToRgb(BRAND.navy)!.g, hexToRgb(BRAND.navy)!.b);
    doc.text('CFF', x, y + 5);
  }
};

// Helper function to draw icon shapes
const drawIcon = (doc: jsPDF, iconType: string, x: number, y: number, size: number = 8) => {
  const navy = hexToRgb(BRAND.navy)!;
  const gold = hexToRgb(BRAND.gold)!;
  
  switch (iconType) {
    case 'check':
      // Checkmark
      doc.setDrawColor(navy.r, navy.g, navy.b);
      doc.setLineWidth(1.5);
      doc.line(x, y + size/2, x + size/3, y + size);
      doc.line(x + size/3, y + size, x + size, y);
      break;
    case 'star':
      // Star shape
      doc.setFillColor(gold.r, gold.g, gold.b);
      doc.circle(x + size/2, y + size/2, size/2, 'F');
      break;
    case 'arrow':
      // Right arrow
      doc.setDrawColor(navy.r, navy.g, navy.b);
      doc.setLineWidth(1.5);
      doc.line(x, y + size/2, x + size * 0.7, y + size/2);
      doc.line(x + size * 0.7, y + size/2, x + size * 0.5, y);
      doc.line(x + size * 0.7, y + size/2, x + size * 0.5, y + size);
      break;
    case 'circle':
      doc.setFillColor(gold.r, gold.g, gold.b);
      doc.circle(x + size/2, y + size/2, size/2, 'F');
      break;
    case 'square':
      doc.setFillColor(navy.r, navy.g, navy.b);
      doc.roundedRect(x, y, size, size, 1, 1, 'F');
      break;
  }
};

export const generateDay1Presentation = async () => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const margin = 20;
  const navy = hexToRgb(BRAND.navy)!;
  const gold = hexToRgb(BRAND.gold)!;

  // Enhanced slide function with brand colors
  const addSlide = (slideNumber: number) => {
    if (slideNumber > 1) doc.addPage();
    
    // White background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Top accent bar - Navy
    doc.setFillColor(navy.r, navy.g, navy.b);
    doc.rect(0, 0, pageWidth, 10, 'F');
    
    // Bottom accent bar - Gold
    doc.setFillColor(gold.r, gold.g, gold.b);
    doc.rect(0, pageHeight - 6, pageWidth, 6, 'F');
    
    // Decorative gold line under top bar
    doc.setFillColor(gold.r, gold.g, gold.b);
    doc.rect(0, 10, pageWidth, 2, 'F');
    
    // Slide number with brand styling
    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.text(`${slideNumber}`, pageWidth - 15, pageHeight - 12);
  };

  const drawBox = (x: number, y: number, w: number, h: number, fillColor: string, strokeColor?: string) => {
    const rgb = hexToRgb(fillColor);
    if (rgb) {
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
      if (strokeColor) {
        const strokeRgb = hexToRgb(strokeColor);
        if (strokeRgb) {
          doc.setDrawColor(strokeRgb.r, strokeRgb.g, strokeRgb.b);
          doc.setLineWidth(0.5);
          doc.roundedRect(x, y, w, h, 4, 4, 'FD');
        } else {
          doc.roundedRect(x, y, w, h, 4, 4, 'F');
        }
      } else {
        doc.roundedRect(x, y, w, h, 4, 4, 'F');
      }
    }
  };

  // ============= SLIDE 1: Title Slide =============
  addSlide(1);
  
  // Navy background section
  doc.setFillColor(navy.r, navy.g, navy.b);
  doc.rect(0, 12, pageWidth, pageHeight * 0.65, 'F');
  
  // Add logo at top
  try {
    await addLogo(doc, margin, 18, 50);
  } catch {
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('CFF', margin, 25);
  }
  
  // Gold decorative element
  doc.setFillColor(gold.r, gold.g, gold.b);
  doc.rect(margin, 30, 8, 2, 'F');
  
  // Main title - White text
  doc.setFontSize(44);
  doc.setTextColor(255, 255, 255);
  doc.text('CFF Tools, Website &', margin, 60);
  doc.text('Team Efficiency', margin, 85);
  
  // Subtitle - Gold accent
  doc.setFontSize(18);
  doc.setTextColor(gold.r, gold.g, gold.b);
  doc.text('Session 3 | Day 1', margin, 105);
  
  // Bottom section - White background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, pageHeight * 0.65 + 12, pageWidth, pageHeight * 0.35 - 12, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('2026 Planning Meeting', margin, pageHeight - 50);
  doc.text('29th January 2026 | Fair Acres Nairobi', margin, pageHeight - 38);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Presented by: Allie & Alfred', margin, pageHeight - 26);

  // ============= SLIDE 2: Agenda Overview =============
  addSlide(2);
  
  // Add logo
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {
    // Fallback
  }
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Session Agenda', margin, 50);
  
  // Gold underline
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 70, 53);
  
  const agendaItems = [
    { num: '01', icon: 'check', title: 'Current Tools Assessment', desc: 'Are our tools meeting team needs?' },
    { num: '02', icon: 'star', title: 'Website Effectiveness', desc: 'Value delivery & user experience' },
    { num: '03', icon: 'arrow', title: 'Productivity Analysis', desc: 'Bottlenecks & process improvements' },
    { num: '04', icon: 'circle', title: 'Platform Capabilities', desc: 'What we\'ve already built' },
    { num: '05', icon: 'square', title: 'Discussion & Feedback', desc: 'Open floor for team input' },
  ];
  
  let yPos = 65;
  agendaItems.forEach((item) => {
    // Navy number box with gold accent
    drawBox(margin, yPos, 14, 22, BRAND.navy);
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text(item.num, margin + 4, yPos + 14);
    
    // Gold accent dot
    doc.setFillColor(gold.r, gold.g, gold.b);
    doc.circle(margin + 7, yPos + 19, 1.5, 'F');
    
    // Icon
    drawIcon(doc, item.icon, margin + 20, yPos + 2, 10);
    
    doc.setFontSize(16);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text(item.title, margin + 33, yPos + 10);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(item.desc, margin + 33, yPos + 18);
    
    yPos += 28;
  });

  // ============= SLIDE 3: Current Tools Landscape =============
  addSlide(3);
  
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {}
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Current Tools Landscape', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 90, 53);
  
  const tools = [
    { name: 'Slack', status: 'In Use', usage: 'Team communication', icon: 'check' },
    { name: 'HubSpot', status: 'Underutilized', usage: 'CRM & contacts', icon: 'circle' },
    { name: 'MailChimp', status: 'In Use', usage: 'Email campaigns', icon: 'check' },
    { name: 'Dropbox', status: 'In Use', usage: 'File storage', icon: 'check' },
    { name: 'Google Workspace', status: 'Underutilized', usage: 'Collaboration', icon: 'circle' },
    { name: 'ESCP Platform', status: 'Active', usage: 'Fund Manager Portal', icon: 'star' },
  ];
  
  const colWidth = (pageWidth - margin * 2 - 20) / 3;
  let col = 0;
  let row = 0;
  
  tools.forEach((tool, idx) => {
    const x = margin + (col * (colWidth + 10));
    const y = 65 + (row * 42);
    
    const bgColor = tool.status === 'Underutilized' ? BRAND.lightGold : BRAND.lightNavy;
    const borderColor = tool.status === 'Underutilized' ? BRAND.gold : BRAND.navy;
    drawBox(x, y, colWidth, 36, bgColor, borderColor);
    
    // Icon
    drawIcon(doc, tool.icon, x + 8, y + 6, 8);
    
    doc.setFontSize(14);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text(tool.name, x + 20, y + 12);
    
    const statusColor = tool.status === 'Underutilized' ? BRAND.gold : '#059669';
    const statusRgb = hexToRgb(statusColor)!;
    doc.setFontSize(9);
    doc.setTextColor(statusRgb.r, statusRgb.g, statusRgb.b);
    doc.text(tool.status.toUpperCase(), x + 8, y + 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(tool.usage, x + 8, y + 30);
    
    col++;
    if (col >= 3) {
      col = 0;
      row++;
    }
  });
  
  // Key question box - Navy with gold accent
  drawBox(margin, 155, pageWidth - margin * 2, 32, BRAND.navy);
  doc.setFillColor(gold.r, gold.g, gold.b);
  doc.rect(margin, 155, 4, 32, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('Key Question: Are use cases clearly defined? What gaps exist in functionality?', margin + 12, 175);

  // ============= SLIDE 4: Identified Gaps =============
  addSlide(4);
  
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {}
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Identified Gaps', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 60, 53);
  
  const gaps = [
    { icon: 'square', title: 'Cross-Project Visibility', desc: 'What\'s happening where, and when? Lack of unified view.' },
    { icon: 'circle', title: 'Structured Data Capture', desc: 'Data needs to feed learning, fundraising, and reporting systematically.' },
    { icon: 'arrow', title: 'Workflow Automation', desc: 'Repetitive tasks still done manually. Need lightweight automation.' },
    { icon: 'check', title: 'Tool Integration', desc: 'Workflows not clearly mapped. Tools don\'t talk to each other.' },
  ];
  
  yPos = 65;
  gaps.forEach((gap, idx) => {
    const bgColor = idx % 2 === 0 ? BRAND.lightNavy : BRAND.lightGold;
    drawBox(margin, yPos, pageWidth - margin * 2, 30, bgColor, BRAND.navy);
    
    // Icon in gold circle
    doc.setFillColor(gold.r, gold.g, gold.b);
    doc.circle(margin + 12, yPos + 15, 6, 'F');
    drawIcon(doc, gap.icon, margin + 8, yPos + 11, 8);
    
    doc.setFontSize(16);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text(gap.title, margin + 25, yPos + 14);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(gap.desc, margin + 25, yPos + 22);
    
    yPos += 36;
  });

  // ============= SLIDE 5: Website Assessment =============
  addSlide(5);
  
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {}
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Website Assessment', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 70, 53);
  
  const leftCol = margin;
  const rightCol = pageWidth / 2 + 10;
  
  // Current State - Light gold background
  drawBox(leftCol, 60, 130, 115, BRAND.lightGold, BRAND.gold);
  doc.setFontSize(16);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Current State', leftCol + 10, 75);
  
  // Gold underline
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(1);
  doc.line(leftCol + 10, 78, leftCol + 80, 78);
  
  const currentIssues = [
    '• Works as reference point only',
    '• Content not easy to find/update',
    '• Pages serve multiple audiences',
    '• No clear pathways for users',
    '• "Who we are" vs "How to engage"',
  ];
  
  doc.setFontSize(11);
  doc.setTextColor(navy.r, navy.g, navy.b);
  yPos = 88;
  currentIssues.forEach(issue => {
    drawIcon(doc, 'circle', leftCol + 10, yPos - 2, 4);
    doc.text(issue, leftCol + 18, yPos);
    yPos += 12;
  });
  
  // Target State - Light navy background
  drawBox(rightCol, 60, 130, 115, BRAND.lightNavy, BRAND.navy);
  doc.setFontSize(16);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Target State', rightCol + 10, 75);
  
  // Navy underline
  doc.setDrawColor(navy.r, navy.g, navy.b);
  doc.setLineWidth(1);
  doc.line(rightCol + 10, 78, rightCol + 80, 78);
  
  const targetState = [
    '• Platform, not just reference',
    '• Clear audience pathways',
    '• Better learning integration',
    '• Modular update capability',
    '• SEO & accessibility optimized',
  ];
  
  doc.setFontSize(11);
  doc.setTextColor(navy.r, navy.g, navy.b);
  yPos = 88;
  targetState.forEach(item => {
    drawIcon(doc, 'check', rightCol + 10, yPos - 2, 4);
    doc.text(item, rightCol + 18, yPos);
    yPos += 12;
  });
  
  // Metrics box - Navy with gold accent
  drawBox(margin, 180, pageWidth - margin * 2, 22, BRAND.navy);
  doc.setFillColor(gold.r, gold.g, gold.b);
  doc.rect(margin, 180, 4, 22, 'F');
  
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('Key Metrics: Engagement with key pages | Time on site | Referral traffic from events, partners, social', margin + 12, 194);

  // ============= SLIDE 6: Productivity Challenges =============
  addSlide(6);
  
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {}
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Productivity Challenges', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 80, 53);
  
  const challenges = [
    { title: 'Context Switching', impact: 'High', solution: 'Consolidated tools & dashboards', icon: 'arrow' },
    { title: 'Unclear Handoffs', impact: 'High', solution: 'Defined workflows & ownership', icon: 'check' },
    { title: 'Rebuilding Existing Work', impact: 'Medium', solution: 'Shared templates & documentation', icon: 'circle' },
    { title: 'Work in People\'s Heads', impact: 'High', solution: 'Documentation culture', icon: 'square' },
    { title: 'Too Many Channels', impact: 'Medium', solution: 'Channel consolidation', icon: 'circle' },
    { title: 'Undocumented Decisions', impact: 'High', solution: 'Decision logs & playbooks', icon: 'check' },
  ];
  
  // Table header - Navy
  drawBox(margin, 60, pageWidth - margin * 2, 14, BRAND.navy);
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('Challenge', margin + 10, 69);
  doc.text('Impact', margin + 120, 69);
  doc.text('Solution', margin + 160, 69);
  
  yPos = 78;
  challenges.forEach((ch, idx) => {
    const bgColor = idx % 2 === 0 ? BRAND.lightNavy : '#ffffff';
    drawBox(margin, yPos, pageWidth - margin * 2, 16, bgColor);
    
    // Icon
    drawIcon(doc, ch.icon, margin + 10, yPos + 4, 6);
    
    doc.setFontSize(10);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text(ch.title, margin + 20, yPos + 11);
    
    const impactColor = ch.impact === 'High' ? BRAND.gold : '#d97706';
    const impactRgb = hexToRgb(impactColor)!;
    doc.setTextColor(impactRgb.r, impactRgb.g, impactRgb.b);
    doc.text(ch.impact, margin + 120, yPos + 11);
    
    doc.setTextColor(100, 100, 100);
    doc.text(ch.solution, margin + 160, yPos + 11);
    
    yPos += 16;
  });

  // ============= SLIDE 7: What We've Built =============
  addSlide(7);
  
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {}
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('What We\'ve Already Built', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 90, 53);
  
  doc.setFontSize(14);
  doc.setTextColor(gold.r, gold.g, gold.b);
  doc.text('ESCP Fund Manager Portal - Live & Operational', margin, 65);
  
  const features = [
    { category: 'Authentication', items: ['Role-based access', 'Secure login', 'Password reset'], icon: 'check' },
    { category: 'Survey System', items: ['Multi-year (2021-2024)', '260+ responses', 'Auto-save'], icon: 'circle' },
    { category: 'Analytics', items: ['Visual dashboards', 'Cross-year comparison', 'Export capability'], icon: 'star' },
    { category: 'Network', items: ['Member directory', 'Profile management', 'Search & filter'], icon: 'square' },
    { category: 'AI Assistant', items: ['PortIQ chatbot', 'Data insights', 'Query support'], icon: 'arrow' },
    { category: 'Admin', items: ['User management', 'Application workflow', 'Bulk operations'], icon: 'check' },
  ];
  
  const boxWidth = (pageWidth - margin * 2 - 20) / 3;
  col = 0;
  row = 0;
  
  features.forEach((feat) => {
    const x = margin + (col * (boxWidth + 10));
    const y = 72 + (row * 52);
    
    drawBox(x, y, boxWidth, 46, BRAND.lightNavy, BRAND.navy);
    
    // Icon circle
    doc.setFillColor(gold.r, gold.g, gold.b);
    doc.circle(x + 10, y + 10, 5, 'F');
    drawIcon(doc, feat.icon, x + 7, y + 7, 6);
    
    doc.setFontSize(12);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text(feat.category, x + 20, y + 14);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    let itemY = y + 22;
    feat.items.forEach(item => {
      doc.text(`• ${item}`, x + 8, itemY);
      itemY += 8;
    });
    
    col++;
    if (col >= 3) {
      col = 0;
      row++;
    }
  });

  // ============= SLIDE 8: New Intelligent Features =============
  addSlide(8);
  
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {}
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('New Intelligent Features', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 80, 53);
  
  // AI Company Checker feature - Gold background
  drawBox(margin, 60, pageWidth - margin * 2, 58, BRAND.lightGold, BRAND.gold);
  
  doc.setFillColor(gold.r, gold.g, gold.b);
  doc.circle(margin + 12, 72, 6, 'F');
  drawIcon(doc, 'star', margin + 9, 69, 6);
  
  doc.setFontSize(16);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('AI-Powered Company Checker (New!)', margin + 22, 75);
  
  doc.setFontSize(11);
  doc.setTextColor(navy.r, navy.g, navy.b);
  const aiFeatures = [
    '• Automatically searches all survey years (2021-2024) for company matches',
    '• Fuzzy matching identifies similar company names across different surveys',
    '• Consolidates survey data under one email - solving the multi-email problem',
    '• Provides default credentials for returning members to access all their data',
  ];
  yPos = 88;
  aiFeatures.forEach(f => {
    doc.text(f, margin + 10, yPos);
    yPos += 10;
  });
  
  // DevTasks feature - Navy background
  drawBox(margin, 125, (pageWidth - margin * 2) / 2 - 5, 48, BRAND.lightNavy, BRAND.navy);
  
  doc.setFillColor(navy.r, navy.g, navy.b);
  doc.circle(margin + 12, 137, 5, 'F');
  drawIcon(doc, 'check', margin + 9, 134, 6);
  
  doc.setFontSize(14);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('DevTasks Dashboard', margin + 22, 140);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('• Feedback collection from all pages', margin + 10, 150);
  doc.text('• Priority & status tracking', margin + 10, 160);
  doc.text('• Admin-only secure access', margin + 10, 170);
  
  // Feedback Button feature - Gold background
  drawBox(pageWidth / 2 + 5, 125, (pageWidth - margin * 2) / 2 - 5, 48, BRAND.lightGold, BRAND.gold);
  
  doc.setFillColor(gold.r, gold.g, gold.b);
  doc.circle(pageWidth / 2 + 17, 137, 5, 'F');
  drawIcon(doc, 'circle', pageWidth / 2 + 14, 134, 6);
  
  doc.setFontSize(14);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Floating Feedback Button', pageWidth / 2 + 27, 140);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('• Available on every page', pageWidth / 2 + 15, 150);
  doc.text('• Captures page context automatically', pageWidth / 2 + 15, 160);
  doc.text('• Direct pipeline to DevTasks', pageWidth / 2 + 15, 170);

  // ============= SLIDE 9: How Technology Supports Strategy =============
  addSlide(9);
  
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {}
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('How Technology Supports Strategy', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 110, 53);
  
  const strategySupport = [
    { area: 'Fundraising', support: 'Data dashboards provide evidence of momentum; relationship tracking in CRM', icon: 'star' },
    { area: 'Partnerships', support: 'Narrative consistency through shared templates; engagement analytics', icon: 'check' },
    { area: 'Thought Leadership', support: 'Blog platform, learning hub content management, automated distribution', icon: 'circle' },
    { area: 'Network Engagement', support: 'Member directory, survey insights, peer connection facilitation', icon: 'square' },
    { area: 'Impact Reporting', support: 'Automated KPI tracking, visual reports, donor dashboard (planned)', icon: 'arrow' },
  ];
  
  yPos = 65;
  strategySupport.forEach((item, idx) => {
    const bgColor = idx % 2 === 0 ? BRAND.lightNavy : BRAND.lightGold;
    drawBox(margin, yPos, 65, 24, bgColor, BRAND.navy);
    
    // Icon
    drawIcon(doc, item.icon, margin + 8, yPos + 7, 8);
    
    doc.setFontSize(11);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text(item.area, margin + 20, yPos + 15);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(item.support, margin + 75, yPos + 15, { maxWidth: pageWidth - margin * 2 - 85 });
    
    yPos += 27;
  });

  // ============= SLIDE 10: Discussion Questions =============
  addSlide(10);
  
  // Navy background
  doc.setFillColor(navy.r, navy.g, navy.b);
  doc.rect(0, 12, pageWidth, pageHeight - 12, 'F');
  
  // Gold accent stripe
  doc.setFillColor(gold.r, gold.g, gold.b);
  doc.rect(0, 12, pageWidth, 4, 'F');
  
  try {
    await addLogo(doc, margin, 18, 40);
  } catch {}
  
  doc.setFontSize(36);
  doc.setTextColor(255, 255, 255);
  doc.text('Discussion Questions', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(3);
  doc.line(margin, 54, margin + 110, 54);
  
  const questions = [
    '1. Which tools should we prioritize configuring vs. replacing?',
    '2. What workflows need to be mapped before we can improve integration?',
    '3. How can the platform better support your daily work?',
    '4. What training or resources would help the team work more efficiently?',
    '5. How do we measure and track team performance effectively?',
  ];
  
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  yPos = 75;
  questions.forEach((q, idx) => {
    // Gold number circle
    doc.setFillColor(gold.r, gold.g, gold.b);
    doc.circle(margin + 8, yPos - 2, 6, 'F');
    doc.setFontSize(12);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text((idx + 1).toString(), margin + 5, yPos + 1);
    
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(q.substring(3), margin + 20, yPos);
    yPos += 20;
  });
  
  // Footer - Gold accent
  doc.setFillColor(gold.r, gold.g, gold.b);
  doc.rect(margin, pageHeight - 30, pageWidth - margin * 2, 2, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(gold.r, gold.g, gold.b);
  doc.text('Focus: Cycle time | Rework | Bottlenecks — Not individual output volume', margin, pageHeight - 20);

  // ============= SLIDE 11: Thank You =============
  addSlide(11);
  
  // Navy background
  doc.setFillColor(navy.r, navy.g, navy.b);
  doc.rect(0, 12, pageWidth, pageHeight * 0.7, 'F');
  
  // Gold decorative elements
  doc.setFillColor(gold.r, gold.g, gold.b);
  doc.rect(0, 12, pageWidth, 4, 'F');
  doc.rect(pageWidth / 2 - 30, 50, 60, 4, 'F');
  
  try {
    await addLogo(doc, pageWidth / 2 - 25, 20, 50);
  } catch {}
  
  doc.setFontSize(52);
  doc.setTextColor(255, 255, 255);
  doc.text('Thank You', pageWidth / 2, 90, { align: 'center' });
  
  doc.setFontSize(20);
  doc.setTextColor(gold.r, gold.g, gold.b);
  doc.text('Questions & Discussion', pageWidth / 2, 110, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(220, 220, 220);
  doc.text('Session 3 | Day 1 - CFF Tools, Website & Team Efficiency', pageWidth / 2, pageHeight - 50, { align: 'center' });
  doc.text('29th January 2026', pageWidth / 2, pageHeight - 38, { align: 'center' });

  // Save the PDF
  doc.save('CFF_Day1_Tools_Website_Efficiency_Presentation.pdf');
};
