import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Extract structured job fields from pasted text (URL or description)
 * @param {string} rawInput - Pasted URL or full job description
 * @returns {Promise<{company_name:string,job_title:string,job_description:string,application_link:string|null}>}
 */
export async function parseJobFromText(rawInput) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Extract job application details from the following text. It may be a URL, a job posting, or a mix.
    Text: ${rawInput.slice(0, 15000)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          company_name: { type: Type.STRING, description: "Company/organization name" },
          job_title: { type: Type.STRING, description: "Job title or role" },
          job_description: { type: Type.STRING, description: "Full job description text" },
          application_link: { type: Type.STRING, description: "URL to apply, or null if not found" },
        },
        required: ["company_name", "job_title", "job_description"],
      },
    },
  });

  const parsed = JSON.parse(response.text || "{}");
  return {
    company_name: parsed.company_name || "Unknown",
    job_title: parsed.job_title || "Product Role",
    job_description: parsed.job_description || rawInput,
    application_link: parsed.application_link || null,
  };
}

/**
 * Parse job description for strategic PM insights using AI Maturity Framework
 * @param {string} jobDescription
 * @returns {Promise<{coreProductFocus:string,aiMaturityStage:number,strategicOpportunityGap:string,competitivePositioning:string,hiddenTransformationOpportunity:string}>}
 */
export async function parseJobIntelligence(jobDescription) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Analyze the following job description for a Product Manager role and extract strategic insights.
    Job Description: ${jobDescription}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          coreProductFocus: { type: Type.STRING },
          aiMaturityStage: {
            type: Type.INTEGER,
            description: "1-7 based on the AI Maturity Framework",
          },
          strategicOpportunityGap: { type: Type.STRING },
          competitivePositioning: { type: Type.STRING },
          hiddenTransformationOpportunity: { type: Type.STRING },
        },
        required: [
          "coreProductFocus",
          "aiMaturityStage",
          "strategicOpportunityGap",
          "competitivePositioning",
          "hiddenTransformationOpportunity",
        ],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

/**
 * Generate tailored cover letter
 * @param {{company_name:string,job_title:string,job_description:string}} job
 * @param {{name:string,cv_text:string}} profile
 * @param {object} intelligence
 */
export async function generateCoverLetter(job, profile, intelligence) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Generate a 300-400 word tailored cover letter for ${profile.name} applying for the ${job.job_title} role at ${job.company_name}.
    
    Context:
    - Job Description: ${job.job_description}
    - Candidate CV: ${profile.cv_text}
    - Strategic Intelligence: ${JSON.stringify(intelligence)}
    
    Tone: Strategic, Confident, Non-generic.
    Focus on: Company AI ambition, strategic insight, systems-level thinking, and teaser of an attached PRD.`,
  });

  return response.text || "";
}

/**
 * Generate Strategic AI PRD
 * @param {{company_name:string,job_title:string,job_description:string}} job
 * @param {{name:string,cv_text:string,prior_prds?:string}} profile
 * @param {object} intelligence
 */
export async function generatePRD(job, profile, intelligence) {
  const priorPrds = profile.prior_prds || "";
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Generate a Strategic AI Product Requirements Document (PRD) for ${job.company_name} as a demonstration of strategic thinking for the ${job.job_title} role.
    
    Context:
    - Job Description: ${job.job_description}
    - Candidate Background: ${profile.cv_text}
    - Prior PRDs: ${priorPrds}
    - Strategic Intelligence: ${JSON.stringify(intelligence)}
    
    The PRD MUST include these sections:
    1. Executive Summary
    2. Problem Framing
    3. Strategic AI Vision
    4. AI Maturity Assessment (Current vs Target)
    5. AI Maturity Roadmap (using the 7-level framework)
    6. Technical Architecture Overview
    7. Data & Infrastructure Requirements
    8. Feedback & Learning Loop
    9. KPIs
    10. 24-Month Roadmap
    
    Use Markdown for formatting.`,
  });

  return response.text || "";
}
