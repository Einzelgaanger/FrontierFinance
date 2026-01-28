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

export const generateDay2Presentation = async () => {
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
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, pageWidth, 8, 'F');
    doc.setFillColor(220, 38, 38);
    doc.rect(0, pageHeight - 4, pageWidth, 4, 'F');
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

  let yPos = 0;

  // ============= SLIDE 1: Title Slide =============
  addSlide(1);
  
  doc.setFillColor(26, 26, 26);
  doc.rect(0, 0, pageWidth, pageHeight * 0.6, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(245, 245, 220);
  doc.text('CFF', margin, 30);
  doc.setFontSize(10);
  doc.text('Collaborative for Frontier Finance', margin, 38);
  
  doc.setFontSize(42);
  doc.setTextColor(255, 255, 255);
  doc.text('Data & Technology', margin, 75);
  doc.text('Development Plans', margin, 95);
  
  doc.setFontSize(18);
  doc.setTextColor(220, 38, 38);
  doc.text('Strategic Roadmap 2026', margin, 115);
  
  doc.setFontSize(14);
  doc.setTextColor(55, 65, 81);
  doc.text('Day 2 | Session: 16:00 – 17:00', margin, pageHeight - 40);
  doc.text('30th January 2026 | Fair Acres Nairobi', margin, pageHeight - 30);
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Discussion Lead: Alfred', margin, pageHeight - 18);

  // ============= SLIDE 2: Strategic Focus Areas =============
  addSlide(2);
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('2026 Strategic Focus Areas', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(1);
  doc.line(margin, 40, margin + 80, 40);
  
  const focusAreas = [
    { num: '1', title: 'Platform Robustness & User Adoption', target: '>90% uptime, 80%+ MAU' },
    { num: '2', title: 'User Analytics & Behavioral Intelligence', target: 'Complete journey tracking' },
    { num: '3', title: 'Data Collection & System Integration', target: '95%+ data accuracy' },
    { num: '4', title: 'Impact Measurement & Reporting', target: 'Automated KPI dashboards' },
    { num: '5', title: 'Admin Control & Operational Efficiency', target: '50% overhead reduction' },
    { num: '6', title: 'Website Development & Public Presence', target: 'SEO-optimized launch' },
    { num: '7', title: 'Security, Privacy & Compliance', target: 'Zero breaches, GDPR ready' },
  ];
  
  yPos = 55;
  focusAreas.forEach((area) => {
    drawBox(margin, yPos, 12, 16, '#dc2626');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(area.num, margin + 4, yPos + 11);
    
    doc.setFontSize(13);
    doc.setTextColor(26, 26, 26);
    doc.text(area.title, margin + 20, yPos + 8);
    
    doc.setFontSize(10);
    doc.setTextColor(5, 150, 105);
    doc.text(`Target: ${area.target}`, margin + 20, yPos + 16);
    
    yPos += 20;
  });

  // ============= SLIDE 3: Q1 Roadmap =============
  addSlide(3);
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('Q1 2026 Roadmap (Jan - Mar)', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, 40, margin + 80, 40);
  
  const q1Items = [
    { week: '1-2', task: 'Fund Manager Portal launch readiness review', status: 'Done ✓' },
    { week: '3-4', task: 'User onboarding flow redesign (Application → Approval)', status: 'Done ✓' },
    { week: '5-6', task: 'Analytics infrastructure deployment', status: 'In Progress' },
    { week: '7-8', task: 'Admin Dashboard V2 polish and deployment', status: 'Pending' },
    { week: '9-10', task: 'Core security framework (MFA, audit logging)', status: 'Pending' },
    { week: '11-12', task: 'User migration and training', status: 'Pending' },
  ];
  
  // Table header
  drawBox(margin, 50, pageWidth - margin * 2, 14, '#1a1a1a');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('Week', margin + 8, 59);
  doc.text('Deliverable', margin + 40, 59);
  doc.text('Status', pageWidth - 60, 59);
  
  yPos = 68;
  q1Items.forEach((item, idx) => {
    const bgColor = idx % 2 === 0 ? '#f9fafb' : '#ffffff';
    drawBox(margin, yPos, pageWidth - margin * 2, 16, bgColor);
    
    doc.setFontSize(10);
    doc.setTextColor(26, 26, 26);
    doc.text(item.week, margin + 8, yPos + 11);
    doc.text(item.task, margin + 40, yPos + 11);
    
    const statusColor = item.status.includes('Done') ? '#059669' : 
                        item.status.includes('Progress') ? '#d97706' : '#6b7280';
    doc.setTextColor(hexToRgb(statusColor)!.r, hexToRgb(statusColor)!.g, hexToRgb(statusColor)!.b);
    doc.text(item.status, pageWidth - 60, yPos + 11);
    
    yPos += 16;
  });
  
  // Q1 Milestones box
  drawBox(margin, 170, pageWidth - margin * 2, 25, '#ecfdf5');
  doc.setFontSize(11);
  doc.setTextColor(5, 150, 105);
  doc.text('Q1 Milestones:', margin + 8, 180);
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81);
  doc.text('• 50+ active users onboarded  • Admin dashboard operational  • MFA for all admins  • Website specs finalized', margin + 8, 190);

  // ============= SLIDE 4: Q2 Roadmap =============
  addSlide(4);
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('Q2 2026 Roadmap (Apr - Jun)', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, 40, margin + 80, 40);
  
  const q2Items = [
    { week: '1-3', task: 'WhatsApp and HubSpot CRM integration (Phase 1: Contacts sync)' },
    { week: '4-6', task: 'Advanced analytics dashboards with export (SNA, Network Survey)' },
    { week: '7-9', task: 'Learning Hub CMS & Impact tracking tool (Phase 1: KPI framework)' },
    { week: '10-12', task: 'User onboarding optimization based on Q1 data' },
  ];
  
  drawBox(margin, 50, pageWidth - margin * 2, 14, '#1a1a1a');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('Week', margin + 8, 59);
  doc.text('Deliverable', margin + 40, 59);
  
  yPos = 68;
  q2Items.forEach((item, idx) => {
    const bgColor = idx % 2 === 0 ? '#f9fafb' : '#ffffff';
    drawBox(margin, yPos, pageWidth - margin * 2, 16, bgColor);
    
    doc.setFontSize(10);
    doc.setTextColor(26, 26, 26);
    doc.text(item.week, margin + 8, yPos + 11);
    doc.text(item.task, margin + 40, yPos + 11, { maxWidth: pageWidth - margin * 2 - 50 });
    
    yPos += 16;
  });
  
  // Q2 Milestones
  drawBox(margin, 145, pageWidth - margin * 2, 45, '#fff7ed');
  doc.setFontSize(12);
  doc.setTextColor(194, 65, 12);
  doc.text('Q2 Milestones', margin + 8, 158);
  
  const q2Milestones = [
    '• WhatsApp and HubSpot contact sync operational',
    '• Data sharing rooms enabled for secure member collaboration',
    '• Member Blogs enabled with engagement reports',
    '• Learning Modules Hub live (text, visuals, videos, webinars)',
    '• 80% user activation rate achieved',
  ];
  
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81);
  yPos = 168;
  q2Milestones.forEach(m => {
    doc.text(m, margin + 8, yPos);
    yPos += 8;
  });

  // ============= SLIDE 5: Q3 & Q4 Overview =============
  addSlide(5);
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('Q3 & Q4 2026 Overview', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, 40, margin + 60, 40);
  
  // Q3 Box
  drawBox(margin, 50, (pageWidth - margin * 2) / 2 - 5, 95, '#faf5ff');
  doc.setFontSize(14);
  doc.setTextColor(126, 34, 206);
  doc.text('Q3: Jul - Sep', margin + 10, 65);
  
  const q3Items = [
    '• AI-powered features (PortIQ enhancements)',
    '• Data sharing rooms deployment',
    '• Impact tracking tool launch',
    '• Community features expansion',
    '• Website upgrade & polish',
  ];
  
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  yPos = 78;
  q3Items.forEach(item => {
    doc.text(item, margin + 10, yPos);
    yPos += 12;
  });
  
  doc.setFontSize(9);
  doc.setTextColor(126, 34, 206);
  doc.text('Target: AI handles 70%+ queries, 30% engagement ↑', margin + 10, 138);
  
  // Q4 Box
  const q4X = pageWidth / 2 + 5;
  drawBox(q4X, 50, (pageWidth - margin * 2) / 2 - 5, 95, '#fef3c7');
  doc.setFontSize(14);
  doc.setTextColor(180, 83, 9);
  doc.text('Q4: Oct - Dec', q4X + 10, 65);
  
  const q4Items = [
    '• Platform performance optimization',
    '• Impact reporting system finalization',
    '• Documentation & knowledge base',
    '• 2026 review and 2027 planning',
    '• All contract deliverables complete',
  ];
  
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  yPos = 78;
  q4Items.forEach(item => {
    doc.text(item, q4X + 10, yPos);
    yPos += 12;
  });
  
  doc.setFontSize(9);
  doc.setTextColor(180, 83, 9);
  doc.text('Target: <150ms page load, 100% on-time reports', q4X + 10, 138);
  
  // Year-end summary
  drawBox(margin, 155, pageWidth - margin * 2, 35, '#1a1a1a');
  doc.setFontSize(12);
  doc.setTextColor(245, 245, 220);
  doc.text('Year-End Deliverables:', margin + 10, 168);
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('✓ Revamped CFF website  ✓ Functional Fund Manager Portal  ✓ Accurate data dashboards  ✓ Well-structured CRM  ✓ Monthly support logs', margin + 10, 182);

  // ============= SLIDE 6: Current Platform Backlog =============
  addSlide(6);
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('Platform Improvement Backlog', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, 40, margin + 80, 40);
  
  const backlogCategories = [
    { title: 'Learning Hub', items: ['Resource editing/deletion', 'Progress tracking', 'Completion rewards', 'AI recommendations', 'Analytics (views, completion)'] },
    { title: 'Admin Dashboard', items: ['Real-time refresh indicators', 'Advanced user search', 'Bulk operations', 'Survey detail polish', 'Pending action widget'] },
    { title: 'Analytics', items: ['Cross-year comparison', 'Geographic map view', 'Custom date filtering', 'Report scheduling', 'PDF/Excel exports'] },
    { title: 'Community', items: ['Blog scheduling', 'Content moderation', 'Comment threading', 'Featured rotation', 'Email digests'] },
  ];
  
  const boxWidth = (pageWidth - margin * 2 - 15) / 4;
  backlogCategories.forEach((cat, idx) => {
    const x = margin + (idx * (boxWidth + 5));
    
    drawBox(x, 55, boxWidth, 120, '#f0f9ff');
    
    doc.setFontSize(11);
    doc.setTextColor(30, 64, 175);
    doc.text(cat.title, x + 5, 68);
    
    doc.setFontSize(8);
    doc.setTextColor(55, 65, 81);
    yPos = 80;
    cat.items.forEach(item => {
      doc.text(`• ${item}`, x + 5, yPos, { maxWidth: boxWidth - 10 });
      yPos += 14;
    });
  });

  // ============= SLIDE 7: Success Metrics =============
  addSlide(7);
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('Success Metrics', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, 40, margin + 50, 40);
  
  const metrics = [
    { metric: 'Monthly Active Users', target: '80%+ of registered', method: 'Analytics dashboard' },
    { metric: 'Data Accuracy', target: '95%+ field completion', method: 'Data quality reports' },
    { metric: 'Security Incidents', target: 'Zero breaches', method: 'Security monitoring' },
    { metric: 'User Satisfaction', target: '4.5+ rating', method: 'Engagement analytics' },
    { metric: 'Page Load Time', target: '<200ms average', method: 'Performance monitoring' },
    { metric: 'Admin Task Time', target: '50% reduction', method: 'Time tracking comparison' },
    { metric: 'System Uptime', target: '>90%', method: 'Infrastructure monitoring' },
  ];
  
  drawBox(margin, 50, pageWidth - margin * 2, 14, '#1a1a1a');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('Metric', margin + 8, 59);
  doc.text('Target', margin + 90, 59);
  doc.text('Measurement Method', margin + 170, 59);
  
  yPos = 68;
  metrics.forEach((m, idx) => {
    const bgColor = idx % 2 === 0 ? '#f9fafb' : '#ffffff';
    drawBox(margin, yPos, pageWidth - margin * 2, 14, bgColor);
    
    doc.setFontSize(9);
    doc.setTextColor(26, 26, 26);
    doc.text(m.metric, margin + 8, yPos + 10);
    
    doc.setTextColor(5, 150, 105);
    doc.text(m.target, margin + 90, yPos + 10);
    
    doc.setTextColor(100, 100, 100);
    doc.text(m.method, margin + 170, yPos + 10);
    
    yPos += 14;
  });

  // ============= SLIDE 8: Resource Requirements =============
  addSlide(8);
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('Resource Requirements', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, 40, margin + 70, 40);
  
  // Technical Resources
  drawBox(margin, 55, (pageWidth - margin * 2) / 2 - 5, 55, '#ecfdf5');
  doc.setFontSize(14);
  doc.setTextColor(5, 150, 105);
  doc.text('Technical Resources', margin + 10, 70);
  
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  doc.text('• 1 Full-stack Developer (dedicated)', margin + 10, 85);
  doc.text('• 1 DevOps/Security Engineer (part-time)', margin + 10, 95);
  doc.text('• Design support (as needed)', margin + 10, 105);
  
  // Monthly Costs
  const costX = pageWidth / 2 + 5;
  drawBox(costX, 55, (pageWidth - margin * 2) / 2 - 5, 55, '#fff7ed');
  doc.setFontSize(14);
  doc.setTextColor(194, 65, 12);
  doc.text('Est. Monthly Infrastructure', costX + 10, 70);
  
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81);
  doc.text('• Supabase Pro: $25/month', costX + 10, 82);
  doc.text('• Edge Functions: ~$50-100/month', costX + 10, 91);
  doc.text('• Email (Resend): ~$20/month', costX + 10, 100);
  doc.text('• Monitoring tools: ~$30/month', costX + 10, 109);
  
  doc.setFontSize(12);
  doc.setTextColor(194, 65, 12);
  doc.text('Total: $185-245/month', costX + 10, 105);
  
  // Risk Mitigation
  drawBox(margin, 120, pageWidth - margin * 2, 65, '#fef2f2');
  doc.setFontSize(14);
  doc.setTextColor(185, 28, 28);
  doc.text('Risk Mitigation', margin + 10, 135);
  
  const risks = [
    { risk: 'User adoption below target', mitigation: 'Admin monitoring, onboarding redesign, efficient feedback loop' },
    { risk: 'Data quality issues', mitigation: 'Automated validation, quality dashboards, admin alerts' },
    { risk: 'Security breach', mitigation: 'MFA, audit logging, regular security reviews' },
    { risk: 'Scope creep', mitigation: 'Monthly priority review, clear documentation, stakeholder alignment' },
  ];
  
  doc.setFontSize(9);
  yPos = 145;
  risks.forEach(r => {
    doc.setTextColor(26, 26, 26);
    doc.text(`• ${r.risk}:`, margin + 10, yPos);
    doc.setTextColor(100, 100, 100);
    doc.text(r.mitigation, margin + 65, yPos, { maxWidth: pageWidth - margin * 2 - 75 });
    yPos += 12;
  });

  // ============= SLIDE 9: Engagement Strategy =============
  addSlide(9);
  
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('Engagement & Communication Strategy', margin, 35);
  
  doc.setDrawColor(220, 38, 38);
  doc.line(margin, 40, margin + 90, 40);
  
  doc.setFontSize(12);
  doc.setTextColor(220, 38, 38);
  doc.text('How We Keep Members Active & Informed', margin, 55);
  
  const engagementItems = [
    { freq: 'Weekly', action: 'Content posts on blog/learning hub to drive engagement' },
    { freq: 'Weekly', action: 'Monitor platform analytics for drop-off patterns' },
    { freq: 'Bi-weekly', action: 'Review DevTasks feedback and prioritize fixes' },
    { freq: 'Monthly', action: 'Technical support logs and system health report' },
    { freq: 'Monthly', action: 'User engagement summary for leadership' },
    { freq: 'Quarterly', action: 'Platform performance review and optimization sprint' },
  ];
  
  yPos = 70;
  engagementItems.forEach((item, idx) => {
    drawBox(margin, yPos, 50, 16, '#1a1a1a');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(item.freq, margin + 5, yPos + 11);
    
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    doc.text(item.action, margin + 60, yPos + 11);
    
    yPos += 20;
  });

  // ============= SLIDE 10: Next Steps =============
  addSlide(10);
  
  doc.setFillColor(26, 26, 26);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setFontSize(32);
  doc.setTextColor(245, 245, 220);
  doc.text('Immediate Next Steps', margin, 45);
  
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(2);
  doc.line(margin, 52, margin + 100, 52);
  
  const nextSteps = [
    { num: '1', step: 'Finalize website upgrade specifications with team input' },
    { num: '2', step: 'Complete Admin Dashboard V2 refinements' },
    { num: '3', step: 'Deploy analytics infrastructure for member tracking' },
    { num: '4', step: 'Enable MFA for all admin accounts' },
    { num: '5', step: 'Begin user onboarding campaign for active members' },
    { num: '6', step: 'Set up monthly technical support logging system' },
  ];
  
  yPos = 75;
  nextSteps.forEach(s => {
    doc.setFillColor(220, 38, 38);
    doc.roundedRect(margin, yPos - 8, 15, 15, 2, 2, 'F');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(s.num, margin + 5, yPos + 2);
    
    doc.setFontSize(14);
    doc.setTextColor(245, 245, 220);
    doc.text(s.step, margin + 25, yPos + 2);
    
    yPos += 22;
  });

  // ============= SLIDE 11: Thank You =============
  addSlide(11);
  
  doc.setFillColor(26, 26, 26);
  doc.rect(0, 0, pageWidth, pageHeight * 0.7, 'F');
  
  doc.setFontSize(48);
  doc.setTextColor(245, 245, 220);
  doc.text('Thank You', pageWidth / 2, 70, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setTextColor(220, 38, 38);
  doc.text('Questions & Discussion', pageWidth / 2, 95, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(200, 200, 200);
  doc.text('Let\'s build something great together in 2026', pageWidth / 2, 115, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(55, 65, 81);
  doc.text('Day 2 | Data & Technology Development Plans', pageWidth / 2, pageHeight - 40, { align: 'center' });
  doc.text('30th January 2026', pageWidth / 2, pageHeight - 28, { align: 'center' });

  // Save the PDF
  doc.save('CFF_Day2_Technology_Development_Plans_Presentation.pdf');
};
