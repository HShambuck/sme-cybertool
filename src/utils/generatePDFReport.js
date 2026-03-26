// src/utils/generatePDFReport.js
// Generates a formatted multi-page PDF security report using jsPDF
// No external API calls — uses scan data already in state

import jsPDF from "jspdf";

// ─── Colour palette (matches dashboard dark theme) ───────────────────────────
const COLOURS = {
  bg:          [2,   6,   23],   // #020617
  card:        [15,  23,  42],   // #0F172A
  border:      [30,  41,  59],   // slate-800
  white:       [255, 255, 255],
  muted:       [100, 116, 139],  // slate-500
  mutedLight:  [148, 163, 184],  // slate-400
  blue:        [59,  130, 246],  // blue-500
  emerald:     [16,  185, 129],  // emerald-500
  amber:       [245, 158, 11],   // amber-500
  orange:      [249, 115, 22],   // orange-500
  red:         [239, 68,  68],   // red-500
  critical:    [239, 68,  68],
  high:        [245, 158, 11],
  medium:      [234, 179, 8],
  low:         [59,  130, 246],
};

// ─── Severity helpers ─────────────────────────────────────────────────────────
const severityColour = (s) => ({
  critical: COLOURS.critical,
  high:     COLOURS.high,
  medium:   COLOURS.medium,
  low:      COLOURS.low,
}[s] || COLOURS.low);

const severityLabel = (s) => (s || "low").toUpperCase();

// ─── Score colour ─────────────────────────────────────────────────────────────
const scoreColour = (score) => {
  if (score >= 80) return COLOURS.emerald;
  if (score >= 60) return COLOURS.amber;
  if (score >= 40) return COLOURS.orange;
  return COLOURS.red;
};

// ─── Plain-English finding explanations (mirrors frontend map) ───────────────
const PLAIN_ENGLISH = {
  HEADER_001: "Browsers can silently switch to the insecure HTTP version of your site, allowing attackers to intercept traffic.",
  HEADER_002: "Attackers can inject malicious scripts into your pages that steal user data or hijack sessions.",
  HEADER_003: "Your site can be loaded inside a hidden iframe on a malicious website to trick users into clicking things they didn't intend to.",
  HEADER_004: "Browsers may misinterpret file types, allowing attackers to execute malicious files as scripts.",
  HEADER_005: "When users leave your site, the full URL they came from (including sensitive paths) is shared with the destination site.",
  HEADER_006: "Third-party scripts on your site could silently access the user's camera, microphone, or location.",
  HEADER_007: "Older browsers have no extra layer of protection against reflected cross-site scripting attacks.",
  TRANSPORT_001: "All data sent between your users and your server — including passwords and personal data — is visible to anyone intercepting the connection.",
  TRANSPORT_002: "Users who type your domain without https:// are never redirected to the secure version.",
  TRANSPORT_003: "Your SSL/TLS setup is weak. Attackers may be able to decrypt traffic or perform man-in-the-middle attacks.",
  TECH_003: "Your WordPress version is visible in the page source. Attackers use this to look up known vulnerabilities and target your site specifically.",
  TECH_004: "The jQuery version you are using has known security vulnerabilities that attackers can exploit to run malicious code on your pages.",
  TECH_005: "Your PHP version is no longer receiving security updates, meaning known vulnerabilities will never be patched.",
  TECH_001: "Your server software version is visible, making it easier for attackers to identify and exploit known vulnerabilities.",
  TECH_002: "Your backend technology stack is exposed, giving attackers a map of what to target.",
  CORS_001: "Any website on the internet can make requests to your server on behalf of your users.",
  CORS_002: "Your server accepts requests from any website, which can be used to steal data or perform actions on behalf of logged-in users.",
  CORS_003: "Attackers can make fully authenticated requests to your server from any website, completely bypassing your login protection.",
  COOKIE_001: "JavaScript on your page can read session cookies. If an attacker injects a script, they can steal login sessions.",
  COOKIE_002: "Session cookies can be transmitted over unencrypted connections, exposing them to interception.",
  COOKIE_003: "Your site is more vulnerable to cross-site request forgery, where a malicious site tricks users into making unintended requests.",
  REP_001: "Google has flagged this domain as dangerous. Users visiting your site see a browser warning and are advised not to proceed.",
  REP_002: "Automated analysis detected suspicious behaviour — unusual external requests, redirects, or resource loading patterns.",
};

const decodeHtml = (str) => {
  if (!str || typeof str !== "string") return str || "";
  return str
    .replace(/&amp;/g,  "&")
    .replace(/&lt;/g,   "<")
    .replace(/&gt;/g,   ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
};

// ─── PDF layout constants ─────────────────────────────────────────────────────
const PAGE_W   = 210; // A4 mm
const PAGE_H   = 297;
const MARGIN   = 18;
const COL_W    = PAGE_W - MARGIN * 2;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Fill full page background */
const fillPage = (doc) => {
  doc.setFillColor(...COLOURS.bg);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
};

/** Draw a rounded rectangle */
const roundRect = (doc, x, y, w, h, r, fillColour, strokeColour) => {
  if (fillColour) doc.setFillColor(...fillColour);
  if (strokeColour) doc.setDrawColor(...strokeColour);
  doc.roundedRect(x, y, w, h, r, r, fillColour ? (strokeColour ? "FD" : "F") : "D");
};

/** Wrap and draw text, returns new Y position */
const drawWrappedText = (doc, text, x, y, maxWidth, lineHeight = 5) => {
  const lines = doc.splitTextToSize(String(text), maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
};

/** Draw a horizontal rule */
const hr = (doc, y, colour = COLOURS.border) => {
  doc.setDrawColor(...colour);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
};

/** Add a new page with background */
const newPage = (doc) => {
  doc.addPage();
  fillPage(doc);
};

/** Check if we need a page break, add one if so */
const checkPageBreak = (doc, y, needed = 30) => {
  if (y + needed > PAGE_H - MARGIN) {
    newPage(doc);
    return MARGIN + 10;
  }
  return y;
};

/** Draw page footer with page number */
const drawFooter = (doc, pageNum, totalPages) => {
  doc.setFontSize(7);
  doc.setTextColor(...COLOURS.muted);
  doc.text("CyberShield Security Report — Confidential", MARGIN, PAGE_H - 8);
  doc.text(`Page ${pageNum} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 8, { align: "right" });
};

// ─── SECTION RENDERERS ────────────────────────────────────────────────────────

/** PAGE 1: Cover page */
const renderCover = (doc, results) => {
  fillPage(doc);

  // Top accent bar
  doc.setFillColor(...COLOURS.blue);
  doc.rect(0, 0, PAGE_W, 3, "F");

  // CyberShield wordmark
  doc.setFontSize(11);
  doc.setTextColor(...COLOURS.blue);
  doc.setFont("helvetica", "bold");
  doc.text("CYBERSHIELD", MARGIN, 22);

  doc.setFontSize(7);
  doc.setTextColor(...COLOURS.muted);
  doc.setFont("helvetica", "normal");
  doc.text("SME CYBERSECURITY PLATFORM", MARGIN, 28);

  // Date top right
  doc.setFontSize(8);
  doc.setTextColor(...COLOURS.muted);
  doc.text(
    new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }),
    PAGE_W - MARGIN, 22, { align: "right" }
  );

  // Divider
  hr(doc, 34, COLOURS.border);

  // Hero score circle area
  const cx = PAGE_W / 2;
  const scoreCol = scoreColour(results.score);

  // Large score display
  doc.setFontSize(72);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...scoreCol);
  doc.text(String(results.score), cx, 105, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(...COLOURS.mutedLight);
  doc.text("/ 100", cx + 22, 98, { align: "left" });

  // Security level badge
  const level = results.securityLevel || "At Risk";
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...scoreCol);
  doc.text(level.toUpperCase(), cx, 118, { align: "center" });

  // Score bar
  const barX = MARGIN + 20;
  const barW = COL_W - 40;
  const barH = 4;
  const barY = 126;

  roundRect(doc, barX, barY, barW, barH, 2, COLOURS.card);
  const filled = Math.round((results.score / 100) * barW);
  roundRect(doc, barX, barY, filled, barH, 2, scoreCol);

  // Domain
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLOURS.white);
  doc.text(results.domain || "Unknown Domain", cx, 148, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOURS.muted);
  doc.text(results.url || "", cx, 156, { align: "center" });

  // Divider
  hr(doc, 164, COLOURS.border);

  // Summary stats row
  const stats = [
    { label: "SSL Grade",    value: results.ssl_grade || "N/A" },
    { label: "Reputation",   value: results.reputation || "Unknown" },
    { label: "Findings",     value: String(results.findingSummary?.total || 0) },
    { label: "AI Analysis",  value: results.recommendationMethod === "ai" ? "Yes" : "Standard" },
  ];

  const colW = COL_W / 4;
  stats.forEach((s, i) => {
    const x = MARGIN + i * colW + colW / 2;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLOURS.blue);
    doc.text(s.value, x, 178, { align: "center" });
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLOURS.muted);
    doc.text(s.label.toUpperCase(), x, 184, { align: "center" });
  });

  hr(doc, 190, COLOURS.border);

  // Finding severity summary
  const sev = results.findingSummary?.bySeverity || {};
  const sevItems = [
    { label: "Critical", count: sev.critical || 0, colour: COLOURS.critical },
    { label: "High",     count: sev.high     || 0, colour: COLOURS.high     },
    { label: "Medium",   count: sev.medium   || 0, colour: COLOURS.medium   },
    { label: "Low",      count: sev.low      || 0, colour: COLOURS.low      },
  ];

  const sevColW = COL_W / 4;
  sevItems.forEach((s, i) => {
    const x = MARGIN + i * sevColW;
    roundRect(doc, x, 196, sevColW - 4, 22, 4, COLOURS.card);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...s.colour);
    doc.text(String(s.count), x + sevColW / 2 - 2, 207, { align: "center" });
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLOURS.muted);
    doc.text(s.label.toUpperCase(), x + sevColW / 2 - 2, 213, { align: "center" });
  });

  // Disclaimer
  doc.setFontSize(7);
  doc.setTextColor(...COLOURS.muted);
  doc.text(
    "This report was generated automatically by CyberShield. Results reflect external posture only.",
    cx, PAGE_H - 18, { align: "center" }
  );
  doc.text(
    "Internal vulnerabilities, application logic flaws, and authenticated endpoints are not assessed.",
    cx, PAGE_H - 13, { align: "center" }
  );
};

/** PAGE 2: Score breakdown */
const renderScoreBreakdown = (doc, results) => {
  newPage(doc);
  let y = MARGIN + 8;

  // Section header
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLOURS.blue);
  doc.text("SECTION 01", MARGIN, y);
  y += 6;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLOURS.white);
  doc.text("Score Breakdown", MARGIN, y);
  y += 4;

  hr(doc, y + 2, COLOURS.border);
  y += 10;

  // Intro text
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOURS.mutedLight);
  const introText = "Your security score is calculated across 7 weighted categories. Each category reflects a different aspect of your website's security posture. Lower scores in any category indicate areas requiring immediate attention.";
  y = drawWrappedText(doc, introText, MARGIN, y, COL_W, 5) + 8;

  // Category breakdown bars
  const breakdown = results.scoreBreakdown || {};
  const categories = [
    { key: "transportSecurity",    label: "Transport Security",    max: 20, desc: "HTTPS, SSL/TLS grade, redirect policy" },
    { key: "headerSecurity",       label: "Header Security",       max: 15, desc: "7 HTTP security headers checked" },
    { key: "applicationSecurity",  label: "Application Security",  max: 25, desc: "XSS, CORS, cookie flags, injection risks" },
    { key: "technologyRisk",       label: "Technology Risk",       max: 15, desc: "CMS versions, outdated libraries, CVEs" },
    { key: "infrastructureExposure", label: "Infrastructure",      max: 10, desc: "Server banners, version disclosure" },
    { key: "threatReputation",     label: "Threat Reputation",     max: 10, desc: "Google Safe Browsing, URLScan verdict" },
    { key: "configurationHygiene", label: "Configuration Hygiene", max: 5,  desc: "Posture issues, insecure defaults" },
  ];

  categories.forEach((cat) => {
    y = checkPageBreak(doc, y, 22);

    const score = breakdown[cat.key] ?? 0;
    const pct   = cat.max > 0 ? score / cat.max : 0;
    const col   = pct >= 0.8 ? COLOURS.emerald : pct >= 0.5 ? COLOURS.amber : COLOURS.red;

    // Label row
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLOURS.white);
    doc.text(cat.label, MARGIN, y);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...col);
    doc.text(`${score} / ${cat.max}`, PAGE_W - MARGIN, y, { align: "right" });
    y += 4;

    // Description
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLOURS.muted);
    doc.text(cat.desc, MARGIN, y);
    y += 4;

    // Bar background
    roundRect(doc, MARGIN, y, COL_W, 4, 2, COLOURS.card);
    // Bar fill
    if (pct > 0) {
      roundRect(doc, MARGIN, y, Math.round(pct * COL_W), 4, 2, col);
    }
    y += 12;
  });

  y += 4;
  hr(doc, y, COLOURS.border);
  y += 8;

  // Detected tech
  if (results.detectedTech?.length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLOURS.white);
    doc.text("Detected Technologies", MARGIN, y);
    y += 6;

    results.detectedTech.forEach((tech) => {
      y = checkPageBreak(doc, y, 10);
      roundRect(doc, MARGIN, y - 4, COL_W, 8, 2, COLOURS.card);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...COLOURS.mutedLight);
      doc.text(tech.name, MARGIN + 4, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLOURS.muted);
      doc.text(tech.version || "Unknown version", PAGE_W - MARGIN - 4, y, { align: "right" });
      y += 10;
    });
  }
};

/** PAGES 3+: Security findings */
const renderFindings = (doc, results) => {
  const findings = results.findings || [];
  if (findings.length === 0) return;

  // Sort critical → high → medium → low
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...findings].sort((a, b) => (order[a.severity] ?? 4) - (order[b.severity] ?? 4));

  newPage(doc);
  let y = MARGIN + 8;

  // Section header
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLOURS.blue);
  doc.text("SECTION 02", MARGIN, y);
  y += 6;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLOURS.white);
  doc.text("Security Findings", MARGIN, y);
  y += 4;

  hr(doc, y + 2, COLOURS.border);
  y += 10;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOURS.mutedLight);
  doc.text(
    `${sorted.length} confirmed finding${sorted.length !== 1 ? "s" : ""} were detected on ${results.domain}. Each finding below was verified during the scan.`,
    MARGIN, y
  );
  y += 10;

  sorted.forEach((finding, idx) => {
    // Estimate height needed: title row + plain english + fix + tags ≈ 48mm
    y = checkPageBreak(doc, y, 52);

    const col = severityColour(finding.severity);

    // Card background
    roundRect(doc, MARGIN, y - 4, COL_W, 48, 3, COLOURS.card);

    // Left severity stripe
    doc.setFillColor(...col);
    doc.rect(MARGIN, y - 4, 3, 48, "F");

    // Finding number + title
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...col);
    doc.text(`${String(idx + 1).padStart(2, "0")}  ${severityLabel(finding.severity)}`, MARGIN + 8, y + 1);

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLOURS.white);
    const titleLines = doc.splitTextToSize(decodeHtml(finding.title), COL_W - 20);
    doc.text(titleLines, MARGIN + 8, y + 7);
    const titleH = titleLines.length * 5;

    // Plain English explanation
    const explanation = PLAIN_ENGLISH[finding.id] || finding.description || "";
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLOURS.mutedLight);
    doc.text("What this means:", MARGIN + 8, y + titleH + 8);
    doc.setTextColor(...COLOURS.mutedLight);
    const expLines = doc.splitTextToSize(explanation, COL_W - 16);
    doc.text(expLines, MARGIN + 8, y + titleH + 13);
    const expH = expLines.length * 4.5;

    // How to fix
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLOURS.blue);
    doc.text("Fix:", MARGIN + 8, y + titleH + expH + 16);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLOURS.muted);
    const fixLines = doc.splitTextToSize(decodeHtml(finding.recommendation || ""), COL_W - 20)
    doc.text(fixLines, MARGIN + 16, y + titleH + expH + 16);

    // OWASP tag
    if (finding.owasp) {
      doc.setFontSize(6);
      doc.setTextColor(...COLOURS.muted);
      doc.text(finding.owasp, MARGIN + 8, y + 43);
    }
    if (finding.cwe) {
      doc.setFontSize(6);
      doc.setTextColor(...COLOURS.muted);
      doc.text(finding.cwe, PAGE_W - MARGIN - 4, y + 43, { align: "right" });
    }

    y += 54;
  });
};

/** Final pages: AI Recommendations */
const renderRecommendations = (doc, results) => {
  const recs = results.recommendations || [];
  if (recs.length === 0) return;

  newPage(doc);
  let y = MARGIN + 8;

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLOURS.blue);
  doc.text("SECTION 03", MARGIN, y);
  y += 6;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLOURS.white);
  doc.text("AI Recommendations", MARGIN, y);
  y += 4;

  hr(doc, y + 2, COLOURS.border);
  y += 10;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOURS.mutedLight);
  doc.text(
    "The following recommendations were generated by AI based on your specific scan results. Prioritise critical and high items first.",
    MARGIN, y
  );
  y += 10;

  recs.forEach((rec, idx) => {
    // Decode all fields before rendering
    const title       = decodeHtml(rec.title);
    const description = decodeHtml(rec.description);
    const action      = decodeHtml(rec.action);
    const impact      = decodeHtml(rec.impact);
    const category    = decodeHtml(rec.category);
    const priority    = decodeHtml(rec.priority);

    y = checkPageBreak(doc, y, 50);

    const col = severityColour(priority);

    roundRect(doc, MARGIN, y - 4, COL_W, 50, 3, COLOURS.card);
    doc.setFillColor(...col);
    doc.rect(MARGIN, y - 4, 3, 50, "F");

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...col);
    doc.text(
      `${String(idx + 1).padStart(2, "0")}  ${priority.toUpperCase()}  ·  ${category.toUpperCase()}`,
      MARGIN + 8, y + 1
    );

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLOURS.white);
    const titleLines = doc.splitTextToSize(title, COL_W - 16);
    doc.text(titleLines, MARGIN + 8, y + 7);
    const titleH = titleLines.length * 5;

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLOURS.muted);
    const descLines = doc.splitTextToSize(description, COL_W - 16);
    doc.text(descLines, MARGIN + 8, y + titleH + 9);
    const descH = descLines.length * 4.5;

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLOURS.blue);
    doc.text("Action:", MARGIN + 8, y + titleH + descH + 12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLOURS.muted);
    const actionLines = doc.splitTextToSize(action, COL_W - 24);
    doc.text(actionLines, MARGIN + 22, y + titleH + descH + 12);

    doc.setFontSize(6.5);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...COLOURS.muted);
    const impactLines = doc.splitTextToSize(`Impact: ${impact}`, COL_W - 16);
    doc.text(impactLines, MARGIN + 8, y + 44);

    y += 56;
  });
};

/** Back cover */
const renderBackCover = (doc, results) => {
  newPage(doc);
  fillPage(doc);

  doc.setFillColor(...COLOURS.blue);
  doc.rect(0, PAGE_H - 3, PAGE_W, 3, "F");

  const cx = PAGE_W / 2;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLOURS.blue);
  doc.text("CYBERSHIELD", cx, PAGE_H / 2 - 20, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOURS.muted);
  doc.text("This report was generated automatically.", cx, PAGE_H / 2 - 10, { align: "center" });
  doc.text("For questions or a full manual audit, contact your security advisor.", cx, PAGE_H / 2 - 4, { align: "center" });

  hr(doc, PAGE_H / 2 + 4, COLOURS.border);

  doc.setFontSize(7);
  doc.setTextColor(...COLOURS.muted);
  doc.text(`Report generated: ${new Date().toLocaleString()}`, cx, PAGE_H / 2 + 12, { align: "center" });
  doc.text(`Domain assessed: ${results.domain}`, cx, PAGE_H / 2 + 18, { align: "center" });
  doc.text(`Score: ${results.score}/100 — ${results.securityLevel}`, cx, PAGE_H / 2 + 24, { align: "center" });
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

/**
 * generatePDFReport(results)
 * Call this with the scan results object from the API.
 * Triggers a browser download automatically.
 */
export const generatePDFReport = (results) => {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // Page 1 — Cover
  renderCover(doc, results);

  // Page 2 — Score Breakdown
  renderScoreBreakdown(doc, results);

  // Pages 3+ — Findings
  renderFindings(doc, results);

  // Final pages — Recommendations
  renderRecommendations(doc, results);

  // Back cover
  renderBackCover(doc, results);

  // Add page footers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  // Trigger download
  const filename = `cybershield-report-${results.domain}-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
};