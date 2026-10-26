// ============================================================================
// DATA.JS — All content for Muhammad Ahmed Khan's portfolio
// ============================================================================
// This is the SINGLE source of truth for everything on the site.
// Replace any "// REPLACE ME" sections with your real data.
// Add a new journey stop by appending an object to journey[].
// Add a new project by appending to projects[].
// Swap images by dropping files into /public/assets and updating the path here.
// ============================================================================

// ─── PROFILE ───────────────────────────────────────────────────────────────
export const profile = {
  name: 'Muhammad Ahmed Khan',
  title: 'AI Engineer | Machine Learning | Generative AI | NLP',
  roles: ['AI Engineer', 'ML Engineer', 'GenAI Developer', 'NLP Specialist'],
  tagline: 'Every system I build starts with a question. Scroll down to follow the path that shaped how I ask them.',
  openToWork: true,
  openToWorkText: 'Open to Werkstudent roles',
  location: 'Ilmenau, Germany',
  timezone: 'Europe/Berlin',
  // REPLACE ME — add your photo to /public/assets/profile.jpg
  photo: '/assets/profile.jpg',
  // REPLACE ME — add your CV to /public/assets/cv.pdf
  cv: '/Muhammad_Ahmed_Khan_CV_updated.pdf',
  bio: `Software developer with experience building AI-driven applications, chatbots and full-stack systems. Strong in Python, SQL and React Native, with a focus on scalable architecture and performance optimization. Delivers production-ready solutions and collaborates well across teams.`,
};

// ─── LINKS ─────────────────────────────────────────────────────────────────
export const links = {
  email: 'ahmedkhanbeconite@gmail.com',
  linkedin: 'https://www.linkedin.com/in/muhammad-ahmed-khan-b19753271',
  github: 'https://github.com/ahmedkhan2017',
};

// ─── SKILLS ────────────────────────────────────────────────────────────────
export const skillGroups = [
  {
    category: 'AI / ML',
    icon: 'Brain',
    skills: [
      { name: 'NLP', level: 90 },
      { name: 'Transformers / MT5', level: 85 },
      { name: 'Cosine Similarity', level: 80 },
      { name: 'KNN', level: 75 },
      { name: 'Chatbot Architecture', level: 88 },
    ],
  },
  {
    category: 'Programming',
    icon: 'Code2',
    skills: [
      { name: 'Python', level: 90 },
      { name: 'JavaScript', level: 82 },
      { name: 'React Native', level: 80 },
      { name: 'FastAPI', level: 78 },
      { name: 'HTML / CSS', level: 85 },
    ],
  },
  {
    category: 'Data',
    icon: 'Database',
    skills: [
      { name: 'SQL', level: 88 },
      { name: 'Query Optimization', level: 82 },
      { name: 'Data Validation', level: 80 },
      { name: 'REST APIs', level: 85 },
    ],
  },
  {
    category: 'Enterprise',
    icon: 'Building2',
    skills: [
      { name: 'SAP ABAP', level: 72 },
      { name: 'ERP Systems', level: 75 },
      { name: 'SAP Adobe Forms', level: 70 },
    ],
  },
  {
    category: 'Tools & Testing',
    icon: 'Wrench',
    skills: [
      { name: 'Git', level: 85 },
      { name: 'Selenium', level: 80 },
      { name: 'Automation Testing', level: 78 },
    ],
  },
];

// ─── MARQUEE SKILLS (for the infinite scroll strip) ─────────────────────────
export const marqueeSkills = [
  'Python', 'JavaScript', 'FastAPI', 'React Native', 'NLP', 'Transformers',
  'MT5', 'SQL', 'SAP ABAP', 'Selenium', 'Git', 'REST APIs', 'HTML', 'CSS',
  'Cosine Similarity', 'KNN', 'ERP', 'Automation Testing',
];

// ─── CERTIFICATIONS ────────────────────────────────────────────────────────
export const certifications = [
  {
    title: 'SQL Bootcamp: Zero to Advanced',
    issuer: 'Udemy',
    year: '2025',
  },
  {
    title: 'Software Quality & Automation',
    issuer: 'Sir Syed University of Engineering & Technology',
    year: '2024',
  },
];

// ─── LANGUAGES ──────────────────────────────────────────────────────────────
export const languages = [
  { name: 'English', level: 'C1', proficiency: 90 },
  { name: 'German', level: 'A1', proficiency: 25, growing: true },
];

// ─── JOURNEY (chronological stops on the glowing path) ─────────────────────
// Add a new stop by appending an object here. The path, orb, navbar dots
// and animations all adapt automatically.
// type: 'education' | 'internship' | 'project' | 'work' | 'milestone'
// visual: which animated card component to render
//   'cgpa' | 'abap' | 'urdu' | 'phone' | 'chat' | 'dashboard' | 'campus'
export const journey = [
  // ── STOP 1 ──────────────────────────────────────────────────────────────
  {
    id: 'stop-1',
    date: '2020 – 2024',
    title: 'Laying the Foundation',
    hook: 'Four years of learning how to think like an engineer before I touched a real production system.',
    type: 'education',
    visual: 'cgpa',
    details: {
      degree: 'BS Software Engineering',
      institution: 'Sir Syed University of Science & Technology, Karachi',
      cgpa: '3.49',
      cgpaMax: '4.00',
      certification: 'Software Quality & Automation',
      bullets: [
        'Built a strong foundation in software engineering principles, algorithms and system design.',
        'Completed coursework in databases, data structures, software testing and AI fundamentals.',
        'Earned a certification in Software Quality & Automation alongside the degree.',
      ],
    },
  },

  // ── STOP 2 ──────────────────────────────────────────────────────────────
  {
    id: 'stop-2',
    date: 'Aug – Nov 2023',
    title: 'First Contact with Enterprise Code',
    hook: 'My first internship. SAP. ABAP. A whole new world of enterprise-scale software.',
    type: 'internship',
    visual: 'abap',
    details: {
      role: 'SAP ABAP Developer — Intern',
      company: 'Systems Limited, Karachi',
      bullets: [
        'Created and managed database tables, and merged multiple tables for better data integration and retrieval.',
        'Designed Adobe Forms to improve how documents are presented in SAP.',
        'Implemented F4 Help and custom selection screens for better user experience and tailored reporting.',
        'Developed custom Z_Reports for business use cases.',
      ],
      codeSnippets: [
        { lang: 'ABAP', code: 'REPORT z_customer_report.\n\nSELECT * FROM kna1\n  INTO TABLE @lt_customers\n  WHERE land1 = \'DE\'.\n\nLOOP AT lt_customers INTO ls_customer.\n  WRITE: / ls_customer-kunnr, ls_customer-name1.\nENDLOOP.' },
        { lang: 'ABAP', code: 'FORM create_alv_grid.\n  DATA: lo_alv TYPE REF TO cl_salv_table.\n\n  cl_salv_table=>factory(\n    IMPORTING r_salv_table = lo_alv\n    CHANGING  t_table      = lt_output ).\n\n  lo_alv->display( ).\nENDFORM.' },
      ],
    },
  },

  // ── STOP 3 ──────────────────────────────────────────────────────────────
  {
    id: 'stop-3',
    date: '2023 – 2024',
    title: 'The AI Awakening',
    hook: 'I taught a machine to speak Urdu. That changed everything I wanted to do next.',
    type: 'project',
    visual: 'urdu',
    details: {
      projectTitle: 'Urdu Paraphrasing Tool',
      description: 'An AI paraphrasing system for the low-resource language Urdu, featuring a React Native Android app, transformer-based NLP model training, and improved text variation generation.',
      // REPLACE ME — add your supervisor's name
      supervisor: 'Dr. [Supervisor Name]',
      // REPLACE ME — add your team members
      team: ['[Team Member 1]', '[Team Member 2]'],
      // REPLACE ME — add a link to your demo video
      demoVideo: '#',
      // REPLACE ME — add a link to your paper if published online
      paper: {
        title: 'Training a Large Corpus Urdu Dataset for Paraphrasing on MT5',
        link: '#',
      },
      bullets: [
        'Trained a transformer-based MT5 model on a large Urdu corpus for paraphrase generation.',
        'Built a React Native Android app as the user-facing interface.',
        'Improved text variation generation for a low-resource language with limited NLP tooling.',
        'Published research on the training methodology and dataset.',
      ],
    },
  },

  // ── STOP 4 ──────────────────────────────────────────────────────────────
  {
    id: 'stop-4',
    date: 'Jun 2024 – Feb 2025',
    title: 'My First Real Team',
    hook: 'From solo projects to pull requests, code reviews and shipping to real users.',
    type: 'work',
    visual: 'phone',
    details: {
      role: 'Junior Software Engineer',
      company: 'Pinnacle Digitals, Karachi',
      bullets: [
        'Worked with senior developers on ongoing projects: solving bugs and maintaining websites.',
        'Built responsive front-end components with HTML, CSS and JavaScript.',
        'Worked independently on front-end and back-end tasks including API integration and database management.',
        'Built and deployed an Android app with React Native.',
        'Participated in code reviews, improved performance and cross-browser compatibility.',
        'Automated website testing with Selenium, reducing manual testing effort.',
      ],
    },
  },

  // ── STOP 5 ──────────────────────────────────────────────────────────────
  {
    id: 'stop-5',
    date: 'Feb – Apr 2025',
    title: 'Building Talking Machines',
    hook: 'I designed chatbots that could learn from PDFs, videos and voice — and actually answer.',
    type: 'work',
    visual: 'chat',
    details: {
      role: 'Software Engineering Trainee — AI Engineer',
      company: 'Dimensional Sys, Karachi',
      bullets: [
        'Developed AI-powered training chatbots for different content formats: PDF documents, videos and voice-based training material.',
        'Designed end-to-end chatbot architecture (frontend + backend) and processing workflows connecting training content to conversational interfaces.',
        'Implemented NLP-based similarity algorithms to improve response relevance and accuracy.',
        'Integrated APIs, AI services and application components; deployed and hosted the chatbots for testing.',
        'Delivered multiple AI prototypes and proofs of concept, turning static and multimedia material into interactive AI-assisted learning.',
      ],
      chatMessages: [
        { sender: 'user', text: 'Can you summarize the key points from the uploaded training PDF?' },
        { sender: 'bot', text: 'Sure! The document covers three main topics: safety protocols, equipment handling, and emergency procedures. Here\'s a summary of each...' },
        { sender: 'user', text: 'What does section 3 say about emergency procedures?' },
        { sender: 'bot', text: 'Section 3 outlines 4 steps: 1) Alert the supervisor, 2) Evacuate the area, 3) Follow the assembly point map, 4) Report via the incident form.' },
      ],
    },
  },

  // ── STOP 6 ──────────────────────────────────────────────────────────────
  {
    id: 'stop-6',
    date: 'Jul 2025 – Mar 2026',
    title: 'Systems That Keep a Hospital Running',
    hook: 'When your code runs a hospital, every query matters. I made them 25% faster.',
    type: 'work',
    visual: 'dashboard',
    details: {
      role: 'Junior Software Engineer',
      company: 'The Kidney Centre (Post Graduate Training Institute), Karachi',
      bullets: [
        'Contributed to in-house software systems and ERP / hospital management systems, working with internal teams and external software partners.',
        'Optimized and validated SQL queries on large datasets (~25% faster data retrieval) and kept data consistent across system modules.',
        'Supported ERP implementation, testing and troubleshooting across departments (pharmacy inventory, laboratory, emergency/clinical workflows, operational reporting).',
        'Handled data migration and validation for thousands of records with high accuracy.',
        'Gathered business requirements from departments and translated them into software workflows. Wrote SOPs and user guides that reduced onboarding and training time.',
      ],
      stats: [
        { label: 'Faster Data Retrieval', value: 25, suffix: '%' },
        { label: 'Records Migrated', value: 5000, suffix: '+' },
        { label: 'Departments Supported', value: 4, suffix: '' },
        { label: 'SOPs Written', value: 12, suffix: '+' },
      ],
    },
  },

  // ── STOP 7 ──────────────────────────────────────────────────────────────
  {
    id: 'stop-7',
    date: '2026 – Now',
    title: 'The Next Chapter',
    hook: 'New country, new language, new degree. Looking for a team to build AI with in Germany.',
    type: 'education',
    visual: 'campus',
    isLast: true,
    endingText: "Next stop: your team?",
    details: {
      degree: 'M.Sc. Research in Computer and Systems Engineering',
      institution: 'Technische Universität Ilmenau',
      semester: '1st Semester (2026 – Present)',
      location: 'Ilmenau, Germany',
      bullets: [
        'Pursuing M.Sc. Research in Computer and Systems Engineering at TU Ilmenau.',
        'Learning German (A1 and growing) alongside academic coursework.',
        'Actively seeking Werkstudent / Student Assistant opportunities in AI & Software Development.',
      ],
    },
  },
];

// ─── PIPELINE (How I Build AI — scroll-pinned interlude) ────────────────────
export const pipeline = [
  {
    stage: 'Data',
    icon: 'Database',
    description: 'Collecting, cleaning and structuring data — the fuel for every AI system.',
    tech: ['Python', 'SQL', 'Pandas', 'Data Validation'],
    projectLink: { label: 'Hospital data migration', stopId: 'stop-6' },
  },
  {
    stage: 'ML / DL',
    icon: 'Brain',
    description: 'Training models that learn patterns — from classical algorithms to deep neural networks.',
    tech: ['KNN', 'Cosine Similarity', 'Transformers', 'MT5'],
    projectLink: { label: 'Plagiarism Checker', stopId: 'projects' },
  },
  {
    stage: 'LLMs',
    icon: 'Sparkles',
    description: 'Fine-tuning and prompting large language models for domain-specific tasks.',
    tech: ['MT5', 'Transformers', 'NLP', 'Paraphrasing'],
    projectLink: { label: 'Urdu Paraphrasing Tool', stopId: 'stop-3' },
  },
  {
    stage: 'APIs',
    icon: 'Plug',
    description: 'Wrapping models in fast, reliable APIs that other software can call.',
    tech: ['FastAPI', 'REST', 'Integration', 'Deployment'],
    projectLink: { label: 'AI Chatbots', stopId: 'stop-5' },
  },
  {
    stage: 'Real-World Apps',
    icon: 'Rocket',
    description: 'Shipping products that people actually use — apps, dashboards, hospital systems.',
    tech: ['React Native', 'ERP', 'Selenium', 'Production'],
    projectLink: { label: 'Hospital ERP', stopId: 'stop-6' },
  },
];

// ─── PROJECTS ───────────────────────────────────────────────────────────────
// tags: used by the filter tabs. Options: 'ML' | 'GenAI' | 'NLP' | 'Software'
export const projects = [
  {
    id: 'p1',
    title: 'Exam Plagiarism Checker',
    category: 'ML',
    tags: ['ML', 'NLP'],
    description: 'An AI system that detects plagiarism in exam submissions using the cosine similarity algorithm and text comparison logic for automated detection of academic dishonesty.',
    // REPLACE ME — add your GitHub repo URL
    github: '#',
    // REPLACE ME — add a live demo URL
    demo: '#',
    stars: null, // fetched from GitHub API if github URL is a real repo
    language: 'Python',
    gradient: 'from-blue-500 to-cyan-400',
    icon: 'Search',
  },
  {
    id: 'p2',
    title: 'Urdu Paraphrasing Tool',
    category: 'NLP',
    tags: ['NLP', 'GenAI', 'ML'],
    description: 'An AI paraphrasing system for the low-resource language Urdu. Transformer-based MT5 model trained on a large Urdu corpus, with a React Native Android app frontend.',
    // REPLACE ME — links back to Stop 3
    github: '#',
    demo: '#',
    stars: null,
    language: 'Python',
    gradient: 'from-purple-500 to-blue-400',
    icon: 'Languages',
    linksToStop: 'stop-3',
  },
  {
    id: 'p3',
    title: 'AI Training Chatbot System',
    category: 'GenAI',
    tags: ['GenAI', 'NLP', 'Software'],
    description: 'AI-powered training chatbots for PDF, video and voice-based content. End-to-end architecture with NLP similarity algorithms for response relevance.',
    // REPLACE ME
    github: '#',
    demo: '#',
    stars: null,
    language: 'JavaScript',
    gradient: 'from-cyan-400 to-blue-500',
    icon: 'Bot',
    linksToStop: 'stop-5',
  },
  {
    id: 'p4',
    title: 'Hospital ERP Module',
    category: 'Software',
    tags: ['Software'],
    description: 'Contributed to in-house hospital management and ERP systems. Optimized SQL queries by 25%, supported pharmacy, lab and clinical workflows.',
    // REPLACE ME
    github: '#',
    demo: '#',
    stars: null,
    language: 'SQL',
    gradient: 'from-emerald-400 to-cyan-400',
    icon: 'HeartPulse',
    linksToStop: 'stop-6',
  },
  {
    id: 'p5',
    title: 'SAP Z_Report Suite',
    category: 'Software',
    tags: ['Software'],
    description: 'Custom ABAP reports and Adobe Forms for enterprise SAP systems. F4 Help and tailored selection screens for business reporting.',
    // REPLACE ME
    github: '#',
    demo: '#',
    stars: null,
    language: 'ABAP',
    gradient: 'from-amber-400 to-blue-400',
    icon: 'FileCode',
    linksToStop: 'stop-2',
  },
  {
    id: 'p6',
    title: 'React Native Android App',
    category: 'Software',
    tags: ['Software'],
    description: 'Built and deployed a cross-platform Android app with React Native. Responsive UI, API integration and back-end data management.',
    // REPLACE ME
    github: '#',
    demo: '#',
    stars: null,
    language: 'JavaScript',
    gradient: 'from-pink-400 to-purple-400',
    icon: 'Smartphone',
    linksToStop: 'stop-4',
  },
];

export const projectFilters = ['All', 'ML', 'GenAI', 'NLP', 'Software'];

// ─── CONTACT FORM SUBJECT OPTIONS ───────────────────────────────────────────
export const contactSubjects = [
  'Werkstudent / Job opportunity',
  'Project collaboration',
  'Just saying hi',
];
