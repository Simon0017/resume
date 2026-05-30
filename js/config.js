/**
 * CONFIG.JS — Application constants, breakpoints, career data
 *
 * Central source of truth for all configuration values.
 * Update career data here to refresh the site content.
 */

// ============================================================
// ANIMATION CONFIGURATION
// ============================================================

/** Intersection Observer thresholds and timing */
export const ANIMATION_CONFIG = {
  scrollThreshold: 0.15,
  scrollRootMargin: '0px 0px -60px 0px',
  staggerDelay: 80,      // ms between staggered children
  counterDuration: 1800, // ms to animate count-up numbers
};

/** Three.js settings */
export const THREE_CONFIG = {
  particleCount: {
    desktop: 80,
    mobile: 30,
  },
  particleSize: 0.04,
  rotationSpeed: 0.003,
  cameraFov: 60,
  cameraDistance: 5,
};

// ============================================================
// BREAKPOINTS
// ============================================================

export const BREAKPOINTS = {
  mobile:  480,
  tablet:  768,
  desktop: 1024,
  large:   1440,
};

// ============================================================
// CAREER TIMELINE DATA
// ============================================================

/**
 * Timeline entries ordered chronologically.
 * Types: 'education' | 'work' | 'certification'
 * Color coding matches CSS variables: --color-education / --color-work / --color-certification
 */
export const CAREER_TIMELINE = [
  {
    id: 'edu-2010',
    type: 'education',
    year: '2010 – 2012',
    title: 'Kenya Certificate of Primary Education',
    organisation: 'Gateway Junior Academy',
    description: 'Completed primary education with a strong score of 363 Marks, laying the foundation for academic excellence.',
    detail: 'Demonstrated early academic promise at Gateway Junior Academy, achieving 363 Marks in the KCPE examination. This result secured admission to an extra county secondary school.',
    skills: ['Academic discipline', 'Early numeracy', 'Communication'],
    icon: 'fa-graduation-cap',
    result: '363 Marks',
  },
  {
    id: 'edu-2013',
    type: 'education',
    year: '2013 – 2016',
    title: 'Kenya Certificate of Secondary Education',
    organisation: 'Cardinal Otunga Girls High School',
    description: 'Achieved Mean Grade B in secondary education at a national girls\' school, excelling in commerce and mathematics.',
    detail: 'Four years at Cardinal Otunga Girls High School built a strong analytical and academic foundation. The Mean Grade B in KCSE reflected consistent performance across sciences, languages, and commerce subjects.',
    skills: ['Critical thinking', 'Mathematics', 'Commerce', 'Leadership'],
    icon: 'fa-school',
    result: 'Mean Grade B',
  },
  {
    id: 'edu-2017',
    type: 'education',
    year: '2017 – 2021',
    title: 'Bachelor of Commerce (Accounting Option)',
    organisation: 'Chuka University',
    description: 'Graduated with Second Class Upper Division, specialising in Accounting. Built a deep understanding of financial management, auditing, and business strategy.',
    detail: 'A rigorous four-year programme covering financial accounting, management accounting, auditing, taxation, and business law. The Second Class Upper Division honours reflect sustained academic excellence and a thorough command of accounting principles.',
    skills: ['Financial accounting', 'Auditing', 'Business law', 'Taxation', 'Research'],
    icon: 'fa-university',
    result: '2nd Class Upper Division',
  },
  {
    id: 'work-2019',
    type: 'work',
    year: 'August 2019',
    title: 'Enumerator',
    organisation: 'Kenya National Bureau of Statistics',
    description: 'Selected as a census enumerator for the 2019 Kenya National Census, conducting household data collection across assigned areas.',
    detail: 'Contributed to the landmark 2019 Kenya Population and Housing Census, collecting accurate demographic data from households in the assigned enumeration area. Required exceptional attention to detail, strong interpersonal skills, and the ability to work independently in diverse environments.',
    skills: ['Data collection', 'Interpersonal skills', 'Accuracy', 'Field operations'],
    icon: 'fa-chart-bar',
  },
  {
    id: 'work-2020',
    type: 'work',
    year: 'Jul – Oct 2020',
    title: 'National Hygiene Program (Kazi Mtaani)',
    organisation: 'Government of Kenya',
    description: 'Selected for the Government of Kenya\'s National Hygiene Programme (Kazi Mtaani), contributing to public health and community hygiene efforts.',
    detail: 'As part of Kenya\'s COVID-19 economic stimulus response, participated in the Kazi Mtaani National Hygiene Programme — a government initiative to provide employment for urban youth while maintaining public sanitation standards. Demonstrated responsibility, teamwork, and community service commitment.',
    skills: ['Community service', 'Teamwork', 'Public health', 'Responsibility'],
    icon: 'fa-hands-helping',
  },
  {
    id: 'work-2021',
    type: 'work',
    year: 'May – Jul 2021',
    title: 'Industrial Attachment',
    organisation: 'Central Electrical International Limited, Nairobi',
    description: 'Finance and accounting attachment at a leading electrical solutions company in Nairobi, applying university knowledge to real-world accounting workflows.',
    detail: 'Completed an industrial attachment in the finance department of Central Electrical International Limited. Responsibilities included assisting with accounts payable/receivable, bank reconciliations, and monthly financial reporting. Gained hands-on experience with accounting software and professional office environments.',
    skills: ['Accounts payable/receivable', 'Bank reconciliation', 'Financial reporting', 'QuickBooks'],
    icon: 'fa-bolt',
    reference: 'Mr. Pius Namatsi – Assistant Accountant',
  },
  {
    id: 'work-2022',
    type: 'work',
    year: 'Jan – Aug 2022',
    title: 'Finance & Accounting Internship',
    organisation: 'Sentimental Energy Company Ltd, Nairobi',
    description: 'Accounting internship at an energy company, using wave accounting and QuickBooks desktop.',
    detail: 'Comprehensive internship covering the full accounting cycle at Sentimental Energy Company Ltd. Responsibilities included maintaining financial records using Wave Accounting software, preparing financial statements, supporting annual audit preparations, and assisting with payroll processing. Developed strong professional relationships and a practical understanding of energy-sector finance.',
    skills: ['Wave Accounting', 'Financial statements', 'Payroll', 'Audit support', 'Data analysis'],
    icon: 'fa-sun',
    reference: 'Lydia Ijakaa – Projects Manager',
  },
  {
    id: 'cert-2022',
    type: 'certification',
    year: '2022',
    title: 'CPA Part I – Exemption (Papers 1 & 2)',
    organisation: 'KASNEB / KCA University',
    description: 'Achieved exemption for CPA Part I (Papers 1 & 2) based on academic qualifications, fast-tracking the professional certification path.',
    detail: 'Granted exemption for CPA Part I (Financial Accounting and Business Law) by KASNEB based on the Bachelor of Commerce degree. This recognition acknowledged the undergraduate academic performance and accelerated the professional certification journey.',
    skills: ['Financial accounting', 'Business law'],
    icon: 'fa-award',
    result: 'Exemption Granted',
  },
  {
    id: 'cert-2023a',
    type: 'certification',
    year: '2023',
    title: 'CPA Part II (Papers 3 & 4)',
    organisation: 'KCA University / KASNEB',
    description: 'Successfully completed CPA Part II examinations, covering Management Accounting and Financial Management.',
    detail: 'Passed CPA Part II examinations covering Management Accounting (Paper 3) and Financial Management (Paper 4) through KCA University. This milestone deepened expertise in cost accounting, budgeting, financial analysis, and investment appraisal.',
    skills: ['Management accounting', 'Budgeting', 'Financial management', 'Investment appraisal'],
    icon: 'fa-certificate',
    result: 'Passed',
  },
  {
    id: 'cert-2023b',
    type: 'certification',
    year: '2023',
    title: 'CPA Part III – Section 5 ✦ CPA(K)',
    organisation: 'KCA University / KASNEB',
    description: 'Attained full Certified Public Accountant (CPA) qualification — the highest professional accounting certification in Kenya.',
    detail: 'Completed CPA Section 5 (Advanced Financial Reporting and Governance) to achieve full Certified Public Accountant status. This is the pinnacle of the KASNEB professional accounting qualification, recognised across East Africa. The CPA(K) designation marks the completion of a rigorous, multi-year professional certification journey alongside an active career.',
    skills: ['Advanced financial reporting', 'Corporate governance', 'Ethics', 'IFRS', 'ISA'],
    icon: 'fa-star',
    result: 'CPA(K) Qualified',
    highlight: true,
  },
  {
    id: 'work-2024',
    type: 'work',
    year: 'Nov 2024 – Jan 2025',
    title: 'Accountant / Franchise Operations Support',
    organisation: 'Wardy Communications Ltd – Safaricom Dealership, Nairobi',
    description: 'Managed accounting, cash flow, franchise operations, and stock control across multiple retail outlets.',
    detail: 'Supported financial and operational activities across 3+ Safaricom franchise shops. Responsibilities included bookkeeping using QuickBooks Desktop and Excel, monitoring daily cash flow, supervising staff performance, streamlining operational workflows, conducting profitability analyses, preparing management financial reports, overseeing stock management and replenishment, and ensuring compliance with company policies and internal controls across all locations.',
    skills: [
      'QuickBooks Desktop',
      'Bookkeeping',
      'Cash Flow Management',
      'Financial Reporting',
      'Profitability Analysis',
      'Stock Management',
      'Operations Supervision',
      'Microsoft Excel',
      'Internal Controls',
      'Staff Performance Monitoring'
    ],
    icon: 'fa-chart-line',
    reference: 'Grace Kibanyu - Wardy Communications Ltd Management',
},
{
  id: 'work-2025',
  type: 'work',
  year: 'Feb 2025 – Dec 2025',
  title: 'Customer Care Team Leader & Accounts Assistant (Payables & Receivables)',
  organisation: 'Dantra Limited Wholesalers & Distributors, Nairobi',
  description: 'Led customer care operations while supporting accounts payable, receivable, procurement, inventory, and financial reporting functions.',
  detail: 'Managed customer service operations and supported core finance activities, including accounts payable and receivable, invoice verification, supplier payments, reconciliations, and ledger maintenance. Led order processing, dispatch coordination, and communication between sales, finance, logistics, and procurement teams. Used QuickBooks Intuit to record purchases, supplier deliveries, and inventory updates. Ensured accurate dispatch verification through invoice, purchase order, and delivery note matching. Maintained supplier relationships, resolved customer billing issues through credit notes and invoice corrections, monitored stock variances, prepared management reports, and delegated tasks to improve operational efficiency and customer satisfaction.',
  skills: [
    'QuickBooks Intuit',
    'Accounts Payable',
    'Accounts Receivable',
    'Account Reconciliation',
    'Invoice Verification',
    'Supplier Management',
    'Procurement',
    'Inventory Management',
    'Customer Service Leadership',
    'Financial Reporting',
    'Dispatch Coordination',
    'Ledger Maintenance',
    'Order Processing',
    'Team Leadership',
    'SOP Compliance'
  ],
  icon: 'fa-users',
  reference: 'Evelyn Wangui Mwangi – Dantra Limited Wholesalers & Distributors, Nairobi',
},
];

// ============================================================
// SKILLS DATA
// ============================================================

export const SKILLS = [
  {
    title: 'Computer Literacy & Proficiency',
    description: 'Proficient in Microsoft Office Suite, Wave Accounting, QuickBooks, and financial analysis tools.',
    icon: 'fa-laptop-code',
  },
  {
    title: 'People Skills',
    description: 'Excellent interpersonal abilities, building strong professional relationships at all organisational levels.',
    icon: 'fa-users',
  },
  {
    title: 'Communication',
    description: 'Exemplary written and verbal communication skills, adept at presenting complex financial data clearly.',
    icon: 'fa-comments',
  },
  {
    title: 'Adaptability',
    description: 'Great adaptability across diverse work environments from public service to private energy sector.',
    icon: 'fa-sync-alt',
  },
  {
    title: 'Time Management',
    description: 'Proven ability to prioritise tasks effectively, meet deadlines, and manage multiple responsibilities simultaneously.',
    icon: 'fa-clock',
  },
  {
    title: 'Attention to Detail',
    description: 'Self-motivated with meticulous attention to detail throughout all aspects of work and reporting.',
    icon: 'fa-search',
  },
  {
    title: 'Active Learning',
    description: 'Committed to continuous professional development, demonstrated by the completion of the full CPA qualification.',
    icon: 'fa-book-open',
  },
];

// ============================================================
// LANGUAGES
// ============================================================

export const LANGUAGES = [
  { name: 'English',   proficiency: 5 },
  { name: 'Kiswahili', proficiency: 5 },
];

// ============================================================
// REFERENCES
// ============================================================

export const REFERENCES = [
  {
    name: 'Prof. Zachary N. Waita',
    role: 'Director, Undergraduate Studies',
    organisation: 'Chuka University',
    initials: 'ZW',
  },
  {
    name: 'Mr. Pius Namatsi',
    role: 'Assistant Accountant',
    organisation: 'Central Electrical International Ltd',
    initials: 'PN',
  },
  {
    name: 'Lydia Ijakaa',
    role: 'Projects Manager',
    organisation: 'Sentimental Energy Company Ltd',
    initials: 'LI',
  },
  {
    name: 'Faith Nafula',
    role: 'Chief Executive Officer',
    organisation: 'Solar Spark Energy Ltd',
    initials: 'FN',
  },
  {
    name: 'Evelyn Wangui Mwangi.',
    role: 'Accountant',
    organisation: 'Dantra Limited Wholesalers and Distributors, Nairobi',
    initials: 'EWM',
  },
  {
    name: 'Grace Kibanyu',
    role: 'Franchise Manager',
    organisation: 'Wardy Communications Limited',
    initials: 'GK',
  },
];

// ============================================================
// GALLERY ITEMS
// ============================================================

export const GALLERY_ITEMS = [
  {
    id: 'gallery-cpa',
    type: 'image',
    src:"img/kasneb.png",
    title: 'CPA(K) Certificate',
    subtitle: '2023 — KASNEB',
    icon: 'fa-certificate',
    description: 'Certified Public Accountant (Kenya) — the highest professional accounting qualification in Kenya, awarded by KASNEB.',
  },
  {
    id: 'gallery-kasneb',
    type: 'image',
    src:"img/kasneb_7.jpeg",
    title: 'KASNEB Qualification',
    subtitle: '2022–2023 — KCA University',
    icon: 'fa-award',
    description: 'Full KASNEB professional qualification covering CPA Parts I, II and III.',
  },
  {
    id: 'gallery-bcom',
    type: 'image',
    src:'img/cert.jpg',
    title: 'Bachelor of Commerce',
    subtitle: '2021 — Chuka University',
    icon: 'fa-university',
    description: 'Bachelor of Commerce (Accounting Option) — Second Class Upper Division. Chuka University.',
  },
  {
    id: 'gallery-kcse',
    type: 'image',
    src:"img/kcse.jpeg",
    title: 'KCSE Certificate',
    subtitle: '2016 — Cardinal Otunga Girls HS',
    icon: 'fa-school',
    description: 'Kenya Certificate of Secondary Education, Mean Grade B. Cardinal Otunga Girls High School.',
  },
  {
    id: 'gallery-cpak',
    type: 'image',
    src:"img/cpak.jpeg",
    title: 'CPAK Certificate',
    subtitle: '2026 - CPAK.',
    icon: 'fa-sun',
    description: 'Certificate of admission as a CPAK member',
  },
  // {
  //   id: 'gallery-central',
  //   type: 'icon',
  //   title: 'Attachment Certificate',
  //   subtitle: '2021 — Central Electrical Intl.',
  //   icon: 'fa-bolt',
  //   description: 'Certificate of industrial attachment in finance at Central Electrical International Limited.',
  // },
  // {
  //   id: 'gallery-knbs',
  //   type: 'icon',
  //   title: 'Census Enumerator',
  //   subtitle: '2019 — Kenya National Bureau of Statistics',
  //   icon: 'fa-chart-bar',
  //   description: 'Official certificate of service as an enumerator for the 2019 Kenya National Housing & Population Census.',
  // },
  // {
  //   id: 'gallery-kazi',
  //   type: 'icon',
  //   title: 'Kazi Mtaani Participation',
  //   subtitle: '2020 — Government of Kenya',
  //   icon: 'fa-hands-helping',
  //   description: 'Certificate of participation in the Government of Kenya\'s National Hygiene Programme (Kazi Mtaani), 2020.',
  // },
];
