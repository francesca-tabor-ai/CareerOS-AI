/**
 * Platform knowledge base for the conversational AI assistant.
 * Answers questions about CareerOS AI based on the marketing site content.
 */

const knowledge = {
  platform: {
    name: 'CareerOS AI',
    description: 'The only career management platform you need. One platform for advising, employer relations, alumni, and outcomes — so career centers do more with the team they have.',
    target: 'University career centers and their students',
    stats: { universities: '70+', dreamRole: '122%', interactions: '5.4×', recommend: '91%' },
  },
  solutions: [
    { id: 1, title: 'Unified ecosystem', desc: 'Students, advisors, and employers work in one place. No more switching tools, re-keying data, or losing context.' },
    { id: 2, title: 'AI that guides in real time', desc: 'Personalized outreach, interview prep, company insights — generated as students network. Like training wheels they can use from day one.' },
    { id: 3, title: 'Visibility that drives action', desc: "See who's active, stuck, or needs support. Prioritize outreach, run targeted campaigns, prove you're reaching underserved populations." },
    { id: 4, title: 'Impact that proves ROI', desc: 'One dashboard: placements, engagement, funding credibility. Export board packs and accreditation reports in seconds.' },
  ],
  painPoints: [
    { title: 'Fragmented tools, manual chaos', desc: 'Job boards, CRM, event platforms, and outcome tracking live in separate systems.' },
    { title: 'Students slip through the cracks', desc: "Hard to see who's active, who's stuck, and who needs support until it's too late." },
    { title: "Impact you can't prove", desc: 'Board packs and outcome reports take weeks — with inconsistent definitions.' },
    { title: 'Students overwhelmed, not empowered', desc: 'No way to track applications, follow-ups, and networking.' },
  ],
  plans: [
    { name: 'Individual', price: '$19/month', for: 'Students & solo career seekers' },
    { name: 'Team', price: 'Custom', for: 'Career centers & advising teams', popular: true },
    { name: 'Enterprise', price: 'Custom', for: 'Universities & multi-campus systems' },
  ],
  trial: '2-week free trial',
  caseStudies: ['ESMT Berlin', 'Maryland (UMD)', 'ESADE Business School', 'EADA Business School'],
}

function matchQuery(query, patterns) {
  const q = query.toLowerCase().trim()
  for (const { keywords, weight } of patterns) {
    const matches = keywords.filter((k) => q.includes(k))
    if (matches.length > 0) return weight
  }
  return 0
}

export function getAIResponse(userMessage) {
  const msg = userMessage.toLowerCase().trim()

  if (!msg) {
    return "Hi! I'm your CareerOS AI guide. Ask me anything about the platform — pricing, features, how it works, or how to get started."
  }

  // Greetings
  if (/^(hi|hello|hey|howdy)/.test(msg) || msg === 'hi' || msg === 'hello') {
    return `Hi! 👋 I'm here to help you learn about CareerOS AI. You can ask me about:
• What CareerOS does and who it's for
• Pricing and plans
• Key features and how we solve common career center challenges
• Case studies and success stories
• How to get started

What would you like to know?`
  }

  // Pricing
  if (matchQuery(msg, [
    { keywords: ['price', 'pricing', 'cost', 'costs', 'how much', 'plans', 'plan'], weight: 1 },
    { keywords: ['individual', 'team', 'enterprise', 'tier'], weight: 2 },
    { keywords: ['free', 'trial'], weight: 2 },
  ]) > 0) {
    const planSummary = knowledge.plans
      .map((p) => `• **${p.name}** (${p.for}): ${p.price}${p.popular ? ' ⭐ Most popular' : ''}`)
      .join('\n')
    return `CareerOS offers three plans:

${planSummary}

**Individual** ($19/month) is perfect for students and solo job seekers — includes AI-powered career tracking, outreach tools, resume optimizer, and interview prep.

**Team** is our most popular plan for career centers — unified platform for advisors, students, and employer relations, with SSO/SIS integration.

**Enterprise** adds outcomes reporting, accreditation exports, alumni integration, and dedicated support for multi-campus systems.

You can start with a **2-week free trial** — no credit card required. Head to the [Pricing](/pricing) page to explore or get started.`
  }

  // Who is it for / target audience
  if (matchQuery(msg, [
    { keywords: ['who', 'for', 'target', 'audience', 'who is it'], weight: 1 },
    { keywords: ['university', 'universities', 'career center', 'career centers', 'students'], weight: 2 },
  ]) > 0) {
    return `CareerOS AI is built **for university career centers and their students**.

We help career centers do more with the team they have — one platform for advising, employer relations, alumni, and outcomes. Students get AI-powered tools to track applications, network effectively, and land roles at their dream companies. Advisors get visibility into who's active, who's stuck, and who needs support.

We're trusted by **70+ leading universities** globally, including ESMT Berlin, Maryland (UMD), ESADE, EADA, INSEAD, and LBS.`
  }

  // Features
  if (matchQuery(msg, [
    { keywords: ['feature', 'features', 'what can', 'capabilities', 'does it do'], weight: 1 },
    { keywords: ['ai', 'unified', 'dashboard', 'tracking', 'outcomes', 'reporting'], weight: 2 },
  ]) > 0) {
    const solutionList = knowledge.solutions
      .map((s) => `**${s.id}. ${s.title}** — ${s.desc}`)
      .join('\n\n')
    return `Here's how CareerOS solves it:

${solutionList}

We also offer: career tracking (applications, interviews, follow-ups), AI outreach messages, resume optimization, interview prep, employer & alumni collaboration, event management, and analytics & engagement reports.`
  }

  // Pain points / problems
  if (matchQuery(msg, [
    { keywords: ['problem', 'problems', 'challenge', 'challenges', 'pain', 'struggle'], weight: 1 },
    { keywords: ['fragmented', 'chaos', 'cracks', 'overwhelmed'], weight: 2 },
  ]) > 0) {
    return `Career centers often face these challenges:

1. **Fragmented tools, manual chaos** — Job boards, CRM, event platforms live in separate systems. Reporting takes weeks.
2. **Students slip through the cracks** — Hard to see who's active, stuck, or needs support until it's too late.
3. **Impact you can't prove** — Board packs and outcome reports take weeks with inconsistent definitions.
4. **Students overwhelmed** — No way to track applications, follow-ups, and networking.

CareerOS unifies everything in one platform with AI that guides students in real time and dashboards that prove your impact.`
  }

  // Case studies / success
  if (matchQuery(msg, [
    { keywords: ['case stud', 'testimonial', 'success', 'results', 'trusted by'], weight: 1 },
    { keywords: ['esmt', 'maryland', 'esade', 'eada', 'universities'], weight: 2 },
  ]) > 0) {
    return `CareerOS is trusted by **70+ universities** worldwide. Here are some highlights:

• **ESMT Berlin** — "We now have real-time data and strategic insights to better connect with students."
• **Maryland (UMD)** — "CareerOS gives them a tool that walks them through the process as they're doing it — like training wheels they can start riding on day one."
• **ESADE** — "CareerOS has truly transformed my career journey."
• **EADA** — "CareerOS helped me track people I talked with to request recommendations in their company."

Stats: **122%** land a role at their dream company, **5.4×** more student interactions, **91%** would recommend. Check out our [Case Studies](/case-studies) page for more.`
  }

  // Contact / support
  if (matchQuery(msg, [
    { keywords: ['contact', 'support', 'reach', 'email', 'bug', 'report a bug', 'customer support'], weight: 1 },
    { keywords: ['help', 'problem', 'issue', 'complain'], weight: 2 },
  ]) > 0) {
    return `You can reach us through our [Contact](/contact) page. Choose from:

• **Customer support request** — Questions, troubleshooting, or general help
• **Bug report** — Report something that isn't working as expected
• **General inquiry** — Sales, partnerships, or other questions

Your message will open in your email client, pre-filled and ready to send to **info@francescatabor.com**.`
  }

  // Get started / how to start
  if (matchQuery(msg, [
    { keywords: ['get started', 'getting started', 'how to start', 'sign up', 'signup', 'trial', 'demo'], weight: 1 },
    { keywords: ['start', 'begin', 'join', 'try'], weight: 2 },
  ]) > 0) {
    return `Great question! Here's how to get started:

1. **Start a 2-week free trial** — No credit card required. Head to [Pricing](/pricing) and choose Individual or request a Team/Enterprise demo.
2. **Book a demo** — For career centers, we recommend booking a call to see the full platform in action.
3. **Explore the site** — Check out our [Case Studies](/case-studies) to see how universities like ESMT Berlin and Maryland use CareerOS.

You can also use the **Get started** button in the header for a quick path to the trial.`
  }

  // Default
  return `I'd be happy to help! CareerOS AI is the only career management platform you need — built for university career centers and their students.

Try asking me about:
• **Pricing** — Individual ($19/mo), Team, or Enterprise plans
• **Features** — AI tools, unified ecosystem, outcomes reporting
• **Who it's for** — Career centers, students, universities
• **Case studies** — Success stories from ESMT, Maryland, ESADE
• **Contact** — Customer support, bug reports, or general inquiries
• **Getting started** — Free trial, demo, or signup

What would you like to explore?`
}
