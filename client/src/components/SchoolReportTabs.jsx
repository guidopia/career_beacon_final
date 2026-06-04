import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Home,
  Award,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Bot,
  TrendingUp as SkillIcon,
  Sparkles,
  ArrowRight,
  Brain,
  Globe,
  Target,
  BookOpen,
  Zap,
  Compass,
  Wrench,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { APTITUDE_FALLBACK_RECS } from '../services/schoolReport';

// ─── Module-level helpers ────────────────────────────────────────────────────

const BUCKET_THEMES = [
  { bar: 'bg-amber-400', soft: 'bg-amber-50', ring: 'border-amber-300', text: 'text-amber-700' },
  { bar: 'bg-orange-400', soft: 'bg-orange-50', ring: 'border-orange-300', text: 'text-orange-700' },
  { bar: 'bg-rose-400', soft: 'bg-rose-50', ring: 'border-rose-300', text: 'text-rose-700' },
  { bar: 'bg-purple-400', soft: 'bg-purple-50', ring: 'border-purple-300', text: 'text-purple-700' },
  { bar: 'bg-cyan-400', soft: 'bg-cyan-50', ring: 'border-cyan-300', text: 'text-cyan-700' },
  { bar: 'bg-emerald-400', soft: 'bg-emerald-50', ring: 'border-emerald-300', text: 'text-emerald-700' },
];

const BUCKET_ICONS = {
  attention: CheckCircle,
  problem: Lightbulb,
  spatial: Compass,
  numerical: Target,
  logical: Brain,
  verbal: BookOpen,
  abstract: Sparkles,
  mechanical: Wrench,
  speed: TrendingUp,
};

const ACCENT_STYLES = {
  blue: {
    headerBorder: 'border-blue-300',
    headerBg: 'bg-blue-50',
    bulletBg: 'bg-blue-50',
    bulletBorder: 'border-blue-200',
    bulletText: 'text-blue-500',
  },
  green: {
    headerBorder: 'border-green-300',
    headerBg: 'bg-green-50',
    bulletBg: 'bg-green-50',
    bulletBorder: 'border-green-200',
    bulletText: 'text-green-500',
  },
};

const TAB_DEFS = [
  {
    id: 'summary',
    label: 'Career Profile',
    icon: Award,
    activeClass: 'border-blue-600 text-blue-600 bg-blue-50',
  },
  {
    id: 'aptitude',
    label: 'Aptitude Insights',
    icon: Brain,
    activeClass: 'border-amber-600 text-amber-600 bg-amber-50',
  },
  {
    id: 'foreign',
    label: 'Foreign Studies',
    icon: Globe,
    activeClass: 'border-cyan-600 text-cyan-600 bg-cyan-50',
  },
  {
    id: 'opportunities',
    label: 'Market Insights',
    icon: Briefcase,
    activeClass: 'border-blue-600 text-blue-600 bg-blue-50',
  },
  {
    id: 'pathways',
    label: 'Learning Paths',
    icon: GraduationCap,
    activeClass: 'border-green-600 text-green-600 bg-green-50',
  },
  {
    id: 'explore',
    label: 'AI Tools',
    icon: Sparkles,
    activeClass: 'border-purple-600 text-purple-600 bg-purple-50',
  },
];

const parseSections = (content = '') => {
  if (!content) return {};
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  const lines = normalized.split('\n');
  const sections = {};
  let current = null;
  let buffer = [];

  const isHeader = (line) =>
    /^[A-Z][A-Z\s&-]+$/.test(line.trim()) &&
    line.trim().length > 3 &&
    line.trim().length < 60 &&
    !/^\d/.test(line.trim());

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (current) buffer.push('');
      continue;
    }
    if (isHeader(line)) {
      if (current) sections[current] = buffer.join('\n').trim();
      current = line;
      buffer = [];
    } else {
      buffer.push(line);
    }
  }
  if (current) sections[current] = buffer.join('\n').trim();
  return sections;
};

const splitNumberedItems = (text = '') => {
  if (!text) return [];
  return text
    .split(/(?=^\s*\d+\.\s+)/m)
    .map((s) => s.trim())
    .filter((s) => /^\d+\.\s+/.test(s));
};

const splitBullets = (text = '') => {
  if (!text) return [];
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.startsWith('-'))
    .map((s) => s.replace(/^-+\s*/, '').trim());
};

const splitNumberedLines = (text = '') => {
  if (!text) return [];
  return text
    .split(/(?=^\s*\d+\.\s+)/m)
    .map((s) => s.trim())
    .filter((s) => /^\d+\.\s+/.test(s));
};

const renderNumberedCardGrid = (items, variant = 'indigo') => {
  const styles = {
    indigo: {
      card: 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200',
      pill: 'bg-indigo-600',
      text: 'text-indigo-800',
    },
    green: {
      card: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
      pill: 'bg-green-600',
      text: 'text-green-800',
    },
  }[variant] || {
    card: 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200',
    pill: 'bg-indigo-600',
    text: 'text-indigo-800',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      {items.map((raw, idx) => {
        // Strip leading "1. ", and collapse multi-line entries so the first line
        // is the title and the rest is the description.
        const cleaned = raw.replace(/^\d+\.\s+/, '').trim();
        let title = cleaned;
        let desc = '';

        // 1) Split on the first newline (AI sometimes puts title on one line, desc on next).
        const newlineIdx = cleaned.indexOf('\n');
        if (newlineIdx >= 0) {
          title = cleaned.slice(0, newlineIdx).trim();
          desc = cleaned.slice(newlineIdx + 1).trim().replace(/\n+/g, ' ');
        }

        // 2) If no newline, split on the first separator (dash, em-dash, en-dash, or colon).
        if (!desc) {
          const sepMatch = title.match(/^(.*?)\s*[-–—:]\s+(.+)$/);
          if (sepMatch) {
            title = sepMatch[1].trim();
            desc = sepMatch[2].trim();
          }
        }

        // 3) Strip a trailing colon from the title so it doesn't read like "Software Engineer:".
        title = title.replace(/[:\-–—]\s*$/, '').trim();

        return (
          <div key={idx} className={`border rounded-xl p-4 shadow-sm ${styles.card}`}>
            <div className="flex items-start gap-3 mb-2">
              <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold ${styles.pill}`}>
                {idx + 1}
              </div>
              <div className="flex-1">
                <h5 className={`font-bold ${styles.text} text-base leading-tight`}>{title}</h5>
                {desc && <p className="text-gray-700 text-sm leading-relaxed mt-1">{desc}</p>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const renderCollegeRecommendations = (content = '') => {
  const items = splitNumberedLines(content);
  // Some models occasionally omit numbering. Try to recover by parsing line-by-line.
  const recovered =
    items.length > 0
      ? items
      : content
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .filter((l) => l.length > 8)
          .map((l) => (l.startsWith('-') ? l.replace(/^-+\s*/, '') : l));

  if (recovered.length === 0) return renderRegularContent(content);

  // Render as cards, and support optional "(government/private)" labels.
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      {recovered.map((raw, idx) => {
        const text = raw.replace(/^\d+\.\s+/, '').trim();
        // Examples we want to handle:
        // "IIT Delhi (government) - why-fit"
        // "BITS Pilani - why-fit"
        // "BITS Pilani: why-fit"
        // "IIT Bombay — why-fit"
        const typeMatch = text.match(/^([^(]+)\(([^)]+)\)\s*[-–—:]?\s*(.*)$/);
        let name = text;
        let type = '';
        let desc = '';
        if (typeMatch) {
          name = (typeMatch[1] || '').trim();
          type = (typeMatch[2] || '').trim();
          desc = (typeMatch[3] || '').trim();
        } else {
          // Find the first separator (dash, em-dash, en-dash, or colon) and split there.
          const sepMatch = text.match(/^(.*?)\s*[-–—:]\s+(.+)$/);
          if (sepMatch) {
            name = sepMatch[1].trim();
            desc = sepMatch[2].trim();
          } else {
            name = text;
          }
        }

        const typeLower = type.toLowerCase();
        const typeChip =
          typeLower.includes('gov') || typeLower.includes('public')
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : typeLower
              ? 'bg-purple-100 text-purple-700 border border-purple-200'
              : '';

        return (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h6 className="font-semibold text-green-800 text-base leading-tight flex-1">
                {name}
              </h6>
              {type && (
                <span className={`self-start px-3 py-1 rounded-full text-xs font-medium shrink-0 ${typeChip}`}>
                  {type}
                </span>
              )}
            </div>
            {desc && <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>}
          </div>
        );
      })}
    </div>
  );
};

const splitCareerSections = (content = '') => {
  // Accept headers like: "1. ..." OR "1) ..." OR "1 - ..." OR "1: ..."
  // CRITICAL: Each top-level section number (1..5) must only open ONCE, and once
  // section 5 ("Your Next Steps") is open we lock further headers — otherwise the
  // numbered sub-bullets inside Next Steps (1. Immediate..., 2. Extracurricular...)
  // get mis-parsed as new top-level sections and Section 5 ends up empty.
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const sections = [];
  let current = null;
  let buf = [];
  const seen = new Set();
  let inFinalSection = false;

  const header = (line) => {
    const m = line.trim().match(/^(\d)\s*(?:[.)\-:])\s*(.+)/);
    if (!m) return null;
    const n = parseInt(m[1], 10);
    if (n < 1 || n > 5) return null;
    if (seen.has(n)) return null;
    if (inFinalSection) return null;
    return { n, raw: `${m[1]}. ${m[2].trim()}` };
  };

  for (const line of lines) {
    const h = header(line);
    if (h) {
      if (current) sections.push({ title: current, content: buf.join('\n').trim() });
      current = h.raw;
      buf = [];
      seen.add(h.n);
      if (h.n === 5) inFinalSection = true;
      continue;
    }
    buf.push(line);
  }
  if (current) sections.push({ title: current, content: buf.join('\n').trim() });
  return sections;
};

// Last-resort fallback: if Section 5 still came back empty for some reason,
// scan the raw report text for a "Next Steps" heading and return everything after it.
const extractNextStepsFallback = (content = '') => {
  if (!content) return '';
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const match = normalized.match(/(?:^|\n)\s*5\s*[.)\-:]\s*[^\n]*next\s*steps[^\n]*\n([\s\S]*)/i)
    || normalized.match(/(?:^|\n)\s*Your\s+Next\s+Steps[^\n]*\n([\s\S]*)/i)
    || normalized.match(/(?:^|\n)\s*Next\s+Steps[^\n]*\n([\s\S]*)/i);
  return match ? match[1].trim() : '';
};

const exportReportAsPDF = ({
  reportContent,
  marketInsights,
  learningPaths,
  foreignStudies,
  aptitudeScores,
  aptitudeRecs,
  setError,
}) => {
  const hasAnything =
    reportContent || marketInsights || learningPaths || foreignStudies || aptitudeScores;
  if (!hasAnything) {
    setError('Please wait for the report to be generated before exporting.');
    return;
  }

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 18;
    const maxLineWidth = pageWidth - margin * 2;
    const FOOTER_RESERVE = 18;
    let currentY = margin;

    const COLORS = {
      brand: [40, 80, 180],
      brandSoft: [120, 130, 200],
      sectionBar: [40, 80, 180],
      subTitle: [50, 70, 150],
      muted: [110, 110, 110],
      text: [40, 40, 40],
      bullet: [70, 90, 160],
    };

    const ensureSpace = (needed = 8) => {
      if (currentY + needed > pageHeight - FOOTER_RESERVE) {
        pdf.addPage();
        currentY = margin;
      }
    };

    const addText = (text, options = {}) => {
      const {
        fontSize = 10,
        bold = false,
        color = COLORS.text,
        align = 'left',
        gap = 3,
        indent = 0,
      } = options;
      if (text === undefined || text === null) return;
      const str = String(text);
      if (!str.trim()) return;
      pdf.setFontSize(fontSize);
      pdf.setFont(undefined, bold ? 'bold' : 'normal');
      pdf.setTextColor(color[0], color[1], color[2]);
      const lineWidth = maxLineWidth - indent;
      const lines = pdf.splitTextToSize(str, lineWidth);
      const lineHeight = fontSize * 0.4 + 1;
      for (const line of lines) {
        ensureSpace(lineHeight);
        if (align === 'center') {
          pdf.text(line, pageWidth / 2, currentY, { align: 'center' });
        } else {
          pdf.text(line, margin + indent, currentY);
        }
        currentY += lineHeight;
      }
      currentY += gap;
    };

    const addBullet = (text, options = {}) => {
      const { fontSize = 10, color = COLORS.text } = options;
      if (!text || !String(text).trim()) return;
      pdf.setFontSize(fontSize);
      pdf.setFont(undefined, 'normal');
      const bulletX = margin + 2;
      const textX = margin + 7;
      const lineWidth = maxLineWidth - 7;
      const lines = pdf.splitTextToSize(String(text).trim(), lineWidth);
      const lineHeight = fontSize * 0.4 + 1;
      ensureSpace(lineHeight);
      pdf.setTextColor(COLORS.bullet[0], COLORS.bullet[1], COLORS.bullet[2]);
      pdf.text('•', bulletX, currentY);
      pdf.setTextColor(color[0], color[1], color[2]);
      for (let i = 0; i < lines.length; i += 1) {
        ensureSpace(lineHeight);
        pdf.text(lines[i], textX, currentY);
        currentY += lineHeight;
      }
      currentY += 1.5;
    };

    // Each top-level section (1..5) always starts on a fresh page so the
    // banners are visually consistent and never appear mid-page.
    const addSectionBanner = (title) => {
      pdf.addPage();
      currentY = margin;
      pdf.setFillColor(
        COLORS.sectionBar[0],
        COLORS.sectionBar[1],
        COLORS.sectionBar[2]
      );
      pdf.rect(0, currentY - 6, pageWidth, 16, 'F');
      // Slim accent stripe under the banner
      pdf.setFillColor(255, 195, 80);
      pdf.rect(0, currentY + 10, pageWidth, 1.2, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont(undefined, 'bold');
      pdf.setFontSize(15);
      pdf.text(title, margin, currentY + 4);
      currentY += 20;
    };

    const addSubTitle = (text) => {
      // Need room for the subtitle plus at least one content line so it never
      // ends up orphaned at the bottom of a page.
      ensureSpace(22);
      currentY += 2;
      addText(text, { fontSize: 12, bold: true, color: COLORS.subTitle, gap: 3 });
    };

    const renderParagraphsAndBullets = (block) => {
      block
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean)
        .forEach((para) => {
          if (para.startsWith('-') || para.includes('\n-')) {
            para
              .split('\n')
              .map((l) => l.trim())
              .filter((l) => l.startsWith('-'))
              .forEach((l) => addBullet(l.replace(/^-+\s*/, '')));
          } else {
            addText(para, { fontSize: 10, gap: 3 });
          }
        });
    };

    const renderNumberedAsBullets = (text) => {
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      let pendingPara = '';
      const flushPara = () => {
        if (pendingPara) {
          addText(pendingPara, { fontSize: 10, gap: 2 });
          pendingPara = '';
        }
      };
      for (const line of lines) {
        const m = line.match(/^(\d+)[.)\-:]\s*(.+)$/);
        if (m) {
          flushPara();
          addBullet(m[2]);
        } else if (line.startsWith('-')) {
          flushPara();
          addBullet(line.replace(/^-+\s*/, ''));
        } else {
          pendingPara = pendingPara ? `${pendingPara} ${line}` : line;
        }
      }
      flushPara();
    };

    const renderCareerSectionBody = (title, content) => {
      if (!content || !content.trim()) return;

      // Section 5 — Next Steps: numbered → bullets.
      if (title.startsWith('5.')) {
        renderNumberedAsBullets(content);
        return;
      }

      // Section 2 — Career Options: render Option blocks specially.
      if (title.startsWith('2.') && /Option\s+\d+:/i.test(content)) {
        const opts = content
          .split(/(?=Option\s+\d+:)/i)
          .map((s) => s.trim())
          .filter((s) => /Option\s+\d+:/i.test(s));
        opts.forEach((opt) => {
          const lines = opt.split('\n').map((l) => l.trim()).filter(Boolean);
          const head = lines[0] || '';
          ensureSpace(14);
          addText(head, {
            fontSize: 11,
            bold: true,
            color: COLORS.brand,
            gap: 1,
          });
          lines.slice(1).forEach((line) => {
            if (line.startsWith('-')) {
              addBullet(line.replace(/^-+\s*/, ''), { fontSize: 10 });
            } else {
              addText(line, { fontSize: 10, gap: 1 });
            }
          });
          currentY += 2;
        });
        return;
      }

      renderParagraphsAndBullets(content);
    };

    const renderUppercaseSections = (text) => {
      const sections = parseSections(text);
      const keys = Object.keys(sections);
      if (keys.length === 0) {
        renderParagraphsAndBullets(text);
        return;
      }
      keys.forEach((title) => {
        const body = (sections[title] || '').trim();
        addSubTitle(title);
        if (!body) return;

        body
          .split('\n\n')
          .map((p) => p.trim())
          .filter(Boolean)
          .forEach((para) => {
            const firstLine = para.split('\n')[0].trim();
            // Country chips line e.g. "USA · UK · Canada"
            if (
              /[·•|]/.test(firstLine) &&
              firstLine.length < 90 &&
              !/^\d/.test(firstLine)
            ) {
              addText(firstLine, {
                fontSize: 11,
                bold: true,
                color: COLORS.subTitle,
                gap: 2,
              });
              const rest = para.split('\n').slice(1).join('\n').trim();
              if (rest) renderParagraphsAndBullets(rest);
              return;
            }

            // Numbered list?
            const numbered = para
              .split('\n')
              .map((l) => l.trim())
              .filter((l) => /^\d+[.)\-:]\s+/.test(l));
            if (numbered.length >= 2) {
              numbered.forEach((line) => {
                const cleaned = line.replace(/^\d+[.)\-:]\s*/, '');
                addBullet(cleaned);
              });
              return;
            }

            // Bullet list?
            if (para.startsWith('-') || para.includes('\n-')) {
              para
                .split('\n')
                .map((l) => l.trim())
                .filter((l) => l.startsWith('-'))
                .forEach((l) => addBullet(l.replace(/^-+\s*/, '')));
              return;
            }

            addText(para, { fontSize: 10, gap: 3 });
          });
      });
    };

    // ───────────── COVER PAGE ─────────────
    // Top hero banner (full-width filled rectangle with brand)
    const heroHeight = 70;
    pdf.setFillColor(
      COLORS.brand[0],
      COLORS.brand[1],
      COLORS.brand[2]
    );
    pdf.rect(0, 0, pageWidth, heroHeight, 'F');
    // Gold accent stripe at the bottom of the hero
    pdf.setFillColor(255, 195, 80);
    pdf.rect(0, heroHeight, pageWidth, 1.5, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(34);
    pdf.text('CAREER BEACON', pageWidth / 2, 33, { align: 'center' });

    pdf.setFontSize(9.5);
    pdf.setTextColor(180, 200, 240);
    pdf.text(
      'Your Personalized Career Companion',
      pageWidth / 2,
      55,
      { align: 'center' }
    );

    // Body of the cover starts below the hero
    currentY = heroHeight + 18;

    addText('Student Career Report', {
      fontSize: 22,
      bold: true,
      color: COLORS.text,
      align: 'center',
      gap: 2,
    });
    addText('School Edition · Personalized Assessment', {
      fontSize: 11,
      color: COLORS.muted,
      align: 'center',
      gap: 6,
    });

    // Decorative short line under the title
    pdf.setDrawColor(
      COLORS.brand[0],
      COLORS.brand[1],
      COLORS.brand[2]
    );
    pdf.setLineWidth(1.2);
    pdf.line(pageWidth / 2 - 20, currentY, pageWidth / 2 + 20, currentY);
    currentY += 8;

    addText(
      `Generated on ${new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
      { fontSize: 11, color: COLORS.muted, align: 'center', gap: 14 }
    );

    addText(
      'This report is built from your assessment responses to help you discover the careers, study paths, and global opportunities that align best with your interests, strengths and personality.',
      { fontSize: 10, color: COLORS.text, gap: 10 }
    );

    addText("What's inside this report", {
      fontSize: 13,
      bold: true,
      color: COLORS.subTitle,
      gap: 6,
    });

    const coverItems = [
      {
        num: '1',
        title: 'Career Profile',
        desc: 'Personal profile, top 3 career matches and your next steps.',
      },
      {
        num: '2',
        title: 'Aptitude Insights',
        desc: 'Score breakdown across 9 skill categories and personalised recommendations.',
      },
      {
        num: '3',
        title: 'Foreign Studies',
        desc: 'Countries, universities, scholarships, tests and application tips tailored to you.',
      },
      {
        num: '4',
        title: 'Market Insights',
        desc: 'Career exploration, stream impact, skill development and future scope.',
      },
      {
        num: '5',
        title: 'Learning Paths',
        desc: 'Top Indian colleges, entrance exams, subject combinations and roadmap.',
      },
    ];

    coverItems.forEach((item) => {
      const itemTopY = currentY;
      const circleR = 4.2;
      const circleX = margin + circleR;
      const circleY = itemTopY + 3.2;

      // Number disc
      pdf.setFillColor(
        COLORS.brand[0],
        COLORS.brand[1],
        COLORS.brand[2]
      );
      pdf.circle(circleX, circleY, circleR, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont(undefined, 'bold');
      pdf.setFontSize(10);
      pdf.text(item.num, circleX, circleY + 1.6, { align: 'center' });

      // Title
      pdf.setTextColor(
        COLORS.text[0],
        COLORS.text[1],
        COLORS.text[2]
      );
      pdf.setFontSize(11.5);
      pdf.setFont(undefined, 'bold');
      pdf.text(item.title, margin + 13, itemTopY + 2.5);

      // Description
      pdf.setFontSize(9.5);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(
        COLORS.muted[0],
        COLORS.muted[1],
        COLORS.muted[2]
      );
      const descLines = pdf.splitTextToSize(item.desc, maxLineWidth - 13);
      let descY = itemTopY + 7.5;
      descLines.forEach((line) => {
        pdf.text(line, margin + 13, descY);
        descY += 4.4;
      });

      currentY = descY + 3;
    });

    // ───────────── 1. CAREER PROFILE ─────────────
    if (reportContent && reportContent.trim()) {
      addSectionBanner('1. Career Profile');
      const sections = splitCareerSections(reportContent);
      if (sections.length > 0) {
        sections.forEach((s) => {
          addSubTitle(s.title);
          renderCareerSectionBody(s.title, s.content);
        });
        const hasFive = sections.some((s) => (s.title || '').startsWith('5.'));
        if (!hasFive) {
          const fb = extractNextStepsFallback(reportContent);
          if (fb) {
            addSubTitle('5. Your Next Steps');
            renderNumberedAsBullets(fb);
          }
        }
      } else {
        renderParagraphsAndBullets(reportContent);
      }
    }

    // ───────────── 2. APTITUDE INSIGHTS ─────────────
    if (aptitudeScores) {
      addSectionBanner('2. Aptitude Insights');
      const { buckets, topThree, totalCorrect, totalQuestions } = aptitudeScores;
      addText(
        `You scored ${totalCorrect}/${totalQuestions} on the aptitude section.`,
        { fontSize: 11, bold: true, color: COLORS.text, gap: 5 }
      );

      addSubTitle('Top 3 Strengths');
      topThree.forEach((b, i) => addBullet(`${i + 1}. ${b.name}`));

      addSubTitle('Score Breakdown (out of 10)');
      buckets.forEach((b) => {
        addText(
          `${b.name}: ${b.score}/10  (${b.correct}/${b.total} correct)`,
          { fontSize: 10, gap: 1.5 }
        );
      });
      currentY += 3;

      const recsText =
        aptitudeRecs && aptitudeRecs.trim()
          ? aptitudeRecs
          : APTITUDE_FALLBACK_RECS;
      const recsSections = parseSections(recsText);
      const renderRecGroup = (key, label) => {
        const body = recsSections[key];
        if (!body) return;
        addSubTitle(label);
        splitBullets(body).forEach((b) => addBullet(b));
      };
      renderRecGroup('BOOKS', 'Books');
      renderRecGroup('APPS AND GAMES', 'Apps & Games');
      renderRecGroup('TECHNIQUES', 'Techniques');
    }

    // ───────────── 3. FOREIGN STUDIES ─────────────
    if (foreignStudies && foreignStudies.trim()) {
      addSectionBanner('3. Foreign Studies');
      renderUppercaseSections(foreignStudies);
    }

    // ───────────── 4. MARKET INSIGHTS ─────────────
    if (marketInsights && marketInsights.trim()) {
      addSectionBanner('4. Market Insights');
      renderUppercaseSections(marketInsights);
    }

    // ───────────── 5. LEARNING PATHS ─────────────
    if (learningPaths && learningPaths.trim()) {
      addSectionBanner('5. Learning Paths');
      renderUppercaseSections(learningPaths);
    }

    // ───────────── Footer (page numbers + branding on every page) ─────────────
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i += 1) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(140, 140, 140);
      pdf.text('Career Beacon', margin, pageHeight - 8);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, {
        align: 'right',
      });
    }

    pdf.save('career-beacon-student-report.pdf');
  } catch (err) {
    console.error('PDF Export Error:', err);
    setError('Failed to export PDF. Please try again.');
  }
};

// ─── Sub-renderers ───────────────────────────────────────────────────────────

const RecommendationCard = ({ title, icon: Icon, items, tone }) => {
  const toneClasses = {
    amber: { ring: 'border-amber-200', soft: 'bg-amber-50', text: 'text-amber-700' },
    purple: { ring: 'border-purple-200', soft: 'bg-purple-50', text: 'text-purple-700' },
    emerald: { ring: 'border-emerald-200', soft: 'bg-emerald-50', text: 'text-emerald-700' },
  };
  const t = toneClasses[tone] || toneClasses.amber;
  const list = items && items.length > 0 ? items : ['Recommendations are being personalized.'];
  return (
    <div className={`rounded-xl border ${t.ring} ${t.soft} p-4 md:p-5`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-5 w-5 ${t.text}`} />
        <h4 className={`font-bold ${t.text}`}>{title}</h4>
      </div>
      <ul className="space-y-2">
        {list.map((item, i) => (
          <li key={i} className="flex items-start text-sm text-gray-700 leading-relaxed">
            <span className={`${t.text} mr-2 mt-0.5 font-bold`}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const renderRegularContent = (content) => {
  const paragraphs = content.split('\n\n').filter((p) => p.trim());
  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => {
        const trimmed = paragraph.trim();
        if (trimmed.includes('\n-') || trimmed.startsWith('-')) {
          const bullets = trimmed.split('\n').filter((l) => l.trim().startsWith('-'));
          return (
            <div key={index} className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
              <div className="space-y-2">
                {bullets.map((b, i) => (
                  <div key={i} className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-1 text-lg font-bold">•</span>
                    <p className="text-gray-700 leading-relaxed flex-1">
                      {b.trim().substring(1).trim()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm"
          >
            <p className="text-gray-700 leading-relaxed">{trimmed}</p>
          </div>
        );
      })}
    </div>
  );
};

const renderCareerOptions = (content) => {
  const options = content
    .split(/(?=Option\s+\d+:)/i)
    .map((s) => s.trim())
    .filter((s) => s && /Option\s+\d+:/i.test(s));
  return (
    <div className="space-y-6">
      {options.map((option, index) => {
        const lines = option.split('\n');
        const titleMatch = lines[0].match(/Option\s+(\d+):\s*(.+)/i);
        const optNum = titleMatch ? titleMatch[1] : `${index + 1}`;
        const careerTitle = titleMatch ? titleMatch[2].trim() : 'Career Option';
        const bullets = lines
          .slice(1)
          .filter((l) => l.trim().startsWith('-'))
          .map((l) => l.trim().substring(1).trim());
        return (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 border border-blue-200 shadow-sm"
          >
            <h4 className="text-lg md:text-xl font-bold text-blue-800 mb-6 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-4 font-bold">
                {optNum}
              </span>
              {careerTitle}
            </h4>
            <div className="space-y-3">
              {bullets.map((point, idx) => {
                const colon = point.indexOf(':');
                if (colon === -1) return null;
                const label = point.substring(0, colon).trim();
                const body = point.substring(colon + 1).trim();
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-md p-3 sm:p-5 border border-blue-100 shadow-sm"
                  >
                    <h5 className="font-semibold text-blue-700 mb-2 text-sm">{label}</h5>
                    <p className="text-gray-600 leading-relaxed text-sm">{body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const getSectionByNumber = (sections, n) => {
  const s = sections.find((x) => (x.title || '').startsWith(`${n}.`));
  return s ? (s.content || '').trim() : '';
};

const renderSingleCareerOptionCompact = (optionBlock, idx) => {
  const lines = optionBlock.split('\n').map((l) => l.trim()).filter(Boolean);
  const titleLine = lines[0] || '';
  const titleMatch = titleLine.match(/Option\s+(\d+):\s*(.+)/i);
  const optNum = titleMatch ? titleMatch[1] : `${idx + 1}`;
  const careerTitle = titleMatch ? titleMatch[2].trim() : titleLine.replace(/^Option\s+\d+:\s*/i, '').trim() || 'Career Option';

  const bullets = lines
    .slice(1)
    .filter((l) => l.startsWith('-'))
    .map((l) => l.replace(/^-+\s*/, ''))
    .map((t) => {
      const colon = t.indexOf(':');
      if (colon === -1) return { label: '', body: t };
      return { label: t.slice(0, colon).trim(), body: t.slice(colon + 1).trim() };
    });

  const pick = (needle) => bullets.find((b) => b.label.toLowerCase().includes(needle))?.body || '';
  const alignment = pick('alignment') || pick('profile');
  const day = pick('day');
  const path = pick('educational') || pick('path');
  const growth = pick('growth');

  const rows = [
    { label: 'Why it fits', value: alignment },
    { label: 'Day-to-day', value: day },
    { label: 'Path', value: path },
    { label: 'Growth', value: growth },
  ].filter((r) => r.value);

  return (
    <div className="bg-white border border-blue-200 rounded-xl p-4 md:p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {optNum}
        </div>
        <div className="flex-1">
          <h4 className="text-base md:text-lg font-bold text-blue-900 leading-tight">
            {careerTitle}
          </h4>
        </div>
      </div>
      {rows.length > 0 ? (
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.label} className="text-sm leading-relaxed">
              <span className="font-semibold text-blue-800">{r.label}:</span>{' '}
              <span className="text-gray-700">{r.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-700 whitespace-pre-line">{optionBlock}</div>
      )}
    </div>
  );
};

const renderCareerProfileRedesigned = (content) => {
  const sections = splitCareerSections(content);
  if (sections.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden p-4 md:p-8">
        {renderRegularContent(content)}
      </div>
    );
  }

  const s1 = getSectionByNumber(sections, 1);
  const s2 = getSectionByNumber(sections, 2);
  const s3 = getSectionByNumber(sections, 3);
  const s4 = getSectionByNumber(sections, 4);
  let s5 = getSectionByNumber(sections, 5);
  if (!s5) s5 = extractNextStepsFallback(content);

  const introParas = (s1 || '')
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 3);

  const options = (s2 || '')
    .split(/(?=Option\s+\d+:)/i)
    .map((s) => s.trim())
    .filter((s) => s && /Option\s+\d+:/i.test(s));

  return (
    <div className="space-y-8">
      {/* HERO: Student profile intro */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 shadow-lg">
            <Award className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Your Career Profile
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              A personalized snapshot based on your assessment.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 p-4 md:p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Profile Summary
            </p>
            <div className="space-y-3">
              {introParas.length > 0 ? (
                introParas.map((p, idx) => (
                  <p key={idx} className="text-gray-800 leading-relaxed text-sm md:text-base">
                    {p}
                  </p>
                ))
              ) : (
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {s1}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top career matches */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 md:px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <h3 className="text-lg md:text-xl font-bold">Top Career Matches</h3>
          <p className="text-blue-100 text-sm mt-1">
            Three directions that best match your interests, strengths and preferences.
          </p>
        </div>
        <div className="p-4 md:p-8">
          {options.length > 0 ? (
            <div className="space-y-4">
              {options.map((opt, idx) => (
                <React.Fragment key={idx}>
                  {renderSingleCareerOptionCompact(opt, idx)}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6">
              {renderRegularContent(s2 || '')}
            </div>
          )}
        </div>
      </div>

      {/* Next steps */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 md:px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <h3 className="text-lg md:text-xl font-bold">Your Next Steps</h3>
          <p className="text-purple-100 text-sm mt-1">
            Pick the 2–3 actions that feel easiest to start this week.
          </p>
        </div>
        <div className="p-4 md:p-8">
          {s5 ? (
            renderNextStepsContent(s5)
          ) : (
            <div className="space-y-3">
              {[
                'Pick 1 academic focus for the next 4 weeks and block 30 minutes a day for it.',
                'Join one club or activity that matches your top career match.',
                'Build one specific skill (course/project) tied to your career goals.',
                'Pick a high-quality online resource and finish at least one module.',
                'Have a 15-minute career conversation with a parent or mentor this week.',
              ].map((step, i) => (
                <div key={i} className="flex items-start ml-2 sm:ml-4">
                  <span className="text-purple-500 mr-3 mt-1 text-lg font-bold">•</span>
                  <p className="text-gray-700 leading-relaxed flex-1">{step}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Optional: compact academic/pathway info to reduce repetition */}
      {(s3 || s4) && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 md:px-8 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-base md:text-lg font-bold text-gray-900">
              Academic Plan (Quick View)
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Kept concise to avoid repeating other tabs.
            </p>
          </div>
          <div className="p-4 md:p-8 space-y-6">
            {s3 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Academic Action Plan</h4>
                {renderRegularContent(s3)}
              </div>
            )}
            {s4 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Educational Pathway</h4>
                {renderRegularContent(s4)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const formatReportContent = (content) => {
  if (!content) return null;
  const sections = splitCareerSections(content);

  // If the AI didn't follow the "1. / 2. / 3." headings strictly,
  // fall back to a clean plain-text layout instead of rendering nothing.
  if (sections.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-4 md:px-8 md:py-6">
          <div className="flex items-center text-white">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 md:p-3 mr-3 md:mr-4">
              <span className="text-white font-bold text-lg md:text-xl">1</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold">Your Career Profile</h2>
          </div>
        </div>
        <div className="p-4 md:p-8">{renderRegularContent(content)}</div>
      </div>
    );
  }

  // Use the redesigned layout for the Career Profile tab to make it consistent and non-repetitive.
  return renderCareerProfileRedesigned(content);
};

// Render section 5 ("Next Steps") so numbered 6–10 become bullets inside the section.
const renderNextStepsContent = (content) => {
  const lines = content.split('\n').filter((l) => l.trim());
  const blocks = [];
  let paragraph = '';

  for (const line of lines) {
    const trimmed = line.trim();
    const numberMatch = trimmed.match(/^(\d+)\.\s*(.+)/);

    // Any numbered sub-lines inside Next Steps should become bullet rows.
    if (numberMatch) {
      if (paragraph) {
        blocks.push(paragraph.trim());
        paragraph = '';
      }
      blocks.push(`• ${numberMatch[2]}`);
      continue;
    }

    if (paragraph) paragraph += ' ' + trimmed;
    else paragraph = trimmed;
  }

  if (paragraph) blocks.push(paragraph.trim());

  return (
    <div className="space-y-4">
      {blocks.map((b, idx) => {
        const t = b.trim();
        if (t.startsWith('•')) {
          return (
            <div key={idx} className="flex items-start ml-2 sm:ml-4">
              <span className="text-purple-500 mr-3 mt-1 text-lg font-bold">•</span>
              <p className="text-gray-700 leading-relaxed flex-1">{t.substring(1).trim()}</p>
            </div>
          );
        }
        return (
          <div key={idx} className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-200">
            <p className="text-gray-800 leading-relaxed">{t}</p>
          </div>
        );
      })}
    </div>
  );
};

const renderUpperSections = (content, accent = 'blue') => {
  if (!content) return null;
  const sections = parseSections(content);
  const keys = Object.keys(sections);
  const styles = ACCENT_STYLES[accent] || ACCENT_STYLES.blue;
  if (keys.length === 0) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">{content}</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {keys.map((title) => (
        <div key={title}>
          <h4
            className={`text-base md:text-lg font-bold text-gray-800 mb-4 border-b-2 pb-2 p-2 sm:p-3 rounded-md ${styles.headerBorder} ${styles.headerBg}`}
          >
            {title}
          </h4>
          <div className="space-y-3">
            {(() => {
              const body = (sections[title] || '').trim();
              if (!body) return null;

              // Special: render Indian college recommendations as cards.
              if (title.toUpperCase().includes('COLLEGE')) {
                return renderCollegeRecommendations(body);
              }

              // Special: Career exploration should be consistent + scannable.
              if (title.toUpperCase().includes('CAREER EXPLORATION')) {
                const items = splitNumberedLines(body);
                if (items.length > 0) {
                  return renderNumberedCardGrid(items, 'indigo');
                }
              }

              // If the section contains a list of numbered items (common in Learning Paths),
              // render them in a grid so content doesn't collapse into a single blob.
              const numbered = splitNumberedLines(body);
              if (numbered.length >= 3) {
                return renderNumberedCardGrid(
                  numbered,
                  accent === 'green' ? 'green' : 'indigo'
                );
              }

              // Otherwise, keep the existing paragraph/bullet rendering.
              return body
                .split('\n\n')
                .map((p) => p.trim())
                .filter(Boolean)
                .map((para, i) => {
                  if (para.includes('\n-') || para.startsWith('-')) {
                    const bullets = para.split('\n').filter((l) => l.trim().startsWith('-'));
                    return (
                      <div
                        key={i}
                        className={`p-3 sm:p-4 rounded-lg border ${styles.bulletBg} ${styles.bulletBorder}`}
                      >
                        <div className="space-y-2">
                          {bullets.map((b, j) => (
                            <div key={j} className="flex items-start">
                              <span className={`mr-3 mt-1 font-bold ${styles.bulletText}`}>•</span>
                              <p className="text-gray-700 leading-relaxed flex-1 text-sm">
                                {b.trim().substring(1).trim()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  if (/^\d+\.\s/.test(para)) {
                    return (
                      <div
                        key={i}
                        className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm"
                      >
                        <p className="text-gray-800 leading-relaxed text-sm font-medium whitespace-pre-line">
                          {para}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={i}
                      className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <p className="text-gray-700 leading-relaxed text-sm">{para}</p>
                    </div>
                  );
                });
            })()}
          </div>
        </div>
      ))}
    </div>
  );
};

const renderAptitudeTab = (aptitudeScores, aptitudeRecs) => {
  if (!aptitudeScores) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600">Calculating aptitude profile...</p>
      </div>
    );
  }
  const { buckets, topThree, totalCorrect, totalQuestions } = aptitudeScores;
  const recsSections = parseSections(aptitudeRecs || APTITUDE_FALLBACK_RECS);
  let books = splitBullets(recsSections.BOOKS);
  let apps = splitBullets(recsSections['APPS AND GAMES']);
  let techniques = splitBullets(recsSections.TECHNIQUES);

  // If the AI returns malformed sections (no bullets), always fall back to the curated list.
  if (books.length === 0 && apps.length === 0 && techniques.length === 0) {
    const fallbackSections = parseSections(APTITUDE_FALLBACK_RECS);
    books = splitBullets(fallbackSections.BOOKS);
    apps = splitBullets(fallbackSections['APPS AND GAMES']);
    techniques = splitBullets(fallbackSections.TECHNIQUES);
  }
  const themeFor = (idx) => BUCKET_THEMES[idx % BUCKET_THEMES.length];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-4 md:p-8 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-4">
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 shadow-lg">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Aptitude Insights</h2>
            <p className="text-gray-600 text-base md:text-lg">
              You scored {totalCorrect}/{totalQuestions} on the aptitude section
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Top 3 Strengths
          </p>
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            {topThree.map((b, i) => {
              const Icon = BUCKET_ICONS[b.key] || Award;
              const t = themeFor(i);
              return (
                <div
                  key={b.key}
                  className={`flex flex-col items-center text-center rounded-xl p-3 md:p-4 border ${t.ring} ${t.soft}`}
                >
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-white border ${t.ring} mb-2 shadow-sm`}
                  >
                    <Icon className={`h-6 w-6 ${t.text}`} />
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-gray-800 leading-tight">
                    {b.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed">
          Aptitude assessment measures cognitive skills across attention, problem-solving,
          reasoning, and accuracy. The bars below show how you scored across nine skill
          categories on a scale of 0 to 10. Higher bars indicate areas where your thinking is
          sharper today — lower bars are clear opportunities to grow.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-8 border border-gray-200 shadow-sm">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">Score Breakdown</h3>
        <div className="space-y-4">
          {buckets.map((b, i) => {
            const t = themeFor(i);
            const widthPct = b.score * 10;
            return (
              <div key={b.key} className="flex items-center gap-3 md:gap-4">
                <div className="w-32 md:w-48 flex-shrink-0">
                  <p className="text-sm font-medium text-gray-800 leading-tight">{b.name}</p>
                  <p className="text-[11px] text-gray-400">
                    {b.correct}/{b.total} correct
                  </p>
                </div>
                <div className="flex-1 h-3 md:h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${t.bar} rounded-full transition-all duration-700`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
                <div
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-full ${t.bar} text-white flex items-center justify-center font-bold text-sm md:text-base shadow flex-shrink-0`}
                >
                  {b.score}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-8 border border-gray-200 shadow-sm">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Recommendations</h3>
        <p className="text-sm text-gray-500 mb-6">
          Curated picks to strengthen your weakest area and level up your top strengths.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RecommendationCard title="Books" icon={BookOpen} items={books} tone="amber" />
          <RecommendationCard title="Apps & Games" icon={Zap} items={apps} tone="purple" />
          <RecommendationCard title="Techniques" icon={Lightbulb} items={techniques} tone="emerald" />
        </div>
      </div>
    </div>
  );
};

const renderForeignStudiesTab = (foreignStudies, allContentLoaded) => {
  if (!allContentLoaded && !foreignStudies) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600">Curating your global study options...</p>
      </div>
    );
  }
  if (!foreignStudies) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-yellow-800 text-sm">
          We couldn't load global study suggestions this time. Please retry the report.
        </p>
      </div>
    );
  }

  const sections = parseSections(foreignStudies);
  const countriesText = sections['COUNTRIES TO CONSIDER'] || '';
  const universities = splitNumberedItems(sections['UNIVERSITIES'] || '');
  const scholarships = splitNumberedItems(sections['SCHOLARSHIPS'] || '');
  const tests = splitNumberedItems(sections['TESTS'] || '');
  const tips = splitBullets(sections['APPLICATION TIPS'] || '');
  const actionPlan = splitNumberedItems(sections['ACTION PLAN'] || '');

  const countryChipsLine = countriesText.split('\n')[0] || '';
  const countriesIntro = countriesText.split('\n').slice(1).join('\n').trim();
  const chips = countryChipsLine
    .split(/[·•|,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-4">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-4 shadow-lg">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Foreign Studies</h2>
            <p className="text-gray-600 text-base md:text-lg">
              A tailored global path: countries, universities, scholarships, and exams.
            </p>
          </div>
        </div>
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {chips.map((c) => (
              <span
                key={c}
                className="px-3 py-1.5 rounded-full bg-white/80 border border-cyan-200 text-cyan-800 text-xs font-semibold shadow-sm"
              >
                {c}
              </span>
            ))}
          </div>
        )}
        {countriesIntro && (
          <p className="text-sm text-gray-700 leading-relaxed">{countriesIntro}</p>
        )}
      </div>

      {universities.length > 0 && (
        <div className="bg-white rounded-2xl p-4 md:p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4 gap-3">
            <GraduationCap className="h-6 w-6 text-indigo-500" />
            <h3 className="text-lg md:text-xl font-bold text-gray-800">Universities</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {universities.map((u, i) => {
              const m = u.match(/^\d+\.\s+([^(\-]+?)\s*(?:\(([^)]+)\))?\s*[-–]\s*(.+)$/s);
              let name = u.replace(/^\d+\.\s+/, '');
              let country = '';
              let why = '';
              if (m) {
                name = (m[1] || '').trim();
                country = (m[2] || '').trim();
                why = (m[3] || '').trim();
              }
              return (
                <div
                  key={i}
                  className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h5 className="font-bold text-indigo-800 text-base leading-tight flex-1">
                      {name}
                    </h5>
                    {country && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-semibold border border-indigo-200">
                        {country}
                      </span>
                    )}
                  </div>
                  {why && <p className="text-gray-700 text-sm leading-relaxed">{why}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {scholarships.length > 0 && (
        <div className="bg-white rounded-2xl p-4 md:p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4 gap-3">
            <Award className="h-6 w-6 text-emerald-500" />
            <h3 className="text-lg md:text-xl font-bold text-gray-800">Scholarships</h3>
          </div>
          <div className="space-y-3">
            {scholarships.map((s, i) => {
              const text = s.replace(/^\d+\.\s+/, '');
              const dashIdx = text.search(/\s+[-–]\s+/);
              const name = dashIdx >= 0 ? text.slice(0, dashIdx) : text;
              const detail = dashIdx >= 0 ? text.slice(dashIdx).replace(/^\s+[-–]\s+/, '') : '';
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 md:p-4"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-emerald-900 text-sm md:text-base">
                      {name.trim()}
                    </p>
                    {detail && (
                      <p className="text-gray-700 text-sm leading-relaxed mt-1">{detail.trim()}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tests.length > 0 && (
        <div className="bg-white rounded-2xl p-4 md:p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4 gap-3">
            <Target className="h-6 w-6 text-purple-500" />
            <h3 className="text-lg md:text-xl font-bold text-gray-800">Standardized Tests</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tests.map((t, i) => {
              const text = t.replace(/^\d+\.\s+/, '');
              const dashIdx = text.search(/\s+[-–]\s+/);
              const name = dashIdx >= 0 ? text.slice(0, dashIdx) : text;
              const tip = dashIdx >= 0 ? text.slice(dashIdx).replace(/^\s+[-–]\s+/, '') : '';
              return (
                <div
                  key={i}
                  className="bg-purple-50 border border-purple-200 rounded-xl p-3 md:p-4"
                >
                  <p className="font-bold text-purple-800 text-sm md:text-base">{name.trim()}</p>
                  {tip && <p className="text-gray-700 text-sm leading-relaxed mt-1">{tip.trim()}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.length > 0 && (
          <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-4 gap-3">
              <Lightbulb className="h-6 w-6 text-amber-500" />
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Application Tips</h3>
            </div>
            <ul className="space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-amber-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700 text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {actionPlan.length > 0 && (
          <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-4 gap-3">
              <Compass className="h-6 w-6 text-cyan-500" />
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Action Plan</h3>
            </div>
            <ol className="space-y-3">
              {actionPlan.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {step.replace(/^\d+\.\s+/, '')}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main exported component ─────────────────────────────────────────────────

const SchoolReportTabs = ({
  reportContent,
  marketInsights,
  learningPaths,
  foreignStudies,
  aptitudeScores,
  aptitudeRecs,
  allContentLoaded,
  setError,
  headerSubtitle,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');

  const renderExploreContent = () => (
    <div className="space-y-8">
      <div className="text-center py-8">
        <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2 mb-4">
          <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
          <span className="text-purple-700 font-medium text-sm">Discover More Features</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Supercharge Your Career Journey</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Take your career to the next level with our AI-powered tools and personalized learning experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="group bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-2xl hover:scale-105">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 mr-4 group-hover:scale-110 transition-transform duration-300">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">Career Beacon Assistant</h3>
              <p className="text-purple-600 font-medium">Career Counselor</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Get personalized career guidance 24/7 from our AI-powered counselor.
          </p>
          <button
            onClick={() => navigate('/assistant')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
          >
            Start Chatting
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        <div className="group bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-2xl hover:scale-105">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 mr-4 group-hover:scale-110 transition-transform duration-300">
              <SkillIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">Upskill Hub</h3>
              <p className="text-emerald-600 font-medium">Skill Development</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Enhance your skills with curated courses, certifications, and hands-on projects.
          </p>
          <button
            onClick={() => navigate('/upskilling')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center"
          >
            Start Learning
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row gap-4 md:gap-2 items-start md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">
                  Your Personalized Career Report
                </h1>
                <p className="text-blue-100 text-sm md:text-base">
                  {headerSubtitle || `School Edition · Generated on ${new Date().toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:space-x-3">
                <button
                  onClick={() =>
                    exportReportAsPDF({
                      reportContent,
                      marketInsights,
                      learningPaths,
                      foreignStudies,
                      aptitudeScores,
                      aptitudeRecs,
                      setError: setError || (() => {}),
                    })
                  }
                  className="bg-white text-blue-700 px-4 py-2 rounded-md hover:bg-blue-50 transition shadow-md flex items-center justify-center text-sm font-medium"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition shadow-md flex items-center justify-center text-sm font-medium"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto whitespace-nowrap">
            <nav className="flex px-2 sm:px-4 md:px-8">
              {TAB_DEFS.map(({ id, label, icon: Icon, activeClass }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`px-3 sm:px-6 py-3 sm:py-4 font-semibold text-sm border-b-2 transition-all duration-300 ${
                      isActive
                        ? activeClass
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Body */}
          <div
            id="report-container"
            className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-50"
          >
            {activeTab === 'summary' && (
              <div className="space-y-6 md:space-y-8">
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 opacity-10 rounded-2xl" />
                  <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 md:p-8 border border-blue-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-3 md:p-4 mr-4 md:mr-6 shadow-lg">
                          <Award className="h-8 md:h-10 w-8 md:w-10 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                            Your Career Profile
                          </h2>
                          <p className="text-gray-600 text-base md:text-lg">
                            Comprehensive analysis
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {reportContent ? (
                  <div className="space-y-8">{formatReportContent(reportContent)}</div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-12 text-center">
                    <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-6" />
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
                      Creating Your Personalized Report
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Our AI is analyzing your responses. This may take a moment.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'aptitude' && renderAptitudeTab(aptitudeScores, aptitudeRecs)}

            {activeTab === 'foreign' && renderForeignStudiesTab(foreignStudies, allContentLoaded)}

            {activeTab === 'opportunities' && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-4 md:p-8 border border-gray-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 shadow-lg">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                        Market Insights
                      </h2>
                      <p className="text-gray-600 text-base md:text-lg">
                        Current opportunities and industry trends
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-50/50 rounded-xl p-3 sm:p-6 border border-blue-100 shadow-sm">
                    {allContentLoaded ? (
                      renderUpperSections(marketInsights, 'blue')
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-gray-600">Loading market insights...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pathways' && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-4 md:p-8 border border-gray-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 shadow-lg">
                      <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                        Learning Paths
                      </h2>
                      <p className="text-gray-600 text-base md:text-lg">
                        Educational pathways and skill development
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-50/50 rounded-xl p-3 sm:p-6 border border-green-100 shadow-sm">
                    {allContentLoaded ? (
                      renderUpperSections(learningPaths, 'green')
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-gray-600">Loading learning pathways...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'explore' && renderExploreContent()}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 md:p-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs sm:text-sm text-center md:text-left">
              <p>Report generated on {new Date().toLocaleDateString()}</p>
              <p className="mt-2 md:mt-0">
                This report is an AI-generated guide based on your assessment responses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolReportTabs;
