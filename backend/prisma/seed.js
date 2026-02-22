import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user (password: Admin123!)
  const adminHash = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@careeros.ai' },
    update: {},
    create: {
      email: 'admin@careeros.ai',
      passwordHash: adminHash,
      name: 'Admin',
      role: 'ADMIN',
    },
  })
  console.log('Created admin:', admin.email)

  // Seed plans
  const plans = [
    {
      name: 'Individual',
      tagline: 'For students & solo career seekers',
      price: '$19',
      period: '/month',
      description: 'Take control of your job search with AI-powered tools. Perfect for MBA candidates and early-career professionals.',
      features: [
        'Career tracker — applications, interviews, follow-ups',
        'AI outreach messages & coffee chat suggestions',
        'Resume keyword optimizer & tailoring',
        'Chrome extension for job aggregation',
        'Interview prep with recommended questions',
        'Company & role insights',
      ],
      cta: 'Start free trial',
      href: '#',
      popular: false,
      order: 1,
    },
    {
      name: 'Team',
      tagline: 'For career centers & advising teams',
      price: 'Custom',
      period: '',
      description: 'Unified platform for advisors, students, and employer relations. Scale support without scaling headcount.',
      features: [
        'Everything in Individual for all students',
        "Advisor dashboard — see who's active, stuck, needs support",
        'Co-create & review resumes with university templates',
        'Event management — workshops, fairs, sessions',
        'Employer & alumni collaboration',
        'Basic analytics & engagement reports',
        'SSO/SIS integration',
      ],
      cta: 'Book a demo',
      href: '#',
      popular: true,
      order: 2,
    },
    {
      name: 'Enterprise',
      tagline: 'For universities & multi-campus systems',
      price: 'Custom',
      period: '',
      description: 'Full ecosystem with outcomes reporting, alumni integration, and institutional compliance.',
      features: [
        'Everything in Team',
        'Outcomes dashboard — placements, engagement, equity',
        'Accreditation & board pack exports (PDF/CSV)',
        'Alumni touchpoints → placements, NPS, donation likelihood',
        'Custom API & CRM integration',
        'GDPR & FERPA compliant, EU-hosted',
        'Dedicated success manager',
        'Custom training & onboarding',
      ],
      cta: 'Contact sales',
      href: '/contact',
      popular: false,
      order: 3,
    },
  ]

  await prisma.plan.deleteMany({})
  await prisma.plan.createMany({ data: plans })
  console.log('Seeded plans:', plans.length)

  // Seed case studies
  const caseStudies = [
    { company: 'ESMT Berlin', quote: "With CareerOS, we now have real-time data and strategic insights to better connect with students.", author: 'Sophie Schaefer', role: 'Director of Career Services', order: 1 },
    { company: 'Maryland (UMD)', quote: "Instead of workshops that teach students how to network, CareerOS gives them a tool that walks them through the process as they're doing it. It's as if we gave them a bicycle with training wheels they can start riding on day one.", author: 'Jeff Stoltzfus', role: 'Director of Career Services', order: 2 },
    { company: 'ESADE Business School', quote: "CareerOS has truly transformed my career journey. As a job seeker, I have often found myself overwhelmed by the vast number of opportunities available. However, with CareerOS, everything changed for the better.", author: 'Adrian Schier', role: 'MBA Student', order: 3 },
    { company: 'EADA Business School', quote: "I contact more than 4 people daily, and sometimes I lose track of who I talked with. CareerOS helped me track people I talked with to request recommendations in their company.", author: 'Raissa Oliveira Soares', role: 'International MBA', order: 4 },
  ]

  await prisma.caseStudy.deleteMany({})
  await prisma.caseStudy.createMany({ data: caseStudies })
  console.log('Seeded case studies:', caseStudies.length)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
