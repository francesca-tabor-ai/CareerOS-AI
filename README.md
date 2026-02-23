# CareerOS AI

> The career management platform for modern universities

## Marketing site

This repository includes a product marketing website with:

- **Landing page** — Customer, pain points, and solution
- **Pricing page** — Individual, Team, and Enterprise tiers with scaling functionality
- **Case studies** — Success stories with scrolling university logos

### Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Backend API

The backend runs separately:

```bash
cd backend
npm install
cp .env.example .env   # Edit with your DATABASE_URL and JWT_SECRET
npx prisma db push
npm run db:seed
npm run dev
```

The API runs on [http://localhost:3001](http://localhost:3001). Set `VITE_API_URL=http://localhost:3001` in the frontend `.env.local` if different.

### Job Application Engine (`/app`)

Sign up or log in, then go to `/app` to access the CareerOS AI Job Application Engine:

- **Dashboard** — Overview and quick links
- **Jobs** — Add jobs via paste-and-parse or manual entry
- **Applications** — Track applications, edit cover letters & PRDs
- **Insights** — Analytics and recommendations
- **Profile** — Resume, skills, preferences for AI generation
- **Market Intelligence** — Full classic UI with strategic parsing

Required env for AI features: `GEMINI_API_KEY` in backend `.env`.

### Admin dashboard

- Navigate to `/admin` to sign in as admin
- Default admin: `admin@careeros.ai` / `Admin123!` (from seed)
- Admins can view and manage contact submissions, app submissions, users, plans, and case studies

### Build for production

```bash
npm run build
```

---

## Platform Description

*Written by the Product Manager*

### Our Ideal Customer Profile (ICP)

CareerOS AI is built for **university career centers and their ecosystems** — specifically:

- **Primary decision-makers:** Directors of Career Services, Vice Provosts of Student Success, and Deans who need to prove outcomes to leadership, accreditation bodies, and boards
- **End users:** MBA candidates, graduate students, and early-career professionals who face a competitive, fragmented job market and need structured support — not just advice, but actionable tools
- **Stakeholders:** Employer relations teams, alumni relations, and advancement — all of whom benefit when career data, placements, and engagement flow through one system

We serve institutions that care deeply about **employability, equity, and measurable impact** — and are tired of cobbling together spreadsheets, email templates, and standalone tools that don’t talk to each other.

---

### Their Pain Points

**For Career Services Leaders:**
- **Fragmented tools:** Job boards, CRM, event platforms, and outcome tracking live in separate systems — leading to manual data entry, lost visibility, and weeks spent on reporting instead of advising
- **Visibility gaps:** It’s hard to see who’s active, who’s stuck, and who needs support until it’s too late — students slip through the cracks
- **Impact proof:** Leadership and accreditation require clear metrics; building board packs, outcome reports, and funding narratives often takes weeks and relies on inconsistent definitions

**For Students:**
- **Overwhelm:** Hundreds of roles, dozens of touchpoints, and no clear way to track applications, follow-ups, and networking — leading to dropped leads and missed opportunities
- **Networking friction:** Knowing *how* to network isn’t enough; they need guidance *in the moment* — messaging, coffee chat questions, and contact management — as they’re actually doing it
- **Resume guesswork:** Generic resumes sent into ATS black holes; no structured way to tailor by role or align with university branding and best practices

**For Institutions:**
- **Under-resourced teams:** Career centers are asked to do more with the same headcount; manual work limits how many students each advisor can effectively support

---

### Why CareerOS AI Is the Best Solution on the Market

1. **Unified ecosystem:** One platform for advising, employer relations, alumni, and outcomes — so students, advisors, and employers work in the same place. No more switching between tools, re-keying data, or losing context.

2. **AI that works in the flow:** Instead of workshops that teach students *about* networking, CareerOS AI gives them *tools that guide them as they network* — personalized outreach, interview prep, company insights, and coffee chat suggestions, generated in context. It’s the difference between a lecture on riding a bike and a bike with training wheels they can use on day one.

3. **Visibility that drives action:** See who’s active, who’s stuck, and who needs support *before* they disappear. Advisors can prioritize outreach, run targeted campaigns, and prove they’re reaching underserved populations.

4. **Impact that leadership understands:** One dashboard that turns daily work into placements, engagement, and funding credibility — with consistent definitions, auditable metrics, and exports ready for accreditation, boards, and budget defense.

5. **Built for the institution:** GDPR and FERPA compliant, EU-hosted, with SSO/SIS integration. Fits into existing infrastructure (LinkedIn, Salesforce, Canvas, Handshake, Outlook, Gmail) instead of replacing it.

6. **Trusted where it matters:** 70+ leading universities globally; 91% of partner institutions would recommend CareerOS. Results are real, not aspirational.

---

### Expected Results & ROI

**Placement & engagement**
- **122%** of CareerOS students land a role at their dream company
- **5.4x** increase in meaningful career services–student interactions
- Higher event ROI: better registrations, attendance, and follow-up — with measurable attribution

**Operational efficiency**
- **2× effective caseload** from automation — advisors support more students with the same team
- Export time-saved analysis for budget defense and resource allocation
- Accreditation and board packs in seconds, not weeks — with consistent definitions and audit trails

**Strategic value**
- Data-driven insights into engagement, equity, and outcomes — so you can improve, not just report
- Alumni touchpoints tied to placements, NPS, and donation likelihood — strengthening advancement and employer partnerships
- A single story to tell: activation → applications → offers → accepted, with clear cohort definitions and trendlines

---

### Bottom Line

CareerOS AI exists so career centers can **do more with the team they have** — and prove it. We combine a unified platform, AI that guides students in real time, and outcomes visibility that leadership actually trusts. The result: better placements, higher engagement, and data that justifies investment instead of defending it.

**Built for students. Trusted by universities. Loved by employers.**
