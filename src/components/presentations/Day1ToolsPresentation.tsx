import { jsPDF } from 'jspdf';

// CFF Brand Colors
const BRAND = {
  navy: '#1a1a1a',
  gold: '#f5f5dc',
  accent: '#dc2626',
  lightGray: '#f8f9fa',
  darkGray: '#374151',
  blue: '#1e40af',
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

  // Helper functions
  const addSlide = (slideNumber: number) => {
    if (slideNumber > 1) doc.addPage();
    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    // Top accent bar
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, pageWidth, 8, 'F');
    // Bottom accent
    doc.setFillColor(220, 38, 38);
    doc.rect(0, pageHeight - 4, pageWidth, 4, 'F');
    // Slide number
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`${slideNumber}`, pageWidth - 15, pageHeight - 10);
  };

  const drawBox = (x: number, y: number, w: number, h: number, fillColor: string) => {
    const rgb = hexToRgb(fillColor);
    if (rgb) {
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
      doc.roundedRect(x, y, w, h, 3, 3, 'F');
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // ============= SLIDE 1: Title Slide =============
  addSlide(1);
  
  // Large title area
  doc.setFillColor(26, 26, 26);
  doc.rect(0, 0, pageWidth, pageHeight * 0.6, 'F');
  
  // CFF Logo placeholder text
  doc.setFontSize(14);
  doc.setTextColor(245, 245, 220);
  doc.text('CFF', margin, 30);
  doc.setFontSize(10);
  doc.text('Collaborative for Frontier Finance', margin, 38);
  
  // Main title
  doc.setFontSize(42);
  doc.setTextColor(255, 255, 255);
  doc.text('CFF Tools, Website &', margin, 75);
  doc.text('Team Efficiency', margin, 95);
  
  // Subtitle
  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38);
  doc.text('Session 3 | Day 1', margin, 115);
  
  // Bottom section
  doc.setFontSize(14);
  doc.setTextColor(55, 65, 81);
  doc.text('2026 Planning Meeting', margin, pageHeight - 40);
  doc.text('29th January 2026 | Fair Acres Nairobi', margin, pageHeight - 30);
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Presented by: Allie & Alfred', margin, pageHeight - 18);

  // ============= SLIDE 2: Agenda Overview =============
  addSlide(2);
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('Session Agenda', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(1);
  doc.line(margin, 40, margin + 60, 40);
  
  const agendaItems = [
    { num: '01', title: 'Current Tools Assessment', desc: 'Are our tools meeting team needs?' },
    { num: '02', title: 'Website Effectiveness', desc: 'Value delivery & user experience' },
    { num: '03', title: 'Productivity Analysis', desc: 'Bottlenecks & process improvements' },
    { num: '04', title: 'Platform Capabilities', desc: 'What we\'ve already built' },
    { num: '05', title: 'Discussion & Feedback', desc: 'Open floor for team input' },
  ];
  
  let yPos = 55;
  agendaItems.forEach((item) => {
    drawBox(margin, yPos, 12, 20, '#dc2626');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(item.num, margin + 3, yPos + 13);
    
    doc.setFontSize(16);
    doc.setTextColor(26, 26, 26);
    doc.text(item.title, margin + 20, yPos + 8);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(item.desc, margin + 20, yPos + 16);
    
    yPos += 28;
  });

  // ============= SLIDE 3: Current Tools Landscape =============
  addSlide(3);
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('Current Tools Landscape', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, 40, margin + 80, 40);
  
  // Current tools grid
  const tools = [
    { name: 'Slack', status: 'In Use', usage: 'Team communication' },
    { name: 'HubSpot', status: 'Underutilized', usage: 'CRM & contacts' },
    { name: 'MailChimp', status: 'In Use', usage: 'Email campaigns' },
    { name: 'Dropbox', status: 'In Use', usage: 'File storage' },
    { name: 'Google Workspace', status: 'Underutilized', usage: 'Collaboration' },
    { name: 'ESCP Platform', status: 'Active', usage: 'Fund Manager Portal' },
  ];
  
  const colWidth = (pageWidth - margin * 2 - 20) / 3;
  let col = 0;
  let row = 0;
  
  tools.forEach((tool, idx) => {
    const x = margin + (col * (colWidth + 10));
    const y = 55 + (row * 45);
    
    const bgColor = tool.status === 'Underutilized' ? '#fef3c7' : '#ecfdf5';
    drawBox(x, y, colWidth, 38, bgColor);
    
    doc.setFontSize(14);
    doc.setTextColor(26, 26, 26);
    doc.text(tool.name, x + 8, y + 14);
    
    const statusColor = tool.status === 'Underutilized' ? '#d97706' : '#059669';
    doc.setFontSize(9);
    doc.setTextColor(hexToRgb(statusColor)!.r, hexToRgb(statusColor)!.g, hexToRgb(statusColor)!.b);
    doc.text(tool.status.toUpperCase(), x + 8, y + 23);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(tool.usage, x + 8, y + 32);
    
    col++;
    if (col >= 3) {
      col = 0;
      row++;
    }
  });
  
  // Key question box
  drawBox(margin, 155, pageWidth - margin * 2, 30, '#1a1a1a');
  doc.setFontSize(12);
  doc.setTextColor(245, 245, 220);
  doc.text('Key Question: Are use cases clearly defined? What gaps exist in functionality?', margin + 10, 173);

  // ============= SLIDE 4: Identified Gaps =============
  addSlide(4);
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('Identified Gaps', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, 40, margin + 50, 40);
  
  const gaps = [
    { icon: '⚠️', title: 'Cross-Project Visibility', desc: 'What\'s happening where, and when? Lack of unified view.' },
    { icon: '📊', title: 'Structured Data Capture', desc: 'Data needs to feed learning, fundraising, and reporting systematically.' },
    { icon: '🔄', title: 'Workflow Automation', desc: 'Repetitive tasks still done manually. Need lightweight automation.' },
    { icon: '🔗', title: 'Tool Integration', desc: 'Workflows not clearly mapped. Tools don\'t talk to each other.' },
  ];
  
  yPos = 55;
  gaps.forEach((gap) => {
    drawBox(margin, yPos, pageWidth - margin * 2, 28, '#fff1f2');
    
    doc.setFontSize(16);
    doc.setTextColor(26, 26, 26);
    doc.text(`${gap.icon}  ${gap.title}`, margin + 10, yPos + 12);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(gap.desc, margin + 10, yPos + 22);
    
    yPos += 34;
  });

  // ============= SLIDE 5: Website Assessment =============
  addSlide(5);
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('Website Assessment', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, 40, margin + 60, 40);
  
  // Two columns
  const leftCol = margin;
  const rightCol = pageWidth / 2 + 10;
  
  // Current State
  drawBox(leftCol, 50, 120, 120, '#fef2f2');
  doc.setFontSize(14);
  doc.setTextColor(185, 28, 28);
  doc.text('Current State', leftCol + 10, 65);
  
  const currentIssues = [
    '• Works as reference point only',
    '• Content not easy to find/update',
    '• Pages serve multiple audiences',
    '• No clear pathways for users',
    '• "Who we are" vs "How to engage"',
  ];
  
  doc.setFontSize(11);
  doc.setTextColor(55, 65, 81);
  yPos = 78;
  currentIssues.forEach(issue => {
    doc.text(issue, leftCol + 10, yPos);
    yPos += 12;
  });
  
  // Target State
  drawBox(rightCol, 50, 120, 120, '#ecfdf5');
  doc.setFontSize(14);
  doc.setTextColor(5, 150, 105);
  doc.text('Target State', rightCol + 10, 65);
  
  const targetState = [
    '• Platform, not just reference',
    '• Clear audience pathways',
    '• Better learning integration',
    '• Modular update capability',
    '• SEO & accessibility optimized',
  ];
  
  doc.setFontSize(11);
  doc.setTextColor(55, 65, 81);
  yPos = 78;
  targetState.forEach(item => {
    doc.text(item, rightCol + 10, yPos);
    yPos += 12;
  });
  
  // Metrics box
  drawBox(margin, 175, pageWidth - margin * 2, 20, '#1a1a1a');
  doc.setFontSize(11);
  doc.setTextColor(245, 245, 220);
  doc.text('Key Metrics: Engagement with key pages | Time on site | Referral traffic from events, partners, social', margin + 10, 188);

  // ============= SLIDE 6: Productivity Challenges =============
  addSlide(6);
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('Productivity Challenges', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, 40, margin + 70, 40);
  
  const challenges = [
    { title: 'Context Switching', impact: 'High', solution: 'Consolidated tools & dashboards' },
    { title: 'Unclear Handoffs', impact: 'High', solution: 'Defined workflows & ownership' },
    { title: 'Rebuilding Existing Work', impact: 'Medium', solution: 'Shared templates & documentation' },
    { title: 'Work in People\'s Heads', impact: 'High', solution: 'Documentation culture' },
    { title: 'Too Many Channels', impact: 'Medium', solution: 'Channel consolidation' },
    { title: 'Undocumented Decisions', impact: 'High', solution: 'Decision logs & playbooks' },
  ];
  
  // Table header
  drawBox(margin, 50, pageWidth - margin * 2, 14, '#1a1a1a');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('Challenge', margin + 10, 59);
  doc.text('Impact', margin + 120, 59);
  doc.text('Solution', margin + 160, 59);
  
  yPos = 68;
  challenges.forEach((ch, idx) => {
    const bgColor = idx % 2 === 0 ? '#f9fafb' : '#ffffff';
    drawBox(margin, yPos, pageWidth - margin * 2, 16, bgColor);
    
    doc.setFontSize(10);
    doc.setTextColor(26, 26, 26);
    doc.text(ch.title, margin + 10, yPos + 11);
    
    const impactColor = ch.impact === 'High' ? '#dc2626' : '#d97706';
    doc.setTextColor(hexToRgb(impactColor)!.r, hexToRgb(impactColor)!.g, hexToRgb(impactColor)!.b);
    doc.text(ch.impact, margin + 120, yPos + 11);
    
    doc.setTextColor(100, 100, 100);
    doc.text(ch.solution, margin + 160, yPos + 11);
    
    yPos += 16;
  });

  // ============= SLIDE 7: What We've Built - ESCP Platform =============
  addSlide(7);
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('What We\'ve Already Built', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, 40, margin + 80, 40);
  
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38);
  doc.text('ESCP Fund Manager Portal - Live & Operational', margin, 55);
  
  const features = [
    { category: 'Authentication', items: ['Role-based access', 'Secure login', 'Password reset'] },
    { category: 'Survey System', items: ['Multi-year (2021-2024)', '260+ responses', 'Auto-save'] },
    { category: 'Analytics', items: ['Visual dashboards', 'Cross-year comparison', 'Export capability'] },
    { category: 'Network', items: ['Member directory', 'Profile management', 'Search & filter'] },
    { category: 'AI Assistant', items: ['PortIQ chatbot', 'Data insights', 'Query support'] },
    { category: 'Admin', items: ['User management', 'Application workflow', 'Bulk operations'] },
  ];
  
  const boxWidth = (pageWidth - margin * 2 - 20) / 3;
  col = 0;
  row = 0;
  
  features.forEach((feat) => {
    const x = margin + (col * (boxWidth + 10));
    const y = 65 + (row * 55);
    
    drawBox(x, y, boxWidth, 48, '#f0f9ff');
    
    doc.setFontSize(12);
    doc.setTextColor(30, 64, 175);
    doc.text(feat.category, x + 8, y + 14);
    
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    let itemY = y + 24;
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
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('New Intelligent Features', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, 40, margin + 70, 40);
  
  // AI Company Checker feature
  drawBox(margin, 55, pageWidth - margin * 2, 60, '#faf5ff');
  
  doc.setFontSize(16);
  doc.setTextColor(126, 34, 206);
  doc.text('🤖 AI-Powered Company Checker (New!)', margin + 10, 72);
  
  doc.setFontSize(11);
  doc.setTextColor(55, 65, 81);
  const aiFeatures = [
    '• Automatically searches all survey years (2021-2024) for company matches',
    '• Fuzzy matching identifies similar company names across different surveys',
    '• Consolidates survey data under one email - solving the multi-email problem',
    '• Provides default credentials for returning members to access all their data',
  ];
  yPos = 85;
  aiFeatures.forEach(f => {
    doc.text(f, margin + 10, yPos);
    yPos += 10;
  });
  
  // DevTasks feature
  drawBox(margin, 125, (pageWidth - margin * 2) / 2 - 5, 50, '#ecfdf5');
  doc.setFontSize(14);
  doc.setTextColor(5, 150, 105);
  doc.text('📋 DevTasks Dashboard', margin + 10, 140);
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  doc.text('• Feedback collection from all pages', margin + 10, 152);
  doc.text('• Priority & status tracking', margin + 10, 162);
  doc.text('• Admin-only secure access', margin + 10, 172);
  
  // Feedback Button feature
  drawBox(pageWidth / 2 + 5, 125, (pageWidth - margin * 2) / 2 - 5, 50, '#fff7ed');
  doc.setFontSize(14);
  doc.setTextColor(194, 65, 12);
  doc.text('💬 Floating Feedback Button', pageWidth / 2 + 15, 140);
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  doc.text('• Available on every page', pageWidth / 2 + 15, 152);
  doc.text('• Captures page context automatically', pageWidth / 2 + 15, 162);
  doc.text('• Direct pipeline to DevTasks', pageWidth / 2 + 15, 172);

  // ============= SLIDE 9: How Technology Supports Strategy =============
  addSlide(9);
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('How Technology Supports Strategy', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, 40, margin + 100, 40);
  
  const strategySupport = [
    { area: 'Fundraising', support: 'Data dashboards provide evidence of momentum; relationship tracking in CRM' },
    { area: 'Partnerships', support: 'Narrative consistency through shared templates; engagement analytics' },
    { area: 'Thought Leadership', support: 'Blog platform, learning hub content management, automated distribution' },
    { area: 'Network Engagement', support: 'Member directory, survey insights, peer connection facilitation' },
    { area: 'Impact Reporting', support: 'Automated KPI tracking, visual reports, donor dashboard (planned)' },
  ];
  
  yPos = 55;
  strategySupport.forEach((item, idx) => {
    drawBox(margin, yPos, 60, 25, '#1a1a1a');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(item.area, margin + 5, yPos + 16);
    
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    doc.text(item.support, margin + 70, yPos + 16, { maxWidth: pageWidth - margin * 2 - 80 });
    
    yPos += 28;
  });

  // ============= SLIDE 10: Discussion Questions =============
  addSlide(10);
  
  doc.setFillColor(26, 26, 26);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setFontSize(32);
  doc.setTextColor(245, 245, 220);
  doc.text('Discussion Questions', margin, 45);
  
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(2);
  doc.line(margin, 52, margin + 100, 52);
  
  const questions = [
    '1. Which tools should we prioritize configuring vs. replacing?',
    '2. What workflows need to be mapped before we can improve integration?',
    '3. How can the platform better support your daily work?',
    '4. What training or resources would help the team work more efficiently?',
    '5. How do we measure and track team performance effectively?',
  ];
  
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  yPos = 80;
  questions.forEach(q => {
    doc.text(q, margin, yPos);
    yPos += 22;
  });
  
  // Footer
  doc.setFontSize(12);
  doc.setTextColor(220, 38, 38);
  doc.text('Focus: Cycle time | Rework | Bottlenecks — Not individual output volume', margin, pageHeight - 25);

  // ============= SLIDE 11: Thank You =============
  addSlide(11);
  
  doc.setFillColor(26, 26, 26);
  doc.rect(0, 0, pageWidth, pageHeight * 0.7, 'F');
  
  doc.setFontSize(48);
  doc.setTextColor(245, 245, 220);
  doc.text('Thank You', pageWidth / 2, 80, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setTextColor(220, 38, 38);
  doc.text('Questions & Discussion', pageWidth / 2, 105, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(55, 65, 81);
  doc.text('Session 3 | Day 1 - CFF Tools, Website & Team Efficiency', pageWidth / 2, pageHeight - 40, { align: 'center' });
  doc.text('29th January 2026', pageWidth / 2, pageHeight - 28, { align: 'center' });

  // Save the PDF
  doc.save('CFF_Day1_Tools_Website_Efficiency_Presentation.pdf');
};
