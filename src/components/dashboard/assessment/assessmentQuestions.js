// Assessment questions data
export const assessmentQuestions = [
  // Domain 1: Access Control & Authentication (5 questions)
  {
    id: "q1",
    domain: "Access Control",
    question:
      "Do all employees use unique user accounts (no shared passwords)?",
    type: "radio",
    options: [
      {
        label: "Yes, everyone has unique credentials",
        value: "yes",
        scoreImpact: 5,
      },
      {
        label: "Mostly, but some accounts are shared",
        value: "partial",
        scoreImpact: 2,
      },
      { label: "No, we share accounts", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q2",
    domain: "Access Control",
    question:
      "Is multi-factor authentication (MFA) enabled on critical systems?",
    type: "radio",
    options: [
      { label: "Yes, on all critical systems", value: "yes", scoreImpact: 5 },
      { label: "Only on some systems", value: "partial", scoreImpact: 2 },
      { label: "No MFA implemented", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q3",
    domain: "Access Control",
    question:
      "Do you enforce strong password policies (minimum 12 characters, complexity)?",
    type: "radio",
    options: [
      { label: "Yes, enforced by policy", value: "yes", scoreImpact: 4 },
      {
        label: "Recommended but not enforced",
        value: "partial",
        scoreImpact: 2,
      },
      { label: "No password requirements", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q4",
    domain: "Access Control",
    question: "How often do you review and revoke access for former employees?",
    type: "radio",
    options: [
      {
        label: "Immediately upon departure",
        value: "immediate",
        scoreImpact: 5,
      },
      { label: "Within a week", value: "week", scoreImpact: 3 },
      { label: "Inconsistently or not at all", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q5",
    domain: "Access Control",
    question: "Do you use a password manager for business accounts?",
    type: "radio",
    options: [
      { label: "Yes, company-wide", value: "yes", scoreImpact: 4 },
      { label: "Some employees use it", value: "partial", scoreImpact: 2 },
      { label: "No password manager", value: "no", scoreImpact: 0 },
    ],
  },

  // Domain 2: Data Backup & Recovery (5 questions)
  {
    id: "q6",
    domain: "Data Backup",
    question: "Do you maintain regular backups of critical business data?",
    type: "radio",
    options: [
      { label: "Yes, automated daily backups", value: "daily", scoreImpact: 5 },
      { label: "Weekly or manual backups", value: "weekly", scoreImpact: 3 },
      { label: "No regular backups", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q7",
    domain: "Data Backup",
    question: "Are backups stored in multiple locations (3-2-1 rule)?",
    type: "radio",
    options: [
      {
        label: "Yes, multiple locations including offline",
        value: "yes",
        scoreImpact: 5,
      },
      {
        label: "Cloud only or single location",
        value: "partial",
        scoreImpact: 2,
      },
      { label: "No backup strategy", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q8",
    domain: "Data Backup",
    question: "Have you tested backup restoration in the past 6 months?",
    type: "radio",
    options: [
      { label: "Yes, regularly tested", value: "yes", scoreImpact: 5 },
      { label: "Tested once or twice", value: "partial", scoreImpact: 2 },
      { label: "Never tested", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q9",
    domain: "Data Backup",
    question: "How quickly can you recover from a complete data loss?",
    type: "radio",
    options: [
      { label: "Within hours", value: "hours", scoreImpact: 5 },
      { label: "Within days", value: "days", scoreImpact: 3 },
      { label: "Uncertain or longer", value: "uncertain", scoreImpact: 0 },
    ],
  },
  {
    id: "q10",
    domain: "Data Backup",
    question: "Are backups encrypted and protected from ransomware?",
    type: "radio",
    options: [
      { label: "Yes, encrypted and isolated", value: "yes", scoreImpact: 4 },
      { label: "Encrypted but not isolated", value: "partial", scoreImpact: 2 },
      { label: "No encryption", value: "no", scoreImpact: 0 },
    ],
  },

  // Domain 3: Software & Patch Management (4 questions)
  {
    id: "q11",
    domain: "Software Updates",
    question: "Do you regularly update operating systems and software?",
    type: "radio",
    options: [
      {
        label: "Automatic updates enabled",
        value: "automatic",
        scoreImpact: 5,
      },
      { label: "Manual updates monthly", value: "manual", scoreImpact: 3 },
      { label: "Rarely or never update", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q12",
    domain: "Software Updates",
    question: "Do you use licensed, legitimate software (no pirated software)?",
    type: "radio",
    options: [
      { label: "Yes, all licensed", value: "yes", scoreImpact: 4 },
      { label: "Mostly licensed", value: "partial", scoreImpact: 2 },
      { label: "Some unlicensed software", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q13",
    domain: "Software Updates",
    question:
      "Do you have antivirus/anti-malware software installed and updated?",
    type: "radio",
    options: [
      {
        label: "Yes, enterprise-grade and updated",
        value: "yes",
        scoreImpact: 5,
      },
      { label: "Basic free antivirus", value: "partial", scoreImpact: 2 },
      { label: "No antivirus", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q14",
    domain: "Software Updates",
    question: "Do you maintain an inventory of all software and devices?",
    type: "radio",
    options: [
      { label: "Yes, documented inventory", value: "yes", scoreImpact: 3 },
      { label: "Partial inventory", value: "partial", scoreImpact: 1 },
      { label: "No inventory", value: "no", scoreImpact: 0 },
    ],
  },

  // Domain 4: Email Security & Phishing (4 questions)
  {
    id: "q15",
    domain: "Email Security",
    question: "Do employees receive regular phishing awareness training?",
    type: "radio",
    options: [
      { label: "Yes, quarterly or more", value: "regular", scoreImpact: 5 },
      { label: "Once per year", value: "annual", scoreImpact: 2 },
      { label: "No training", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q16",
    domain: "Email Security",
    question: "Do you use email filtering or anti-spam solutions?",
    type: "radio",
    options: [
      { label: "Yes, advanced filtering", value: "yes", scoreImpact: 4 },
      { label: "Basic spam filter", value: "partial", scoreImpact: 2 },
      { label: "No email filtering", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q17",
    domain: "Email Security",
    question: "Can employees identify and report phishing emails?",
    type: "radio",
    options: [
      { label: "Yes, with reporting system", value: "yes", scoreImpact: 4 },
      { label: "Some awareness", value: "partial", scoreImpact: 2 },
      { label: "No awareness or system", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q18",
    domain: "Email Security",
    question:
      "Do you verify requests for sensitive information or wire transfers?",
    type: "radio",
    options: [
      { label: "Yes, multi-step verification", value: "yes", scoreImpact: 5 },
      { label: "Sometimes verify", value: "partial", scoreImpact: 2 },
      { label: "No verification process", value: "no", scoreImpact: 0 },
    ],
  },

  // Domain 5: Network Security (4 questions)
  {
    id: "q19",
    domain: "Network Security",
    question:
      "Is your Wi-Fi network secured with strong encryption (WPA3/WPA2)?",
    type: "radio",
    options: [
      { label: "Yes, WPA3 or WPA2-Enterprise", value: "yes", scoreImpact: 4 },
      { label: "WPA2-Personal", value: "partial", scoreImpact: 2 },
      { label: "WEP or open network", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q20",
    domain: "Network Security",
    question: "Do you use a firewall on your network?",
    type: "radio",
    options: [
      { label: "Yes, hardware firewall", value: "yes", scoreImpact: 4 },
      { label: "Software firewall only", value: "partial", scoreImpact: 2 },
      { label: "No firewall", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q21",
    domain: "Network Security",
    question: "Do you use VPN for remote access to company resources?",
    type: "radio",
    options: [
      { label: "Yes, always required", value: "yes", scoreImpact: 4 },
      { label: "Sometimes used", value: "partial", scoreImpact: 2 },
      { label: "No VPN", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q22",
    domain: "Network Security",
    question: "Is guest Wi-Fi separated from your business network?",
    type: "radio",
    options: [
      { label: "Yes, separate guest network", value: "yes", scoreImpact: 3 },
      { label: "No guest network", value: "no_guest", scoreImpact: 2 },
      { label: "Same network for guests", value: "no", scoreImpact: 0 },
    ],
  },

  // Domain 6: Incident Response & Policy (3 questions)
  {
    id: "q23",
    domain: "Incident Response",
    question: "Do you have an incident response plan for cyberattacks?",
    type: "radio",
    options: [
      { label: "Yes, documented and tested", value: "yes", scoreImpact: 5 },
      { label: "Basic plan, not tested", value: "partial", scoreImpact: 2 },
      { label: "No plan", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q24",
    domain: "Incident Response",
    question: "Do you have cybersecurity insurance?",
    type: "radio",
    options: [
      { label: "Yes, with cyber coverage", value: "yes", scoreImpact: 3 },
      { label: "General insurance only", value: "partial", scoreImpact: 1 },
      { label: "No insurance", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q25",
    domain: "Incident Response",
    question: "Do you monitor systems for suspicious activity or breaches?",
    type: "radio",
    options: [
      { label: "Yes, continuous monitoring", value: "yes", scoreImpact: 5 },
      { label: "Periodic reviews", value: "partial", scoreImpact: 2 },
      { label: "No monitoring", value: "no", scoreImpact: 0 },
    ],
  },

  // Domain 7: Physical Security (3 questions)
  {
    id: "q26",
    domain: "Physical Security",
    question:
      "Are server rooms or critical IT equipment kept in locked, restricted areas?",
    type: "radio",
    options: [
      {
        label: "Yes, always locked and restricted",
        value: "yes",
        scoreImpact: 5,
      },
      { label: "Partially restricted", value: "partial", scoreImpact: 2 },
      { label: "No restrictions", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q27",
    domain: "Physical Security",
    question: "Do you use CCTV or access logs for monitoring sensitive areas?",
    type: "radio",
    options: [
      { label: "Yes, with regular review", value: "yes", scoreImpact: 4 },
      {
        label: "CCTV installed but rarely reviewed",
        value: "partial",
        scoreImpact: 2,
      },
      { label: "No monitoring in place", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q28",
    domain: "Physical Security",
    question: "Do employees use ID badges or keycards for office entry?",
    type: "radio",
    options: [
      { label: "Yes, mandatory for all", value: "yes", scoreImpact: 3 },
      { label: "Some employees use them", value: "partial", scoreImpact: 1 },
      { label: "No ID or access control system", value: "no", scoreImpact: 0 },
    ],
  },

  // Domain 8: Device Security & Policies (3 questions)
  {
    id: "q29",
    domain: "Device Security",
    question: "Are company laptops and mobile devices encrypted?",
    type: "radio",
    options: [
      { label: "Yes, all devices encrypted", value: "yes", scoreImpact: 5 },
      { label: "Some devices encrypted", value: "partial", scoreImpact: 2 },
      { label: "No device encryption", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q30",
    domain: "Device Security",
    question:
      "Do you enforce device lock (PIN/password/biometric) on all endpoints?",
    type: "radio",
    options: [
      { label: "Yes, enforced on all", value: "yes", scoreImpact: 4 },
      { label: "Some employees comply", value: "partial", scoreImpact: 2 },
      { label: "No enforcement", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q31",
    domain: "Device Security",
    question: "Are employees allowed to use personal devices (BYOD) for work?",
    type: "radio",
    options: [
      {
        label: "Yes, with MDM or security controls",
        value: "yes",
        scoreImpact: 3,
      },
      { label: "Yes, but no controls", value: "partial", scoreImpact: 1 },
      { label: "No BYOD allowed", value: "no", scoreImpact: 0 },
    ],
  },

  // Domain 9: Data Protection & Privacy (2 questions)
  {
    id: "q32",
    domain: "Data Protection",
    question:
      "Do you classify and label sensitive data (e.g., confidential, public)?",
    type: "radio",
    options: [
      { label: "Yes, with clear policies", value: "yes", scoreImpact: 4 },
      { label: "Some classification", value: "partial", scoreImpact: 2 },
      { label: "No classification", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q33",
    domain: "Data Protection",
    question: "Do you comply with relevant privacy laws (GDPR, CCPA, local)?",
    type: "radio",
    options: [
      { label: "Yes, compliant with audits", value: "yes", scoreImpact: 5 },
      { label: "Somewhat compliant", value: "partial", scoreImpact: 2 },
      { label: "Not compliant / unaware", value: "no", scoreImpact: 0 },
    ],
  },

  // Domain 10: Vendor & Third-Party Risk (2 questions)
  {
    id: "q34",
    domain: "Vendor Risk",
    question:
      "Do you assess vendors/partners for cybersecurity before engagement?",
    type: "radio",
    options: [
      {
        label: "Yes, with due diligence process",
        value: "yes",
        scoreImpact: 5,
      },
      { label: "Some checks performed", value: "partial", scoreImpact: 2 },
      { label: "No vendor assessment", value: "no", scoreImpact: 0 },
    ],
  },
  {
    id: "q35",
    domain: "Vendor Risk",
    question:
      "Do vendor contracts include data protection/security requirements?",
    type: "radio",
    options: [
      { label: "Yes, with clear clauses", value: "yes", scoreImpact: 4 },
      { label: "Sometimes included", value: "partial", scoreImpact: 2 },
      { label: "Not included", value: "no", scoreImpact: 0 },
    ],
  },
];
