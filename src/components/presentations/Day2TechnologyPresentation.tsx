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
    case 'target':
      // Target/bullseye
      doc.setFillColor(gold.r, gold.g, gold.b);
      doc.circle(x + size/2, y + size/2, size/2, 'F');
      doc.setFillColor(255, 255, 255);
      doc.circle(x + size/2, y + size/2, size/3, 'F');
      break;
  }
};

export const generateDay2Presentation = async () => {
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

  let yPos = 0;

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
  doc.text('Data & Technology', margin, 60);
  doc.text('Development Plans', margin, 85);
  
  // Subtitle - Gold accent
  doc.setFontSize(18);
  doc.setTextColor(gold.r, gold.g, gold.b);
  doc.text('Strategic Roadmap 2026', margin, 105);
  
  // Bottom section - White background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, pageHeight * 0.65 + 12, pageWidth, pageHeight * 0.35 - 12, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Day 2 | Session: 16:00 – 17:00', margin, pageHeight - 50);
  doc.text('30th January 2026 | Fair Acres Nairobi', margin, pageHeight - 38);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Discussion Lead: Alfred', margin, pageHeight - 26);

  // ============= SLIDE 2: Strategic Focus Areas =============
  addSlide(2);
  
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {}
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('2026 Strategic Focus Areas', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 90, 53);
  
  const focusAreas = [
    { num: '1', title: 'Platform Robustness & User Adoption', target: '>90% uptime, 80%+ MAU', icon: 'target' },
    { num: '2', title: 'User Analytics & Behavioral Intelligence', target: 'Complete journey tracking', icon: 'star' },
    { num: '3', title: 'Data Collection & System Integration', target: '95%+ data accuracy', icon: 'check' },
    { num: '4', title: 'Impact Measurement & Reporting', target: 'Automated KPI dashboards', icon: 'circle' },
    { num: '5', title: 'Admin Control & Operational Efficiency', target: '50% overhead reduction', icon: 'square' },
    { num: '6', title: 'Website Development & Public Presence', target: 'SEO-optimized launch', icon: 'arrow' },
    { num: '7', title: 'Security, Privacy & Compliance', target: 'Zero breaches, GDPR ready', icon: 'check' },
  ];
  
  yPos = 65;
  focusAreas.forEach((area) => {
    // Gold number box
    drawBox(margin, yPos, 14, 18, BRAND.gold);
    doc.setFontSize(12);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text(area.num, margin + 4, yPos + 12);
    
    // Icon
    drawIcon(doc, area.icon, margin + 20, yPos + 2, 10);
    
    doc.setFontSize(13);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text(area.title, margin + 33, yPos + 9);
    
    doc.setFontSize(10);
    doc.setTextColor(gold.r, gold.g, gold.b);
    doc.text(`Target: ${area.target}`, margin + 33, yPos + 17);
    
    yPos += 22;
  });

  // ============= SLIDE 3: Q1 Roadmap =============
  addSlide(3);
  
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {}
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Q1 2026 Roadmap (Jan - Mar)', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 90, 53);
  
  const q1Items = [
    { week: '1-2', task: 'Fund Manager Portal launch readiness review', status: 'Done ✓', icon: 'check' },
    { week: '3-4', task: 'User onboarding flow redesign (Application → Approval)', status: 'Done ✓', icon: 'check' },
    { week: '5-6', task: 'Analytics infrastructure deployment', status: 'In Progress', icon: 'arrow' },
    { week: '7-8', task: 'Admin Dashboard V2 polish and deployment', status: 'Pending', icon: 'circle' },
    { week: '9-10', task: 'Core security framework (MFA, audit logging)', status: 'Pending', icon: 'square' },
    { week: '11-12', task: 'User migration and training', status: 'Pending', icon: 'circle' },
  ];
  
  // Table header - Navy
  drawBox(margin, 60, pageWidth - margin * 2, 14, BRAND.navy);
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('Week', margin + 8, 69);
  doc.text('Deliverable', margin + 40, 69);
  doc.text('Status', pageWidth - 60, 69);
  
  yPos = 78;
  q1Items.forEach((item, idx) => {
    const bgColor = idx % 2 === 0 ? BRAND.lightNavy : '#ffffff';
    drawBox(margin, yPos, pageWidth - margin * 2, 16, bgColor);
    
    // Icon
    drawIcon(doc, item.icon, margin + 8, yPos + 4, 6);
    
    doc.setFontSize(10);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text(item.week, margin + 18, yPos + 11);
    doc.text(item.task, margin + 40, yPos + 11);
    
    const statusColor = item.status.includes('Done') ? '#059669' : 
                        item.status.includes('Progress') ? BRAND.gold : '#6b7280';
    const statusRgb = hexToRgb(statusColor)!;
    doc.setTextColor(statusRgb.r, statusRgb.g, statusRgb.b);
    doc.text(item.status, pageWidth - 60, yPos + 11);
    
    yPos += 16;
  });
  
  // Q1 Milestones box - Gold background
  drawBox(margin, 170, pageWidth - margin * 2, 25, BRAND.lightGold, BRAND.gold);
  doc.setFontSize(11);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Q1 Milestones:', margin + 8, 180);
  doc.setFontSize(9);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('• 50+ active users onboarded  • Admin dashboard operational  • MFA for all admins  • Website specs finalized', margin + 8, 190);

  // ============= SLIDE 4: Q2 Roadmap =============
  addSlide(4);
  
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {}
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Q2 2026 Roadmap (Apr - Jun)', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 90, 53);
  
  const q2Items = [
    { week: '1-3', task: 'WhatsApp and HubSpot CRM integration (Phase 1: Contacts sync)', icon: 'check' },
    { week: '4-6', task: 'Advanced analytics dashboards with export (SNA, Network Survey)', icon: 'star' },
    { week: '7-9', task: 'Learning Hub CMS & Impact tracking tool (Phase 1: KPI framework)', icon: 'circle' },
    { week: '10-12', task: 'User onboarding optimization based on Q1 data', icon: 'arrow' },
  ];
  
  drawBox(margin, 60, pageWidth - margin * 2, 14, BRAND.navy);
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('Week', margin + 8, 69);
  doc.text('Deliverable', margin + 40, 69);
  
  yPos = 78;
  q2Items.forEach((item, idx) => {
    const bgColor = idx % 2 === 0 ? BRAND.lightNavy : '#ffffff';
    drawBox(margin, yPos, pageWidth - margin * 2, 16, bgColor);
    
    // Icon
    drawIcon(doc, item.icon, margin + 8, yPos + 4, 6);
    
    doc.setFontSize(10);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text(item.week, margin + 18, yPos + 11);
    doc.text(item.task, margin + 40, yPos + 11, { maxWidth: pageWidth - margin * 2 - 50 });
    
    yPos += 16;
  });
  
  // Q2 Milestones - Navy background with gold accent
  drawBox(margin, 145, pageWidth - margin * 2, 45, BRAND.lightNavy, BRAND.navy);
  doc.setFillColor(gold.r, gold.g, gold.b);
  doc.rect(margin, 145, 4, 45, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Q2 Milestones', margin + 12, 158);
  
  const q2Milestones = [
    '• WhatsApp and HubSpot contact sync operational',
    '• Data sharing rooms enabled for secure member collaboration',
    '• Member Blogs enabled with engagement reports',
    '• Learning Modules Hub live (text, visuals, videos, webinars)',
    '• 80% user activation rate achieved',
  ];
  
  doc.setFontSize(9);
  doc.setTextColor(navy.r, navy.g, navy.b);
  yPos = 168;
  q2Milestones.forEach(m => {
    drawIcon(doc, 'check', margin + 12, yPos - 2, 4);
    doc.text(m, margin + 18, yPos);
    yPos += 8;
  });

  // ============= SLIDE 5: Q3 & Q4 Overview =============
  addSlide(5);
  
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {}
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Q3 & Q4 2026 Overview', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 70, 53);
  
  // Q3 Box - Navy theme
  drawBox(margin, 60, (pageWidth - margin * 2) / 2 - 5, 95, BRAND.lightNavy, BRAND.navy);
  doc.setFillColor(navy.r, navy.g, navy.b);
  doc.rect(margin, 60, 4, 95, 'F');
  
  doc.setFontSize(16);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Q3: Jul - Sep', margin + 12, 75);
  
  const q3Items = [
    '• AI-powered features (PortIQ enhancements)',
    '• Data sharing rooms deployment',
    '• Impact tracking tool launch',
    '• Community features expansion',
    '• Website upgrade & polish',
  ];
  
  doc.setFontSize(10);
  doc.setTextColor(navy.r, navy.g, navy.b);
  yPos = 88;
  q3Items.forEach(item => {
    drawIcon(doc, 'star', margin + 12, yPos - 2, 4);
    doc.text(item, margin + 18, yPos);
    yPos += 12;
  });
  
  doc.setFontSize(9);
  doc.setTextColor(gold.r, gold.g, gold.b);
  doc.text('Target: AI handles 70%+ queries, 30% engagement ↑', margin + 12, 148);
  
  // Q4 Box - Gold theme
  const q4X = pageWidth / 2 + 5;
  drawBox(q4X, 60, (pageWidth - margin * 2) / 2 - 5, 95, BRAND.lightGold, BRAND.gold);
  doc.setFillColor(gold.r, gold.g, gold.b);
  doc.rect(q4X, 60, 4, 95, 'F');
  
  doc.setFontSize(16);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Q4: Oct - Dec', q4X + 12, 75);
  
  const q4Items = [
    '• Platform performance optimization',
    '• Impact reporting system finalization',
    '• Documentation & knowledge base',
    '• 2026 review and 2027 planning',
    '• All contract deliverables complete',
  ];
  
  doc.setFontSize(10);
  doc.setTextColor(navy.r, navy.g, navy.b);
  yPos = 88;
  q4Items.forEach(item => {
    drawIcon(doc, 'target', q4X + 12, yPos - 2, 4);
    doc.text(item, q4X + 18, yPos);
    yPos += 12;
  });
  
  doc.setFontSize(9);
  doc.setTextColor(gold.r, gold.g, gold.b);
  doc.text('Target: <150ms page load, 100% on-time reports', q4X + 12, 148);
  
  // Year-end summary - Navy with gold accent
  drawBox(margin, 165, pageWidth - margin * 2, 35, BRAND.navy);
  doc.setFillColor(gold.r, gold.g, gold.b);
  doc.rect(margin, 165, 4, 35, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('Year-End Deliverables:', margin + 12, 178);
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('✓ Revamped CFF website  ✓ Functional Fund Manager Portal  ✓ Accurate data dashboards  ✓ Well-structured CRM  ✓ Monthly support logs', margin + 12, 192);

  // ============= SLIDE 6: Current Platform Backlog =============
  addSlide(6);
  
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {}
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Platform Improvement Backlog', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 90, 53);
  
  const backlogCategories = [
    { title: 'Learning Hub', items: ['Resource editing/deletion', 'Progress tracking', 'Completion rewards', 'AI recommendations', 'Analytics (views, completion)'], icon: 'circle' },
    { title: 'Admin Dashboard', items: ['Real-time refresh indicators', 'Advanced user search', 'Bulk operations', 'Survey detail polish', 'Pending action widget'], icon: 'square' },
    { title: 'Analytics', items: ['Cross-year comparison', 'Geographic map view', 'Custom date filtering', 'Report scheduling', 'PDF/Excel exports'], icon: 'star' },
    { title: 'Community', items: ['Blog scheduling', 'Content moderation', 'Comment threading', 'Featured rotation', 'Email digests'], icon: 'check' },
  ];
  
  const boxWidth = (pageWidth - margin * 2 - 15) / 4;
  backlogCategories.forEach((cat, idx) => {
    const x = margin + (idx * (boxWidth + 5));
    
    const bgColor = idx % 2 === 0 ? BRAND.lightNavy : BRAND.lightGold;
    drawBox(x, 65, boxWidth, 120, bgColor, BRAND.navy);
    
    // Icon circle
    doc.setFillColor(gold.r, gold.g, gold.b);
    doc.circle(x + boxWidth/2, 78, 5, 'F');
    drawIcon(doc, cat.icon, x + boxWidth/2 - 4, 75, 8);
    
    doc.setFontSize(11);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text(cat.title, x + 5, 88);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    yPos = 96;
    cat.items.forEach(item => {
      doc.text(`• ${item}`, x + 5, yPos, { maxWidth: boxWidth - 10 });
      yPos += 12;
    });
  });

  // ============= SLIDE 7: Success Metrics =============
  addSlide(7);
  
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {}
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Success Metrics', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 60, 53);
  
  const metrics = [
    { metric: 'Monthly Active Users', target: '80%+ of registered', method: 'Analytics dashboard', icon: 'star' },
    { metric: 'Data Accuracy', target: '95%+ field completion', method: 'Data quality reports', icon: 'check' },
    { metric: 'Security Incidents', target: 'Zero breaches', method: 'Security monitoring', icon: 'target' },
    { metric: 'User Satisfaction', target: '4.5+ rating', method: 'Engagement analytics', icon: 'circle' },
    { metric: 'Page Load Time', target: '<200ms average', method: 'Performance monitoring', icon: 'arrow' },
    { metric: 'Admin Task Time', target: '50% reduction', method: 'Time tracking comparison', icon: 'square' },
    { metric: 'System Uptime', target: '>90%', method: 'Infrastructure monitoring', icon: 'target' },
  ];
  
  drawBox(margin, 60, pageWidth - margin * 2, 14, BRAND.navy);
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('Metric', margin + 8, 69);
  doc.text('Target', margin + 90, 69);
  doc.text('Measurement Method', margin + 170, 69);
  
  yPos = 78;
  metrics.forEach((m, idx) => {
    const bgColor = idx % 2 === 0 ? BRAND.lightNavy : '#ffffff';
    drawBox(margin, yPos, pageWidth - margin * 2, 14, bgColor);
    
    // Icon
    drawIcon(doc, m.icon, margin + 8, yPos + 3, 6);
    
    doc.setFontSize(9);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text(m.metric, margin + 18, yPos + 10);
    
    doc.setTextColor(gold.r, gold.g, gold.b);
    doc.text(m.target, margin + 90, yPos + 10);
    
    doc.setTextColor(100, 100, 100);
    doc.text(m.method, margin + 170, yPos + 10);
    
    yPos += 14;
  });

  // ============= SLIDE 8: Resource Requirements =============
  addSlide(8);
  
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {}
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Resource Requirements', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 80, 53);
  
  // Technical Resources - Navy theme
  drawBox(margin, 60, (pageWidth - margin * 2) / 2 - 5, 55, BRAND.lightNavy, BRAND.navy);
  doc.setFillColor(navy.r, navy.g, navy.b);
  doc.rect(margin, 60, 4, 55, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Technical Resources', margin + 12, 75);
  
  doc.setFontSize(10);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('• 1 Full-stack Developer (dedicated)', margin + 12, 88);
  doc.text('• 1 DevOps/Security Engineer (part-time)', margin + 12, 98);
  doc.text('• Design support (as needed)', margin + 12, 108);
  
  // Monthly Costs - Gold theme
  const costX = pageWidth / 2 + 5;
  drawBox(costX, 60, (pageWidth - margin * 2) / 2 - 5, 55, BRAND.lightGold, BRAND.gold);
  doc.setFillColor(gold.r, gold.g, gold.b);
  doc.rect(costX, 60, 4, 55, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Est. Monthly Infrastructure', costX + 12, 75);
  
  doc.setFontSize(9);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('• Supabase Pro: $25/month', costX + 12, 87);
  doc.text('• Edge Functions: ~$50-100/month', costX + 12, 96);
  doc.text('• Email (Resend): ~$20/month', costX + 12, 105);
  doc.text('• Monitoring tools: ~$30/month', costX + 12, 114);
  
  doc.setFontSize(12);
  doc.setTextColor(gold.r, gold.g, gold.b);
  doc.text('Total: $185-245/month', costX + 12, 110);
  
  // Risk Mitigation - Navy background
  drawBox(margin, 125, pageWidth - margin * 2, 65, BRAND.lightNavy, BRAND.navy);
  doc.setFillColor(navy.r, navy.g, navy.b);
  doc.rect(margin, 125, 4, 65, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Risk Mitigation', margin + 12, 140);
  
  const risks = [
    { risk: 'User adoption below target', mitigation: 'Admin monitoring, onboarding redesign, efficient feedback loop', icon: 'check' },
    { risk: 'Data quality issues', mitigation: 'Automated validation, quality dashboards, admin alerts', icon: 'target' },
    { risk: 'Security breach', mitigation: 'MFA, audit logging, regular security reviews', icon: 'target' },
    { risk: 'Scope creep', mitigation: 'Monthly priority review, clear documentation, stakeholder alignment', icon: 'check' },
  ];
  
  doc.setFontSize(9);
  yPos = 150;
  risks.forEach(r => {
    drawIcon(doc, r.icon, margin + 12, yPos - 2, 4);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text(`• ${r.risk}:`, margin + 20, yPos);
    doc.setTextColor(100, 100, 100);
    doc.text(r.mitigation, margin + 70, yPos, { maxWidth: pageWidth - margin * 2 - 80 });
    yPos += 12;
  });

  // ============= SLIDE 9: Engagement Strategy =============
  addSlide(9);
  
  try {
    await addLogo(doc, margin, 15, 40);
  } catch {}
  
  doc.setFontSize(32);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Engagement & Communication Strategy', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(2);
  doc.line(margin, 53, margin + 100, 53);
  
  doc.setFontSize(12);
  doc.setTextColor(gold.r, gold.g, gold.b);
  doc.text('How We Keep Members Active & Informed', margin, 65);
  
  const engagementItems = [
    { freq: 'Weekly', action: 'Content posts on blog/learning hub to drive engagement', icon: 'star' },
    { freq: 'Weekly', action: 'Monitor platform analytics for drop-off patterns', icon: 'check' },
    { freq: 'Bi-weekly', action: 'Review DevTasks feedback and prioritize fixes', icon: 'circle' },
    { freq: 'Monthly', action: 'Technical support logs and system health report', icon: 'square' },
    { freq: 'Monthly', action: 'User engagement summary for leadership', icon: 'target' },
    { freq: 'Quarterly', action: 'Platform performance review and optimization sprint', icon: 'arrow' },
  ];
  
  yPos = 75;
  engagementItems.forEach((item, idx) => {
    const bgColor = idx % 2 === 0 ? BRAND.lightNavy : BRAND.lightGold;
    drawBox(margin, yPos, 55, 18, bgColor, BRAND.navy);
    
    // Icon
    drawIcon(doc, item.icon, margin + 8, yPos + 5, 6);
    
    doc.setFontSize(10);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text(item.freq, margin + 18, yPos + 12);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(item.action, margin + 65, yPos + 12);
    
    yPos += 22;
  });

  // ============= SLIDE 10: Next Steps =============
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
  doc.text('Immediate Next Steps', margin, 50);
  
  doc.setDrawColor(gold.r, gold.g, gold.b);
  doc.setLineWidth(3);
  doc.line(margin, 54, margin + 110, 54);
  
  const nextSteps = [
    { num: '1', step: 'Finalize website upgrade specifications with team input', icon: 'check' },
    { num: '2', step: 'Complete Admin Dashboard V2 refinements', icon: 'square' },
    { num: '3', step: 'Deploy analytics infrastructure for member tracking', icon: 'star' },
    { num: '4', step: 'Enable MFA for all admin accounts', icon: 'target' },
    { num: '5', step: 'Begin user onboarding campaign for active members', icon: 'circle' },
    { num: '6', step: 'Set up monthly technical support logging system', icon: 'arrow' },
  ];
  
  yPos = 75;
  nextSteps.forEach(s => {
    // Gold circle with number
    doc.setFillColor(gold.r, gold.g, gold.b);
    doc.circle(margin + 8, yPos - 2, 8, 'F');
    
    // Icon
    drawIcon(doc, s.icon, margin + 5, yPos - 5, 6);
    
    doc.setFontSize(12);
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text(s.num, margin + 5, yPos + 2);
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(s.step, margin + 25, yPos + 2);
    
    yPos += 22;
  });

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
  doc.text('Let\'s build something great together in 2026', pageWidth / 2, 125, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Day 2 | Data & Technology Development Plans', pageWidth / 2, pageHeight - 50, { align: 'center' });
  doc.text('30th January 2026', pageWidth / 2, pageHeight - 38, { align: 'center' });

  // Save the PDF
  doc.save('CFF_Day2_Technology_Development_Plans_Presentation.pdf');
};
