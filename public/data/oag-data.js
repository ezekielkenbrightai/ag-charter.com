/**
 * OAG Kenya — Static Data Layer
 *
 * Document-sourced constants for frontend rendering.
 * Dynamic data (performance indicators, users) comes from the API.
 *
 * Sources:
 *   - AG Outline.docx (org structure, access protocols, workflows)
 *   - Mandate docx (constitutional articles, statutory framework)
 *   - State Department docx (SDJHCA structure, agencies)
 *   - FY 2025-26 Performance Contract (budget figures)
 */
window.OAG = (function () {
  'use strict';

  // ============================================
  // ACCESS TIERS (from AG Outline)
  // ============================================
  var ACCESS_TIERS = [
    { level: 1, name: 'Full Access', short: 'ICT Admin', color: '#1a5632',
      description: 'Complete system access including administration and configuration' },
    { level: 2, name: 'Executive Dashboard', short: 'Executive', color: '#c8102e',
      description: 'Strategic dashboards, reporting, and oversight' },
    { level: 3, name: 'Full State Dept Access', short: 'State Dept', color: '#d4a017',
      description: 'Full departmental operational access across both State Departments' },
    { level: 4, name: 'Department Dashboard', short: 'Dept Head', color: '#2563eb',
      description: 'Department-level dashboards, management, and reporting' },
    { level: 5, name: 'Operational Access', short: 'Operational', color: '#7c3aed',
      description: 'Day-to-day operational functions within assigned department' },
    { level: 6, name: 'ODA Access', short: 'ODA Partner', color: '#059669',
      description: 'Development partner and ODA-focused views' },
    { level: 7, name: 'One Way Access', short: 'Data Entry', color: '#6b7280',
      description: 'Data entry only — no read access to reports or dashboards' }
  ];

  // ============================================
  // ORGANIZATIONAL STRUCTURE (3-tier from AG Outline)
  // ============================================
  var ORG = {
    // Tier 1: Executive Office of the Attorney General
    EXECUTIVE: {
      name: 'Executive Office of the Attorney General',
      color: '#1a5632',
      head: { title: 'Attorney General', name: 'Hon. Dorcas Aganda Oduor, SC, OGW, EBS' },
      units: [
        { name: 'Office of the Attorney General', head: 'Attorney General' },
        { name: 'Office of the Solicitor General', head: 'Solicitor General' },
        { name: 'Chief of Staff Office', head: 'Chief of Staff' },
        { name: 'Executive Secretariat', head: 'Head of Executive Secretariat' },
        { name: 'ICT Advisory Unit', head: 'ICT Advisor' }
      ]
    },

    // Tier 2: State Law Office (SLO)
    SLO: {
      name: 'State Law Office',
      color: '#c8102e',
      head: { title: 'Solicitor General', name: 'Shadrack Mose' },
      divisions: [
        { name: 'Civil Litigation Division', head: 'Deputy Solicitor General' },
        { name: 'International Law Division', head: 'Deputy Solicitor General' },
        { name: 'Treaties Division', head: 'Senior Asst Solicitor General' },
        { name: 'Government Transactions Division', head: 'Deputy Solicitor General' },
        { name: 'Legislative Drafting Division', head: 'Deputy Solicitor General' },
        { name: 'Legal Advisory and Research Division', head: 'Deputy Solicitor General' },
        { name: 'Registrar General Division', head: 'Registrar General' },
        { name: 'Public Trustee Division', head: 'Public Trustee' }
      ],
      support: [
        { name: 'Administration', head: 'Director' },
        { name: 'Central Planning & Project Management', head: 'Director' },
        { name: 'Human Resource Management', head: 'Director HR' },
        { name: 'Finance Section', head: 'Chief Finance Officer' },
        { name: 'ICT Section', head: 'ICT Director' },
        { name: 'Supply Chain Management', head: 'Head of Supply Chain' },
        { name: 'Internal Audit', head: 'Chief Internal Auditor' },
        { name: 'Public Communications', head: 'Director of Communications' }
      ],
      sagas: [
        { name: 'Business Registration Service', short: 'BRS', head: 'Director General' },
        { name: 'Council for Legal Education', short: 'CLE', head: 'CEO' },
        { name: 'Kenya School of Law', short: 'KSL', head: 'Director' },
        { name: 'Auctioneers Licensing Board', short: 'ALB', head: 'Registrar' },
        { name: 'Nairobi Centre for International Arbitration', short: 'NCIA', head: 'Director' },
        { name: 'Advocates Disciplinary Tribunal', short: 'ADT', head: 'Chairperson' },
        { name: 'Advocates Complaints Commission', short: 'ACC', head: 'Secretary/CEO' },
        { name: 'National Council for Law Reporting', short: 'NCLR', head: 'CEO' }
      ]
    },

    // Tier 3: State Department for Justice, HR & Constitutional Affairs
    SDJHCA: {
      name: 'State Department for Justice, Human Rights & Constitutional Affairs',
      color: '#1e3a5f',
      head: { title: 'Principal Secretary', name: 'Hon. Judith Pareno' },
      directorates: [
        { name: 'Directorate of Human Rights & Legal Education', head: 'Director', focus: 'UDHR, ICCPR, ICESCR compliance; civic education' },
        { name: 'Directorate of Constitutional Implementation', head: 'Director', focus: 'Chapter 4 Bill of Rights; constitutional commissions oversight' },
        { name: 'Directorate of Ethics & Anti-Corruption', head: 'Director', focus: 'NEAP implementation; Whistleblower Protection' },
        { name: 'GJLOS Sector Coordination', head: 'Coordinator', focus: 'Justice sector reform coordination' },
        { name: 'National Anti-Corruption Campaign Steering Committee', head: 'Chairperson', focus: 'National Ethics and Anti-Corruption Policy' },
        { name: 'National Coroners Service', head: 'Chief Coroner', focus: 'Death investigation and certification' }
      ],
      agencies: [
        { name: 'National Legal Aid Service', short: 'NLAS', head: 'Director General', mandate: 'Legal aid in all 47 counties; target 80,000 citizens FY 2025/26' },
        { name: 'Victim Protection Board', short: 'VPB', head: 'Chairperson', mandate: 'Victim protection and compensation' },
        { name: 'Witness Protection Agency', short: 'WPA', head: 'Director', mandate: 'Witness safety and relocation' },
        { name: 'Assets Recovery Agency', short: 'ARA', head: 'Director', mandate: 'Recovery of proceeds of crime' },
        { name: 'Multi-Agency Anti-Corruption Team', short: 'MAT', head: 'Head of Secretariat', mandate: 'Inter-agency anti-corruption coordination' }
      ]
    }
  };

  // ============================================
  // LEGAL FRAMEWORK (from Mandate document)
  // ============================================
  var LEGAL = {
    // Constitutional articles
    ARTICLES: [
      { article: '156', title: 'Attorney General', text: 'Principal legal adviser to the Government. Appears as a party in proceedings of public interest. Promotes, protects and upholds the rule of law and defends the public interest.' },
      { article: '156(4)', title: 'AG Functions', text: '(a) Principal legal adviser; (b) Represent national government in court; (c) Advise departments on legislative and legal matters; (d) Promote and protect the rule of law; (e) Negotiate and execute treaties; (f) Perform other functions as per Act of Parliament.' },
      { article: '132(4)(a)', title: 'Constitutional Implementation', text: 'Submit annual report to Parliament on constitutional implementation progress.' },
      { article: '21', title: 'Implementation of Rights', text: 'Fundamental duty of the State to observe, respect, protect, promote and fulfil the Bill of Rights.' },
      { article: '10', title: 'National Values', text: 'National values and principles of governance including rule of law, democracy, and participation of the people.' },
      { article: '259', title: 'Interpretation', text: 'The AG shall be consulted in any constitutional interpretation matter of national importance.' }
    ],

    // Key statutes
    STATUTES: [
      { name: 'Office of the Attorney General Act, 2012', cap: 'No. 49 of 2012', purpose: 'Establishes the OAG and its functions' },
      { name: 'State Law Office and Department of Justice Act', cap: 'Pending', purpose: 'Organizational framework for SLO and DOJ' },
      { name: 'Government Proceedings Act', cap: 'Cap 40', purpose: 'Procedures for lawsuits against the Government' },
      { name: 'Law of Contract Act', cap: 'Cap 23', purpose: 'Government contract advice and review' },
      { name: 'Treaty Making and Ratification Act, 2012', cap: 'No. 45 of 2012', purpose: 'Treaty negotiation, signing, and ratification' },
      { name: 'Legal Aid Act, 2016', cap: 'No. 6 of 2016', purpose: 'Establishment of NLAS; legal aid in all counties' },
      { name: 'Witness Protection Act', cap: 'No. 16 of 2006', purpose: 'Witness protection programme' },
      { name: 'Proceeds of Crime and Anti-Money Laundering Act', cap: 'No. 9 of 2009', purpose: 'ARA mandate for asset recovery' },
      { name: 'Anti-Corruption and Economic Crimes Act', cap: 'No. 3 of 2003', purpose: 'Framework for fighting corruption' },
      { name: 'Advocates Act', cap: 'Cap 16', purpose: 'Regulation of legal profession; ACC/ADT mandate' },
      { name: 'Registration of Documents Act', cap: 'Cap 285', purpose: 'Registrar General functions' },
      { name: 'Public Trustee Act', cap: 'Cap 168', purpose: 'Administration of estates and trusts' },
      { name: 'Societies Act', cap: 'Cap 108', purpose: 'Registration of societies' },
      { name: 'Marriage Act, 2014', cap: 'No. 4 of 2014', purpose: 'Marriage registration' },
      { name: 'Victim Protection Act, 2014', cap: 'No. 17 of 2014', purpose: 'Victim Protection Board establishment' }
    ],

    // Key milestones
    TIMELINE: [
      { year: 2010, event: 'Constitution of Kenya 2010 promulgated', type: 'constitutional' },
      { year: 2012, event: 'Office of the Attorney General Act enacted', type: 'legislative' },
      { year: 2012, event: 'Treaty Making and Ratification Act enacted', type: 'legislative' },
      { year: 2014, event: 'Marriage Act 2014 enacted', type: 'legislative' },
      { year: 2014, event: 'Victim Protection Act 2014 enacted', type: 'legislative' },
      { year: 2016, event: 'Legal Aid Act 2016 — NLAS established', type: 'institutional' },
      { year: 2018, event: 'National Ethics and Anti-Corruption Policy (NEAP)', type: 'policy' },
      { year: 2023, event: 'Digital Transformation Strategy initiated', type: 'digital' },
      { year: 2024, event: 'e-Citizen integration for OAG services', type: 'digital' },
      { year: 2025, event: 'OAG Digital Platform Phase I launch', type: 'digital' },
      { year: 2025, event: 'FY 2025/26 Performance Contract signed', type: 'performance' }
    ]
  };

  // ============================================
  // WORKFLOW DEFINITIONS (from AG Outline)
  // ============================================
  var WORKFLOWS = {
    PUBLIC: {
      name: 'Public Service Request Pipeline',
      stages: [
        { id: 1, name: 'Request Submission', desc: 'Citizen or entity submits request via portal, email, or physical office', icon: '1' },
        { id: 2, name: 'Triage & Assignment', desc: 'Registry classifies request type and assigns to relevant department', icon: '2' },
        { id: 3, name: 'Review & Processing', desc: 'Assigned officer reviews request, checks documentation, and processes', icon: '3' },
        { id: 4, name: 'Quality Assurance', desc: 'Supervisor/HOD reviews output for accuracy and compliance', icon: '4' },
        { id: 5, name: 'Approval & Sign-off', desc: 'Authorized signatory approves final output', icon: '5' },
        { id: 6, name: 'Dispatch & Notification', desc: 'Output dispatched to client; system sends notification with tracking reference', icon: '6' }
      ]
    },
    INTERNAL: {
      name: 'Internal Legal Workflow Pipeline',
      stages: [
        { id: 1, name: 'Case Intake', desc: 'New case or legal matter registered in system with unique reference number', icon: '1' },
        { id: 2, name: 'Case Analysis', desc: 'State Counsel analyzes facts, reviews precedents, identifies legal issues', icon: '2' },
        { id: 3, name: 'Strategy Development', desc: 'Legal strategy formulated; consultations with client ministry if needed', icon: '3' },
        { id: 4, name: 'Draft & Review', desc: 'Pleadings/opinions/contracts drafted; peer review and supervisor check', icon: '4' },
        { id: 5, name: 'HOD/DSG Approval', desc: 'Head of Department or Deputy Solicitor General approves final document', icon: '5' },
        { id: 6, name: 'Filing & Tracking', desc: 'Document filed/dispatched; system tracks deadlines and follow-up actions', icon: '6' }
      ]
    }
  };

  // ============================================
  // BUDGET CONSTANTS (FY 2025/26)
  // ============================================
  var BUDGET = {
    fiscal_year: 'FY 2025/26',
    total: 4008672579,
    development: 250000000,
    recurrent: 3758672579,
    slo_recurrent: 3371672579,
    sdjhca_recurrent: 387000000,
    revenue_target: 185000000,
    procurement_agpo: 170728159.50, // 30% AGPO allocation
    formatted: {
      total: 'KSh 4.009B',
      development: 'KSh 250M',
      recurrent: 'KSh 3.759B',
      revenue_target: 'KSh 185M'
    }
  };

  // ============================================
  // KEY FUNCTIONS (AG Mandate)
  // ============================================
  var KEY_FUNCTIONS = [
    { name: 'Principal Legal Adviser', desc: 'Advise the Government on legal matters', icon: '&#9878;' },
    { name: 'Government Litigation', desc: 'Represent the national government in civil proceedings', icon: '&#9998;' },
    { name: 'Legislative Drafting', desc: 'Draft legislation and review Bills before Parliament', icon: '&#9997;' },
    { name: 'Treaty Management', desc: 'Negotiate, sign, and advise on treaty ratification', icon: '&#127760;' },
    { name: 'Constitutional Implementation', desc: 'Monitor and report on Constitution 2010 implementation', icon: '&#128220;' },
    { name: 'Rule of Law', desc: 'Promote, protect, and uphold the rule of law', icon: '&#9878;' },
    { name: 'Public Interest Litigation', desc: 'Appear in proceedings of public interest', icon: '&#128101;' },
    { name: 'Government Transactions', desc: 'Vet procurement contracts and commercial agreements', icon: '&#128196;' },
    { name: 'Legal Aid Services', desc: 'Provide legal aid to vulnerable citizens in all 47 counties', icon: '&#128587;' },
    { name: 'Anti-Corruption', desc: 'Strengthen anti-corruption legal and policy framework', icon: '&#128737;' },
    { name: 'Registration Services', desc: 'Register marriages, societies, documents, and arms', icon: '&#128203;' },
    { name: 'Trusteeship Services', desc: 'Administer estates and trusts through the Public Trustee', icon: '&#127970;' }
  ];

  // Public API
  return {
    ACCESS_TIERS: ACCESS_TIERS,
    ORG: ORG,
    LEGAL: LEGAL,
    WORKFLOWS: WORKFLOWS,
    BUDGET: BUDGET,
    KEY_FUNCTIONS: KEY_FUNCTIONS
  };
})();
