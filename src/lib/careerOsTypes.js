/** @typedef {Object} ParsedIntelligence
 * @property {string} coreProductFocus
 * @property {number} aiMaturityStage
 * @property {string} strategicOpportunityGap
 * @property {string} competitivePositioning
 * @property {string} hiddenTransformationOpportunity
 */

/** @typedef {Object} Profile
 * @property {string} [id]
 * @property {string} name
 * @property {string} cv_text
 * @property {string} prior_prds
 * @property {string} target_roles
 */

/** @typedef {'ingested'|'parsed'|'generating'|'ready'|'applied'|'interview'|'rejected'|'offer'} JobStatus */

/** @typedef {Object} Job
 * @property {string} id
 * @property {string} company_name
 * @property {string} job_title
 * @property {string} job_description
 * @property {string} application_link
 * @property {JobStatus} status
 * @property {number} ai_maturity_level
 * @property {string} parsed_intelligence
 * @property {string} cover_letter
 * @property {string} prd_content
 * @property {string} created_at
 * @property {string} updated_at
 */

export const AI_MATURITY_LEVELS = [
  'Data Intelligence',
  'Recommendations',
  'Decision Tracking',
  'Outcome Attribution',
  'Predictive Optimisation',
  'Semi-Autonomous Agents',
  'Autonomous Systems',
];
