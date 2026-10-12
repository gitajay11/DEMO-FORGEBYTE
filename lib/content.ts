// All site copy and project data. Pages and scenes read from here, so editing
// content never means touching layout or animation code.
//
// Integrity rule (see docs/AUDIT.md): nothing here may claim a client, metric,
// testimonial or credential that isn't real. Anything unconfirmed is marked
// `confirm: true` and listed in the audit.

export const studio = {
  name: 'Forgebyte',
  founder: 'Ajay Kumar',
  founderFirst: 'Ajay',
  est: 2026,
  city: 'Chennai',
  country: 'India',
  timeZone: 'Asia/Kolkata',
  tzLabel: 'IST · UTC+5:30',
  coords: '13.08°N 80.27°E',
  availability: 'Q4 2026',
  replyWithin: '1 working day',
  idealClients: 'founders, early-stage startups and small businesses',
  github: 'https://github.com/gitajay11',
  linkedin: 'https://www.linkedin.com/in/ajayak1501',
} as const;

/* ------------------------------------------------------------------ */
/* Services                                                             */
/* ------------------------------------------------------------------ */

export type Service = {
  slug: string;
  index: string;
  name: string;
  short: string; // chip label in the contact form
  promise: string;
  problem: string;
  deliverables: string[];
  duration: string;
  fitIf: string;
  notFitIf: string;
  glyph: 'cube' | 'torus' | 'octa' | 'icosa' | 'ring';
};

export const services: Service[] = [
  {
    slug: 'web-applications',
    index: '01',
    name: 'Web applications',
    short: 'Web app',
    promise: 'The product your users log into every day, built to stay fast and boring to run.',
    problem: 'You have a working idea or an internal process outgrowing spreadsheets, and need software people can rely on.',
    deliverables: ['Written scope and fixed quote', 'Production app on your own hosting', 'Admin tools where you need them', 'Handover notes and access'],
    duration: '6–12 weeks, typical',
    fitIf: 'you know who the users are and what they need to get done.',
    notFitIf: 'you need a large team on a multi-year platform from day one.',
    glyph: 'cube',
  },
  {
    slug: 'apis-and-backends',
    index: '02',
    name: 'APIs & backend systems',
    short: 'API / backend',
    promise: 'Clear contracts, sane errors and data that stays correct.',
    problem: 'Your frontend, your partners or your mobile app need a backend that does not fall over or drift out of sync.',
    deliverables: ['Data model and schema', 'Documented API', 'Payments, email and third-party integrations', 'Monitoring basics'],
    duration: '3–8 weeks, typical',
    fitIf: 'the rules of your business are known, even if they are messy.',
    notFitIf: 'you need a managed team on call 24/7.',
    glyph: 'torus',
  },
  {
    slug: 'mvp-sprints',
    index: '03',
    name: 'MVP sprints',
    short: 'MVP sprint',
    promise: 'A working, testable product in weeks, so you can learn before you spend more.',
    problem: 'You need to put something real in front of users or investors without committing to a full build.',
    deliverables: ['One core flow, end to end', 'Deployed and shareable', 'A list of what we cut and why', 'A plan for what comes next'],
    duration: '4–6 weeks, typical',
    fitIf: 'you are willing to cut scope hard to learn faster.',
    notFitIf: 'every feature on the list is non-negotiable.',
    glyph: 'octa',
  },
  {
    slug: 'ai-features',
    index: '04',
    name: 'AI features in products',
    short: 'AI feature',
    promise: 'Language models where they help, with guardrails where they could embarrass you.',
    problem: 'You want an assistant, search or automation in your product without it inventing facts or leaking cost.',
    deliverables: ['A scoped assistant or workflow', 'Prompt and data guardrails', 'Cost and rate limits', 'Fallbacks when the model is down'],
    duration: '2–6 weeks, typical',
    fitIf: 'you can name the task the model should do, and what it must never do.',
    notFitIf: 'the goal is "add AI" without a job for it.',
    glyph: 'icosa',
  },
  {
    slug: 'ongoing-support',
    index: '05',
    name: 'Ongoing support',
    short: 'Support',
    promise: 'Fixes, small features and upkeep after launch, so the product keeps moving.',
    problem: 'Your product is live and the person who built it is gone, busy, or was us.',
    deliverables: ['Agreed monthly hours', 'Bug fixes and dependency updates', 'Small features', 'A written log of what changed'],
    duration: 'Monthly',
    fitIf: 'you want one accountable person who knows the code.',
    notFitIf: 'you need guaranteed response times overnight.',
    glyph: 'ring',
  },
];

/* ------------------------------------------------------------------ */
/* Work                                                                 */
/* ------------------------------------------------------------------ */

export type WorldKind = 'bubbles' | 'grain' | 'circuit' | 'shade' | 'steam' | 'pulse';

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  year: string;
  role: string;
  duration: string;
  stack: string[];
  status: 'Live' | 'Under testing' | 'In progress';
  url: string;
  image: string;
  imageAlt: string;
  world: WorldKind;
  tint: string; // desaturated, confined to the project's scene
  oneLiner: string;
  problem: string;
  questions: string[];
  approach: { title: string; body: string }[];
  build: string[];
  outcome: string;
  services: string[]; // service slugs, for /work filters
  confirm: true; // year, role and duration still to be confirmed by the owner
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'loopa',
    title: 'Loopa',
    client: 'Loopa (Nutriyah)',
    industry: 'Food & beverage',
    year: '2026',
    role: 'Design & development',
    duration: '—',
    stack: ['HTML', 'CSS', 'JavaScript', 'Formspree'],
    status: 'Live',
    url: 'https://loopa.nutriyah.com/',
    image: '/work/loopa.png',
    imageAlt: 'Loopa homepage: a green sparkling drink bottle beside the headline "Be in the Moment"',
    world: 'bubbles',
    tint: '#9CC7A4',
    oneLiner: 'A sparkling drinks brand site that turns distributor interest into quote requests.',
    problem: 'A new natural sparkling drink needed to look credible to shoppers and to the distributors who decide whether it reaches a shelf at all.',
    questions: [
      'Who places the first real order: a shopper or a distributor?',
      'What does a distributor need to see before they ask for a price?',
      'Which claims about ingredients can be shown, not just stated?',
    ],
    approach: [
      { title: 'Two audiences, one page', body: 'Flavour and mood up front for shoppers; a bulk-order path that is never more than one click away for trade buyers.' },
      { title: 'Transparency as content', body: 'An ingredient section that shows what is in the bottle instead of adjectives about it.' },
      { title: 'No backend to maintain', body: 'A static site with a hosted form service, so enquiries arrive by email with nothing to keep running.' },
    ],
    build: ['Static HTML, CSS and JavaScript', 'Flavour pages and ingredient-transparency section', 'Bulk-order form posting to Formspree as quote requests'],
    outcome: 'Live at loopa.nutriyah.com, taking distributor enquiries as structured quote requests.',
    services: ['web-applications'],
    confirm: true,
  },
  {
    slug: 'nutriyah',
    title: 'Nutriyah',
    client: 'Nutriyah',
    industry: 'Food & beverage',
    year: '2026',
    role: 'Design & development',
    duration: '—',
    stack: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
    status: 'Live',
    url: 'https://www.nutriyah.com/',
    image: '/work/nutriyah.png',
    imageAlt: 'Nutriyah homepage with the headline "Developing the next generation of food products"',
    world: 'grain',
    tint: '#C9B98F',
    oneLiner: 'A company site built to open conversations with distributors and trade partners.',
    problem: 'The parent food and beverage company needed one place that explained what it does and made trade partners want to talk.',
    questions: [
      'What does a trade partner need to trust a young company?',
      'How much should the parent brand say, and how much should its products say?',
      'Where does a conversation start: a form, an email, or a call?',
    ],
    approach: [
      { title: 'Capabilities over claims', body: 'Mission, capabilities and portfolio laid out plainly, so a buyer can judge fit in one read.' },
      { title: 'Room for products', body: 'A portfolio structure that product brands like Loopa can slot into as they launch.' },
      { title: 'Fast by default', body: 'Static pages on Vercel: quick on any connection, nothing to patch.' },
    ],
    build: ['Static site deployed on Vercel', 'Mission, capabilities and product portfolio sections', 'Clear contact routes for trade enquiries'],
    outcome: 'Live at nutriyah.com as the company’s main trade-facing site.',
    services: ['web-applications'],
    confirm: true,
  },
  {
    slug: 'sri-cauvery-electronics',
    title: 'Sri Cauvery Electronics',
    client: 'Sri Cauvery Electronics, Madurai',
    industry: 'Retail & e-commerce',
    year: '2026',
    role: 'Design & development',
    duration: '—',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'PWA'],
    status: 'Under testing',
    url: 'https://www.sricauveryelectronics.shop/',
    image: '/work/sri-cauvery-electronics.png',
    imageAlt: 'Sri Cauvery Electronics homepage with the headline "Everyday electronics. Unforgettable gifts."',
    world: 'circuit',
    tint: '#C7A85A',
    oneLiner: 'A bilingual Tamil/English store with cash-on-delivery checkout and its own admin app.',
    problem: 'A Madurai electronics and return-gifts shop wanted to sell online to customers who read Tamil first and often prefer paying on delivery.',
    questions: [
      'Which language does a customer think in when they shop?',
      'What payment method removes the most hesitation for a first order?',
      'Who updates stock and orders, and on what device?',
    ],
    approach: [
      { title: 'Tamil and English, side by side', body: 'A language switch that changes the whole store, not just the menu.' },
      { title: 'Cash on delivery first', body: 'Checkout built around how this shop’s customers already prefer to pay.' },
      { title: 'An admin the owner will use', body: 'A separate installable app for orders and stock, sharing one PostgreSQL database with the store.' },
    ],
    build: ['Next.js storefront and admin as separate PWAs', 'Prisma over PostgreSQL, one shared database', 'Catalogue, cart and cash-on-delivery checkout', 'Installable on phones'],
    outcome: 'Built and under testing before launch. No live sales figures yet.',
    services: ['web-applications', 'apis-and-backends'],
    confirm: true,
  },
  {
    slug: 'elare-beauty',
    title: 'Élaré Beauty',
    client: 'Élaré Beauty',
    industry: 'Beauty & e-commerce',
    year: '2026',
    role: 'Design & development',
    duration: '—',
    stack: ['React', 'TypeScript', 'Hono', 'PostgreSQL', 'Razorpay', 'PWA'],
    status: 'In progress',
    url: 'https://www.elarebeauty.store/',
    image: '/work/elare-beauty.jpg',
    imageAlt: 'Élaré Beauty homepage: a model beside the headline "Beauty, defined by you."',
    world: 'shade',
    tint: '#C9A3A8',
    oneLiner: 'A premium makeup store with online and cash-on-delivery checkout, and a back-office to run it.',
    problem: 'A makeup brand needed a storefront that feels premium, takes payments safely, and can be run day to day without a developer.',
    questions: [
      'How does someone choose a shade they cannot try on?',
      'Which payment failures can we recover from instead of losing the order?',
      'Which business rules must never be bypassed, even by a bug?',
    ],
    approach: [
      { title: 'Rules in the database', body: 'Business rules live in SQL functions with row-level security, so the API cannot quietly skip them.' },
      { title: 'Payments that can be finished later', body: 'Razorpay orders are verified server-side; an unpaid online order can be paid later from the order page.' },
      { title: 'Two sites, one system', body: 'A customer storefront and an admin back-office sharing typed packages in one monorepo.' },
    ],
    build: ['React storefront and admin (Vite, Tailwind)', 'Hono API on Neon Functions, Postgres with RLS', 'Razorpay checkout with signature verification, plus cash on delivery', 'Order-confirmation email over SMTP', 'Installable PWA'],
    outcome: 'In active development. Not yet launched.',
    services: ['web-applications', 'apis-and-backends'],
    confirm: true,
  },
];

/* ------------------------------------------------------------------ */
/* Lab — demos and concept builds, labelled as such                     */
/* ------------------------------------------------------------------ */

export type LabItem = {
  slug: string;
  title: string;
  kind: string;
  body: string;
  stack: string[];
  url: string;
  image: string;
  imageAlt: string;
  world: WorldKind;
  tint: string;
};

export const lab: LabItem[] = [
  {
    slug: 'ember-and-oak',
    title: 'Ember & Oak',
    kind: 'Concept site · demo',
    body: 'A coffee house site: video hero, scroll-driven menu and a table-reservation flow. Built to show what a hospitality site can feel like.',
    stack: ['React', 'Vite', 'Tailwind', 'Framer Motion'],
    url: 'https://cafecaffeine.vercel.app/',
    image: '/work/ember-and-oak.jpg',
    imageAlt: 'Ember & Oak homepage: espresso pouring behind the headline "Coffee, crafted slowly."',
    world: 'steam',
    tint: '#B08A6A',
  },
  {
    slug: 'care-dental',
    title: 'Care Dental',
    kind: 'Concept site · demo',
    body: 'A dental clinic site with doctors, a patient journey and an appointment form that emails the clinic through a small Express backend.',
    stack: ['React', 'Vite', 'Express', 'Nodemailer'],
    url: 'https://cleardental.vercel.app/',
    image: '/work/care-dental.jpg',
    imageAlt: 'Care Dental homepage: a smiling patient beside the headline "Dental Care"',
    world: 'pulse',
    tint: '#9DB3C2',
  },
  {
    slug: 'site-assistant',
    title: 'This site’s assistant',
    kind: 'Experiment · live here',
    body: 'The chat in the corner: scripted answers, plus an AI mode that refuses to quote prices and forwards contact details only when you give them.',
    stack: ['Next.js route', 'Groq', 'Nodemailer'],
    url: '#chat',
    image: '',
    imageAlt: '',
    world: 'pulse',
    tint: '#7CA9FF',
  },
];

/* ------------------------------------------------------------------ */
/* Process                                                              */
/* ------------------------------------------------------------------ */

export const process = [
  { name: 'Discover', what: 'A short call about the problem, the users and what success looks like. We ask the awkward questions here.', receive: 'A summary of what we heard', time: '1–3 days' },
  { name: 'Define', what: 'We turn the call into a scope: what is in, what is out, and what it costs.', receive: 'A written scope with a fixed quote', time: '2–5 days' },
  { name: 'Design & build', what: 'Iterative work with a check-in every week, so you see progress, not just a deadline.', receive: 'A working preview link, updated weekly', time: 'Per scope' },
  { name: 'Test & ship', what: 'QA, performance checks and a production deploy once it holds up.', receive: 'The live product and its access', time: '~1 week' },
  { name: 'Support', what: 'A window after launch to fix what comes up, then a clean handover.', receive: 'Notes, credentials and a change log', time: 'Agreed per project' },
] as const;

/* ------------------------------------------------------------------ */
/* Engagement                                                           */
/* ------------------------------------------------------------------ */

export const engagements = [
  { name: 'Discovery call', includes: 'A short conversation about the problem, then a written next step.', duration: 'One call', price: 'No obligation' },
  { name: 'Fixed-scope build', includes: 'A written scope, a fixed quote, weekly previews and a production launch.', duration: '3–12 weeks', price: 'Quoted per scope' },
  { name: 'MVP sprint', includes: 'One core flow, end to end, deployed and shareable.', duration: '4–6 weeks', price: 'Quoted per scope' },
  { name: 'Ongoing support', includes: 'Agreed monthly hours for fixes, updates and small features.', duration: 'Monthly', price: 'Monthly rate' },
] as const;

/* ------------------------------------------------------------------ */
/* FAQ                                                                  */
/* ------------------------------------------------------------------ */

export const faq = [
  { q: 'How long does a project take?', a: 'Most builds land between 3 and 12 weeks. You get a firm timeline in the written scope, before any work starts.' },
  { q: 'What does it cost?', a: 'Every build is scoped and quoted individually. You get a fixed quote in writing, so the number does not move unless the scope does.' },
  { q: 'Who owns the code?', a: 'You do. Code, accounts and intellectual property transfer to you on final payment.' },
  { q: 'Will you sign an NDA?', a: 'Yes. Send it over before the discovery call if you need one.' },
  { q: 'How do we communicate?', a: 'A weekly check-in with a preview link, plus email or WhatsApp in between. You always know what is being built and why.' },
  { q: 'You are in India. What about time zones?', a: 'We work on IST (UTC+5:30). That overlaps with UK and European mornings and US evenings, and we plan check-ins around your day.' },
  { q: 'What happens after launch?', a: 'Every project includes a support window. After that, you can move to monthly support or take the handover notes and run it yourselves.' },
  { q: 'Which technology will you use?', a: 'Usually TypeScript, Next.js or React, Node and PostgreSQL, deployed on Vercel. We pick what your team can maintain, not what is fashionable.' },
  { q: 'What do you need from us?', a: 'One person who can make decisions, access to the people who will use the product, and quick answers during the build.' },
] as const;
