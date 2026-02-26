-- OAG Kenya Digital Platform - Seed Data
-- Sources: AG Outline, FY 2025-26 Performance Contract, AG Mandate, SDJHCA Document

-- ============================================
-- ACCESS TIERS (AG Outline - Portal Access Protocols)
-- ============================================
INSERT INTO access_tiers (level, name, description) VALUES
(1, 'Full Access', 'Complete system access including all dashboards, administration, and configuration. Assigned to ICT Advisor.'),
(2, 'Executive Dashboard', 'Strategic dashboards, reporting, and oversight. Assigned to AG, Head of Executive Secretariat, and Advisors.'),
(3, 'Full State Dept Access', 'Full departmental operational access across both State Departments. Assigned to SG, PS, ICT Directors, Technical Advisors.'),
(4, 'Department Dashboard', 'Department-level dashboards, management, and reporting. Assigned to Heads of Department, Division, Section, or Unit.'),
(5, 'Operational Access', 'Day-to-day operational functions within assigned department. Assigned to State Counsel, Line Officers, Planning Officers.'),
(6, 'ODA Access', 'Development partner and Official Development Assistance focused views. Assigned to bilateral/multilateral partner representatives.'),
(7, 'One Way Access', 'Data entry only with no read access to reports or dashboards. Assigned to Data Entry Clerks.');

-- ============================================
-- DEPARTMENTS (3-tier organizational structure from AG Outline)
-- ============================================

-- === TIER 1: Executive Office of the Attorney General ===
INSERT INTO departments (id, name, short_name, tier, type, parent_id, head_title, color, sort_order) VALUES
(1,  'Executive Office of the Attorney General', 'Executive Office', 'Executive Office', 'office', NULL, 'Attorney General', '#1a5632', 1),
(2,  'Office of the Attorney General', 'AG Office', 'Executive Office', 'unit', 1, 'Attorney General', '#1a5632', 2),
(3,  'Office of the Solicitor General', 'SG Office', 'Executive Office', 'unit', 1, 'Solicitor General', '#1a5632', 3),
(4,  'Chief of Staff Office', 'Chief of Staff', 'Executive Office', 'unit', 1, 'Chief of Staff', '#1a5632', 4),
(5,  'Executive Secretariat', 'Exec Secretariat', 'Executive Office', 'unit', 1, 'Head of Executive Secretariat', '#1a5632', 5),
(6,  'ICT Advisory Unit', 'ICT Advisory', 'Executive Office', 'unit', 1, 'ICT Advisor', '#1a5632', 6);

-- === TIER 2: State Law Office ===
INSERT INTO departments (id, name, short_name, tier, type, parent_id, head_title, color, sort_order) VALUES
(10, 'State Law Office', 'SLO', 'SLO', 'office', NULL, 'Solicitor General', '#c8102e', 10),
-- SLO Departments
(11, 'Civil Litigation Division', 'Civil Litigation', 'SLO', 'division', 10, 'Deputy Solicitor General', '#c8102e', 11),
(12, 'International Law Division', 'International Law', 'SLO', 'division', 10, 'Deputy Solicitor General', '#c8102e', 12),
(13, 'Treaties Division', 'Treaties', 'SLO', 'division', 10, 'Senior Assistant Solicitor General', '#c8102e', 13),
(14, 'Government Transactions Division', 'Govt Transactions', 'SLO', 'division', 10, 'Deputy Solicitor General', '#c8102e', 14),
(15, 'Legislative Drafting Division', 'Legislative Drafting', 'SLO', 'division', 10, 'Deputy Solicitor General', '#c8102e', 15),
(16, 'Legal Advisory and Research Division', 'Legal Advisory', 'SLO', 'division', 10, 'Deputy Solicitor General', '#c8102e', 16),
(17, 'Registrar General Division', 'Registrar General', 'SLO', 'division', 10, 'Registrar General', '#c8102e', 17),
(18, 'Public Trustee Division', 'Public Trustee', 'SLO', 'division', 10, 'Public Trustee', '#c8102e', 18),
(19, 'Administration Department', 'Administration', 'SLO', 'department', 10, 'Director of Administration', '#c8102e', 19),
(20, 'Central Planning and Project Management', 'Planning & Projects', 'SLO', 'department', 10, 'Director', '#c8102e', 20),
(21, 'Human Resource Management Division', 'HR Management', 'SLO', 'division', 10, 'Director HR', '#c8102e', 21),
(22, 'Finance Section', 'Finance', 'SLO', 'section', 10, 'Chief Finance Officer', '#c8102e', 22),
(23, 'Information Communication Technology', 'ICT', 'SLO', 'section', 10, 'ICT Director', '#c8102e', 23),
(24, 'Supply Chain Management Services', 'Supply Chain', 'SLO', 'section', 10, 'Head of Supply Chain', '#c8102e', 24),
(25, 'Internal Audit Section', 'Internal Audit', 'SLO', 'section', 10, 'Chief Internal Auditor', '#c8102e', 25),
(26, 'Public Communications Division', 'Communications', 'SLO', 'division', 10, 'Director of Communications', '#c8102e', 26),
-- SLO Semi-Autonomous Government Agencies (SAGAs)
(30, 'Business Registration Service', 'BRS', 'SLO', 'agency', 10, 'Director General', '#c8102e', 30),
(31, 'Council for Legal Education', 'CLE', 'SLO', 'agency', 10, 'CEO', '#c8102e', 31),
(32, 'Kenya School of Law', 'KSL', 'SLO', 'agency', 10, 'Director', '#c8102e', 32),
(33, 'Auctioneers Licensing Board', 'ALB', 'SLO', 'agency', 10, 'Registrar', '#c8102e', 33),
(34, 'Nairobi Centre for International Arbitration', 'NCIA', 'SLO', 'agency', 10, 'Director', '#c8102e', 34),
(35, 'Advocates Disciplinary Tribunal', 'ADT', 'SLO', 'agency', 10, 'Chairperson', '#c8102e', 35),
(36, 'Advocates Complaints Commission', 'ACC', 'SLO', 'agency', 10, 'Secretary/CEO', '#c8102e', 36),
(37, 'National Council for Law Reporting', 'NCLR', 'SLO', 'agency', 10, 'CEO', '#c8102e', 37);

-- === TIER 3: State Department for Justice, HR & Constitutional Affairs (SDJHCA) ===
INSERT INTO departments (id, name, short_name, tier, type, parent_id, head_title, color, sort_order) VALUES
(50, 'State Department for Justice, Human Rights and Constitutional Affairs', 'SDJHCA', 'SDJHCA', 'office', NULL, 'Principal Secretary', '#1e3a5f', 50),
-- SDJHCA Divisions
(51, 'Directorate of Human Rights and Legal Education', 'Human Rights', 'SDJHCA', 'directorate', 50, 'Director', '#1e3a5f', 51),
(52, 'Directorate of Constitutional Implementation, Democracy and Good Governance', 'Constitutional Affairs', 'SDJHCA', 'directorate', 50, 'Director', '#1e3a5f', 52),
(53, 'Directorate of Ethics, Integrity, Anti-Corruption and Economic Crimes', 'Anti-Corruption', 'SDJHCA', 'directorate', 50, 'Director', '#1e3a5f', 53),
(54, 'GJLOS Sector Coordination', 'GJLOS', 'SDJHCA', 'division', 50, 'Coordinator', '#1e3a5f', 54),
(55, 'National Anti-Corruption Campaign Steering Committee', 'NACC-SC', 'SDJHCA', 'committee', 50, 'Chairperson', '#1e3a5f', 55),
(56, 'National Coroners Service', 'Coroners', 'SDJHCA', 'division', 50, 'Chief Coroner', '#1e3a5f', 56),
-- SDJHCA Semi-Autonomous Agencies
(60, 'National Legal Aid Service', 'NLAS', 'SDJHCA', 'agency', 50, 'Director General', '#1e3a5f', 60),
(61, 'Victim Protection Board', 'VPB', 'SDJHCA', 'agency', 50, 'Chairperson', '#1e3a5f', 61),
(62, 'Witness Protection Agency', 'WPA', 'SDJHCA', 'agency', 50, 'Director', '#1e3a5f', 62),
(63, 'Assets Recovery Agency', 'ARA', 'SDJHCA', 'agency', 50, 'Director', '#1e3a5f', 63),
(64, 'Multi-Agency Anti-Corruption Team', 'MAT', 'SDJHCA', 'agency', 50, 'Head of Secretariat', '#1e3a5f', 64);

-- Reset sequence
SELECT setval('departments_id_seq', 70);

-- ============================================
-- USERS (~80+ from org chart, all tiers)
-- Password for ALL demo users: oag2025
-- Hash generated by bcryptjs: $2a$10$ prefix
-- ============================================
-- NOTE: The password hash below is for 'oag2025' - generated at init time by db/init.js

-- === TIER 1: Full Access (1 user) ===
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('AG/ICT/001', 'ict.advisor@ag.go.ke', '__HASH__', 'James Mwangi Kariuki', 'ICT Advisor to the Attorney General', 6, 1);

-- === TIER 2: Executive Dashboard (4 users) ===
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('AG/EXE/001', 'ag@ag.go.ke', '__HASH__', 'Hon. Dorcas Aganda Oduor, SC, OGW, EBS', 'Attorney General', 2, 2),
('AG/EXE/002', 'secretariat@ag.go.ke', '__HASH__', 'Dr. Kennedy Ogeto', 'Head of Executive Secretariat', 5, 2),
('AG/EXE/003', 'advisor1@ag.go.ke', '__HASH__', 'Prof. Patricia Kameri-Mbote', 'Senior Advisor (Legal Policy)', 2, 2),
('AG/EXE/004', 'advisor2@ag.go.ke', '__HASH__', 'Dr. Githu Muigai', 'Senior Advisor (International Law)', 2, 2);

-- === TIER 3: Full State Dept Access (5 users) ===
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('AG/SG/001', 'sg@ag.go.ke', '__HASH__', 'Shadrack Mose', 'Solicitor General', 3, 3),
('DOJ/PS/001', 'ps@justice.go.ke', '__HASH__', 'Hon. Judith Pareno', 'Principal Secretary, SDJHCA', 50, 3),
('AG/ICT/002', 'ict.director@ag.go.ke', '__HASH__', 'Eng. David Njoroge', 'ICT Director', 23, 3),
('AG/ICT/003', 'ict.deputy@ag.go.ke', '__HASH__', 'Grace Wanjiku Maina', 'Deputy ICT Director', 23, 3),
('AG/EXE/005', 'tech.advisor@ag.go.ke', '__HASH__', 'Dr. Samuel Kiama', 'Technical Advisor', 1, 3);

-- === TIER 4: Department Dashboard (~20 users - Heads of Departments/Divisions) ===
-- SLO Department Heads
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('AG/CIV/001', 'civil.lit@ag.go.ke', '__HASH__', 'Margaret Nyambura Kamau', 'Deputy Solicitor General, Civil Litigation', 11, 4),
('AG/INT/001', 'intl.law@ag.go.ke', '__HASH__', 'Dr. Amos Wako Gichinga', 'Deputy Solicitor General, International Law', 12, 4),
('AG/TRE/001', 'treaties@ag.go.ke', '__HASH__', 'Esther Nyachieo', 'Senior Asst Solicitor General, Treaties', 13, 4),
('AG/GTD/001', 'govt.trans@ag.go.ke', '__HASH__', 'Philip Kiptoo Langat', 'Deputy Solicitor General, Govt Transactions', 14, 4),
('AG/LEG/001', 'leg.drafting@ag.go.ke', '__HASH__', 'Dr. Janet Munywoki', 'Deputy Solicitor General, Legislative Drafting', 15, 4),
('AG/LAR/001', 'legal.advisory@ag.go.ke', '__HASH__', 'Fredrick Ouma', 'Deputy Solicitor General, Legal Advisory', 16, 4),
('AG/RG/001', 'registrar@ag.go.ke', '__HASH__', 'Roseline Achola Odede', 'Registrar General', 17, 4),
('AG/PT/001', 'trustee@ag.go.ke', '__HASH__', 'Daniel Mutinda Kioko', 'Public Trustee', 18, 4),
('AG/ADM/001', 'admin@ag.go.ke', '__HASH__', 'Alice Wangari Muturi', 'Director of Administration', 19, 4),
('AG/PLN/001', 'planning@ag.go.ke', '__HASH__', 'Joseph Otieno Odhiambo', 'Director, Planning & Projects', 20, 4),
('AG/HR/001', 'hr@ag.go.ke', '__HASH__', 'Nancy Wanjiku Gichuru', 'Director, Human Resource Management', 21, 4),
('AG/FIN/001', 'finance@ag.go.ke', '__HASH__', 'Michael Kipchirchir Bett', 'Chief Finance Officer', 22, 4),
('AG/SCM/001', 'supply@ag.go.ke', '__HASH__', 'Ruth Chebet Kosgei', 'Head of Supply Chain', 24, 4),
('AG/AUD/001', 'audit@ag.go.ke', '__HASH__', 'Peter Njuguna Ndung''u', 'Chief Internal Auditor', 25, 4),
('AG/COM/001', 'comms@ag.go.ke', '__HASH__', 'Sarah Achieng Onyango', 'Director of Communications', 26, 4);
-- SDJHCA Division Heads
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('DOJ/HR/001', 'human.rights@justice.go.ke', '__HASH__', 'Dr. Lawrence Mute', 'Director, Human Rights & Legal Education', 51, 4),
('DOJ/CON/001', 'constitution@justice.go.ke', '__HASH__', 'Florence Mueni Mutua', 'Director, Constitutional Implementation', 52, 4),
('DOJ/AC/001', 'anticorruption@justice.go.ke', '__HASH__', 'Bernard Ngugi Mukuria', 'Director, Ethics & Anti-Corruption', 53, 4),
('DOJ/GJL/001', 'gjlos@justice.go.ke', '__HASH__', 'Dr. Winnie Kamau', 'GJLOS Sector Coordinator', 54, 4),
('DOJ/COR/001', 'coroners@justice.go.ke', '__HASH__', 'Dr. Emily Chepkoech', 'Chief Coroner', 56, 4);
-- SAGA Heads
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('BRS/DG/001', 'dg@brs.go.ke', '__HASH__', 'Kenneth Gathuma', 'Director General, BRS', 30, 4),
('ACC/CEO/001', 'ceo@acc.go.ke', '__HASH__', 'Faith Waigwa', 'Secretary/CEO, ACC', 36, 4),
('NLAS/DG/001', 'dg@nlas.go.ke', '__HASH__', 'Dr. Annette Mbogoh', 'Director General, NLAS', 60, 4);

-- === TIER 5: Operational Access (~35 users - State Counsel & Officers) ===
-- Civil Litigation
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('AG/CIV/002', 'amina.wanjiku@ag.go.ke', '__HASH__', 'Amina Wanjiku', 'Senior State Counsel, Civil Litigation', 11, 5),
('AG/CIV/003', 'brian.ochieng@ag.go.ke', '__HASH__', 'Brian Ochieng', 'State Counsel, Civil Litigation', 11, 5),
('AG/CIV/004', 'catherine.njeri@ag.go.ke', '__HASH__', 'Catherine Njeri', 'State Counsel, Civil Litigation', 11, 5);
-- International Law
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('AG/INT/002', 'david.kiplagat@ag.go.ke', '__HASH__', 'David Kiplagat', 'Senior State Counsel, International Law', 12, 5),
('AG/INT/003', 'elizabeth.akinyi@ag.go.ke', '__HASH__', 'Elizabeth Akinyi', 'State Counsel, International Law', 12, 5);
-- Treaties
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('AG/TRE/002', 'francis.munyao@ag.go.ke', '__HASH__', 'Francis Munyao', 'State Counsel, Treaties', 13, 5);
-- Government Transactions
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('AG/GTD/002', 'gladys.cheruiyot@ag.go.ke', '__HASH__', 'Gladys Cheruiyot', 'Senior State Counsel, Govt Transactions', 14, 5),
('AG/GTD/003', 'hassan.omar@ag.go.ke', '__HASH__', 'Hassan Omar', 'State Counsel, Govt Transactions', 14, 5),
('AG/GTD/004', 'irene.nzisa@ag.go.ke', '__HASH__', 'Irene Nzisa', 'State Counsel, Govt Transactions', 14, 5);
-- Legislative Drafting
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('AG/LEG/002', 'john.mwenda@ag.go.ke', '__HASH__', 'John Mwenda', 'Senior State Counsel, Legislative Drafting', 15, 5),
('AG/LEG/003', 'kavata.mwikali@ag.go.ke', '__HASH__', 'Kavata Mwikali', 'State Counsel, Legislative Drafting', 15, 5);
-- Legal Advisory & Research
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('AG/LAR/002', 'lydia.nyaga@ag.go.ke', '__HASH__', 'Lydia Nyaga', 'Senior State Counsel, Legal Advisory', 16, 5),
('AG/LAR/003', 'moses.simiyu@ag.go.ke', '__HASH__', 'Moses Simiyu', 'State Counsel, Legal Advisory', 16, 5),
('AG/LAR/004', 'nelly.tanui@ag.go.ke', '__HASH__', 'Nelly Tanui', 'State Counsel, Legal Advisory', 16, 5);
-- Registrar General
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('AG/RG/002', 'oscar.omondi@ag.go.ke', '__HASH__', 'Oscar Omondi', 'Senior Registration Officer', 17, 5),
('AG/RG/003', 'purity.wambui@ag.go.ke', '__HASH__', 'Purity Wambui', 'Registration Officer', 17, 5);
-- Public Trustee
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('AG/PT/002', 'quinter.adhiambo@ag.go.ke', '__HASH__', 'Quinter Adhiambo', 'Senior Estate Officer', 18, 5),
('AG/PT/003', 'richard.karanja@ag.go.ke', '__HASH__', 'Richard Karanja', 'Estate Officer', 18, 5);
-- Planning
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('AG/PLN/002', 'stella.njoroge@ag.go.ke', '__HASH__', 'Stella Njoroge', 'Senior Planning Officer', 20, 5),
('AG/PLN/003', 'tobias.mutua@ag.go.ke', '__HASH__', 'Tobias Mutua', 'Planning Officer', 20, 5);
-- SDJHCA Officers
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('DOJ/HR/002', 'uma.juma@justice.go.ke', '__HASH__', 'Uma Juma', 'Senior Legal Officer, Human Rights', 51, 5),
('DOJ/HR/003', 'veronica.kiptoo@justice.go.ke', '__HASH__', 'Veronica Kiptoo', 'Legal Officer, Human Rights', 51, 5),
('DOJ/CON/002', 'william.rotich@justice.go.ke', '__HASH__', 'William Rotich', 'Senior Legal Officer, Constitutional Affairs', 52, 5),
('DOJ/CON/003', 'xena.auma@justice.go.ke', '__HASH__', 'Xena Auma', 'Legal Officer, Constitutional Affairs', 52, 5),
('DOJ/AC/002', 'yasmin.abdi@justice.go.ke', '__HASH__', 'Yasmin Abdi', 'Senior Legal Officer, Anti-Corruption', 53, 5),
('DOJ/GJL/002', 'zachary.ndirangu@justice.go.ke', '__HASH__', 'Zachary Ndirangu', 'Policy Analyst, GJLOS', 54, 5);
-- NLAS Field Officers
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('NLAS/FO/001', 'agnes.wekesa@nlas.go.ke', '__HASH__', 'Agnes Wekesa', 'Legal Aid Counsel, Nairobi', 60, 5),
('NLAS/FO/002', 'benard.mwangi@nlas.go.ke', '__HASH__', 'Benard Mwangi', 'Legal Aid Counsel, Mombasa', 60, 5),
('NLAS/FO/003', 'carol.nyakio@nlas.go.ke', '__HASH__', 'Carol Nyakio', 'Legal Aid Counsel, Kisumu', 60, 5);
-- ACC Investigators
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('ACC/INV/001', 'daniel.makau@acc.go.ke', '__HASH__', 'Daniel Makau', 'Senior Investigator, ACC', 36, 5),
('ACC/INV/002', 'esther.wafula@acc.go.ke', '__HASH__', 'Esther Wafula', 'Investigator, ACC', 36, 5);

-- === TIER 6: ODA Access (8 users - Development Partners) ===
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('ODA/UNDP/001', 'sarah.johnson@undp.org', '__HASH__', 'Sarah Johnson', 'Head of Governance, UNDP Kenya', 1, 6),
('ODA/WB/001', 'michael.chen@worldbank.org', '__HASH__', 'Michael Chen', 'Senior Governance Specialist, World Bank', 1, 6),
('ODA/EU/001', 'anna.mueller@eeas.europa.eu', '__HASH__', 'Anna Mueller', 'Programme Manager, EU Delegation Kenya', 1, 6),
('ODA/USAID/001', 'robert.smith@usaid.gov', '__HASH__', 'Robert Smith', 'Democracy & Governance Officer, USAID', 1, 6),
('ODA/GIZ/001', 'hans.weber@giz.de', '__HASH__', 'Hans Weber', 'Programme Director, GIZ Rule of Law', 1, 6),
('ODA/FCDO/001', 'charlotte.brown@fcdo.gov.uk', '__HASH__', 'Charlotte Brown', 'Governance Adviser, FCDO Kenya', 1, 6),
('ODA/JICA/001', 'yuki.tanaka@jica.go.jp', '__HASH__', 'Yuki Tanaka', 'Legal Governance Specialist, JICA', 1, 6),
('ODA/AfDB/001', 'kwame.asante@afdb.org', '__HASH__', 'Kwame Asante', 'Governance Portfolio Manager, AfDB', 1, 6);

-- === TIER 7: One Way Access (8 users - Data Entry Clerks) ===
INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level) VALUES
('AG/CLK/001', 'clerk.marriages@ag.go.ke', '__HASH__', 'Peter Kamau Ndungu', 'Data Entry Clerk, Marriage Registry', 17, 7),
('AG/CLK/002', 'clerk.societies@ag.go.ke', '__HASH__', 'Lucy Wambui Muthoni', 'Data Entry Clerk, Societies Registry', 17, 7),
('AG/CLK/003', 'clerk.estates@ag.go.ke', '__HASH__', 'Samuel Otieno Ogutu', 'Data Entry Clerk, Public Trustee', 18, 7),
('AG/CLK/004', 'clerk.brs@ag.go.ke', '__HASH__', 'Mary Nyokabi Githinji', 'Data Entry Clerk, BRS', 30, 7),
('AG/CLK/005', 'clerk.civil@ag.go.ke', '__HASH__', 'George Wafula Simiyu', 'Data Entry Clerk, Civil Litigation', 11, 7),
('AG/CLK/006', 'clerk.legal@ag.go.ke', '__HASH__', 'Hannah Chebet Sang', 'Data Entry Clerk, Legal Advisory', 16, 7),
('AG/CLK/007', 'clerk.intl@ag.go.ke', '__HASH__', 'Stephen Kiprop Koech', 'Data Entry Clerk, International Law', 12, 7),
('AG/CLK/008', 'clerk.drafting@ag.go.ke', '__HASH__', 'Joyce Atieno Ouma', 'Data Entry Clerk, Legislative Drafting', 15, 7);

-- ============================================
-- PERFORMANCE CONTRACT DATA (FY 2025-26)
-- Source: FINAL FY 2025-26 PC AS AT 30.07.2025.pdf
-- ============================================

-- Categories
INSERT INTO pc_categories (id, code, name, weight, fiscal_year) VALUES
(1, 'A', 'Financial Stewardship', 10.00, 'FY 2025/26'),
(2, 'B', 'Service Delivery', 15.00, 'FY 2025/26'),
(3, 'C', 'Core Mandate', 65.00, 'FY 2025/26'),
(4, 'D', 'Presidential Directives', 2.00, 'FY 2025/26'),
(5, 'E', 'Affirmative Action in Procurement', 4.00, 'FY 2025/26'),
(6, 'F', 'Cross-Cutting', 4.00, 'FY 2025/26');

SELECT setval('pc_categories_id_seq', 10);

-- Indicators
INSERT INTO pc_indicators (id, category_id, indicator_code, name, unit_of_measure, target_value, weight, deadline, status) VALUES
-- A: Financial Stewardship
(1,  1, 'A1', 'Absorption of Allocated Funds (GoK)', '%', '100', 6.00, '2026-06-30', 'in_progress'),
(2,  1, 'A4', 'Pending Bills Ratio', '%', '1', 4.00, '2026-06-30', 'in_progress'),
-- B: Service Delivery
(3,  2, 'B1', 'Implementation of Citizens Service Delivery Charter', '%', '100', 4.00, '2026-06-30', 'in_progress'),
(4,  2, 'B2', 'Digitalization of Government Services', '%', '100', 7.00, '2026-06-30', 'in_progress'),
(5,  2, 'B3', 'Resolution of Public Complaints', '%', '100', 4.00, '2026-06-30', 'in_progress'),
-- C: Core Mandate
(6,  3, 'C21_1', 'Civil Litigation Enhanced', '%', '100', 4.00, '2026-06-30', 'in_progress'),
(7,  3, 'C21_2', 'Constitution of Kenya Effectively Implemented', '%', '100', 4.00, '2026-06-30', 'pending'),
(8,  3, 'C21_3', 'Legislative and Policy Framework for Fight against Corruption Strengthened', '%', '100', 3.00, '2026-06-30', 'in_progress'),
(9,  3, 'C21_4', 'Government Transactions Supported', '%', '100', 3.00, '2026-06-30', 'pending'),
(10, 3, 'C21_5', 'Legal Advisory and Research Undertaken', '%', '100', 3.00, '2026-06-30', 'in_progress'),
(11, 3, 'C21_6', 'Access to Legal Aid Services Enhanced', '%', '100', 3.00, '2026-06-30', 'in_progress'),
(12, 3, 'C21_7', 'Anti-Corruption Awareness Enhanced', '%', '100', 2.00, '2026-06-30', 'pending'),
(13, 3, 'C21_8', 'Trusteeship Services Enhanced', 'No.', '4000', 3.00, '2026-06-30', 'in_progress'),
(14, 3, 'C21_9', 'Human Rights and Fundamental Freedoms Promoted', '%', '100', 3.00, '2026-06-30', 'in_progress'),
(15, 3, 'C21_11', 'Access to Quality Legal Education Enhanced', '%', '100', 2.00, '2026-06-30', 'pending'),
(16, 3, 'C21_12', 'Electoral and Political Parties Reforms Undertaken', '%', '100', 2.00, '2026-06-30', 'pending'),
(17, 3, 'C21_13', 'Victim Protection Board Operationalized', '%', '100', 2.00, '2026-06-30', 'pending'),
(18, 3, 'C21_14', 'National Coroners Service Operationalized', '%', '100', 2.00, '2026-06-30', 'pending'),
(19, 3, 'C21_15', 'Governance, Justice, Law and Order Sector Operationalized', '%', '100', 2.00, '2026-06-30', 'pending'),
(20, 3, 'C21_16', 'Revenue Collection', 'Kshs.', '185000000', 4.00, '2026-06-30', 'in_progress'),
(21, 3, 'C21_17', 'International Legal Services Provided', '%', '100', 4.00, '2026-06-30', 'in_progress'),
(22, 3, 'C21_18', 'National Registration Services Enhanced', '%', '100', 4.00, '2026-06-30', 'in_progress'),
(23, 3, 'C21_19', 'Productivity Improvement', 'Index', '3.50', 2.00, '2026-06-30', 'pending'),
(24, 3, 'C21_20', 'Discipline in the Legal Profession Promoted', '%', '100', 3.00, '2026-06-30', 'in_progress'),
(25, 3, 'C21_21', 'Legal Services to Support National Priorities', '%', '100', 2.00, '2026-06-30', 'pending'),
(26, 3, 'C21_22', 'Standard Subsidiary Legislation Drafting Enhanced', 'Days', '7', 2.00, '2026-06-30', 'in_progress'),
(27, 3, 'C21_23', 'Substantive Subsidiary Legislation Drafting Enhanced', 'Days', '30', 2.00, '2026-06-30', 'in_progress'),
(28, 3, 'C21_24', 'Project Completion Rate', '%', '100', 2.00, '2026-06-30', 'in_progress'),
(29, 3, 'C21_25', 'Effective Delivery of Legal Services Enhanced', '%', '100', 2.00, '2026-06-30', 'in_progress'),
-- D: Presidential Directives
(30, 4, 'D1', 'Implementation of Presidential Directives', '%', '100', 2.00, '2026-06-30', 'in_progress'),
-- E: Affirmative Action
(31, 5, 'E1', 'Access to Government Procurement Opportunities', 'Kshs.', '170728159.50', 2.00, '2026-06-30', 'in_progress'),
(32, 5, 'E2', 'Promotion of Local Content in Procurement', 'Kshs.', '227637546', 2.00, '2026-06-30', 'in_progress'),
-- F: Cross-Cutting
(33, 6, 'F1', 'Asset Management', '%', '100', 1.00, '2026-06-30', 'pending'),
(34, 6, 'F2', 'Youth Internships/Attachments/Apprenticeships', 'No.', '290', 1.00, '2026-06-30', 'in_progress'),
(35, 6, 'F3', 'Competence Development', '%', '100', 1.00, '2026-06-30', 'in_progress'),
(36, 6, 'F4', 'National Values and Principles of Governance', '%', '100', 1.00, '2026-06-30', 'in_progress');

SELECT setval('pc_indicators_id_seq', 40);

-- Sub-Indicators (key ones from the PC document)
INSERT INTO pc_sub_indicators (indicator_id, description, unit_of_measure, target_value, completion_date, weight_pct) VALUES
-- A1: Budget Absorption
(1, 'Development Budget (SLO) absorbed', 'Kshs.', '250000000', '2026-06-30', 50.00),
(1, 'Recurrent Budget (SLO KSh 3.371B + SDOJ KSh 387M) absorbed', 'Kshs.', '3758672579', '2026-06-30', 50.00),
-- B1: Citizens Charter
(3, 'Charter displayed at service points in English and Kiswahili', '%', '10', '2025-09-30', 10.00),
(3, 'Charter customized (Braille, sign language, audio, website/social media)', '%', '20', '2025-12-31', 20.00),
(3, 'All staff sensitized on Charter', '%', '20', '2026-03-31', 20.00),
(3, 'Quarterly compliance monitoring and reports compiled', '%', '50', '2026-06-30', 50.00),
-- B2: Digitalization
(4, 'Core services identified and prioritized for BPR', '%', '10', '2025-09-30', 10.00),
(4, 'Core services re-engineered end-to-end', '%', '35', '2026-03-31', 35.00),
(4, 'Re-engineered processes digitalized', '%', '35', '2026-06-30', 35.00),
(4, 'Services on-boarded onto e-Citizen platform', '%', '20', '2026-06-30', 20.00),
-- B3: Public Complaints
(5, 'Resolution of all complaints received', '%', '70', '2026-06-30', 70.00),
(5, 'Access to information requests processed', '%', '30', '2026-06-30', 30.00),
-- C21_1: Civil Litigation
(6, '2,000 cases filed against Government concluded', '%', '50', '2026-06-30', 50.00),
(6, 'Pleadings filed within 7 days upon allocation and receipt of instructions', '%', '20', '2026-06-30', 20.00),
(6, 'Client Ministries advised on case status within 7 days', '%', '15', '2026-06-30', 15.00),
(6, 'Sensitization workshop for client Ministries conducted', '%', '15', '2026-06-30', 15.00),
-- C21_2: Constitution Implementation
(7, 'Civic education on Constitution in 8 Counties conducted', '%', '30', '2026-06-30', 30.00),
(7, '10 Bills to harmonize legislation with Constitution drafted', '%', '30', '2026-06-30', 30.00),
(7, '10 other prioritized Bills drafted', '%', '40', '2026-06-30', 40.00),
-- C21_3: Anti-Corruption Framework
(8, 'Whistle-Blower Protection Bill 2025 developed', '%', '15', '2026-06-30', 15.00),
(8, 'Anti-Corruption Laws (Amendment) Bill 2025 developed', '%', '15', '2026-06-30', 15.00),
(8, 'NEAP Sessional Paper No. 2 of 2018 reviewed', '%', '20', '2026-06-30', 20.00),
(8, 'NEAP implementation monitored and evaluated', '%', '15', '2026-06-30', 15.00),
(8, 'OAG internal Whistleblower Protection Policy developed', '%', '15', '2026-06-30', 15.00),
(8, 'State counsel and public officers sensitized on ethics and anti-corruption', '%', '10', '2026-06-30', 10.00),
(8, 'Multi-Agency Anti-Corruption Team operationalized', '%', '10', '2026-06-30', 10.00),
-- C21_4: Government Transactions
(9, 'Procurement contracts vetted within 20 working days', '%', '30', '2026-06-30', 30.00),
(9, 'Commercial agreements legal advice within 20 working days', '%', '30', '2026-06-30', 30.00),
(9, 'Two sensitization workshops for MDACs undertaken', '%', '10', '2026-06-30', 10.00),
(9, 'Bilateral/multilateral agreements negotiated within 20 working days', '%', '30', '2026-06-30', 30.00),
-- C21_5: Legal Advisory
(10, 'Legal opinions to MDAs and Counties within 7 days', '%', '40', '2026-06-30', 40.00),
(10, 'National Pupillage Placement Programme Policy developed', '%', '20', '2026-06-30', 20.00),
(10, '60 State Counsel trained on emerging areas of law', '%', '20', '2026-06-30', 20.00),
(10, 'Legal Audit Guidelines developed', '%', '20', '2026-06-30', 20.00),
-- C21_6: Legal Aid
(11, 'Legal aid provided to 80,000 vulnerable citizens in all counties', '%', '50', '2026-06-30', 50.00),
(11, 'Legal aid awareness in 16 counties undertaken', '%', '30', '2026-06-30', 30.00),
(11, 'Two legal counsel inducted and deployed per county', '%', '10', '2026-06-30', 10.00),
(11, 'Legal aid services in 12 additional counties decentralized', '%', '10', '2026-06-30', 10.00),
-- C21_9: Human Rights
(14, 'National Policy on Human Rights revised', '%', '25', '2026-06-30', 25.00),
(14, 'Kenya ICESCR report defended before Committee', '%', '25', '2026-06-30', 25.00),
(14, '4th periodic state report on UN Convention against Torture submitted', '%', '25', '2026-06-30', 25.00),
(14, '14th periodic report on African Charter on Human and Peoples Rights submitted', '%', '25', '2026-06-30', 25.00),
-- C21_16: Revenue Collection
(20, 'Societies, Marriages and College of Arms registered', 'Kshs.', '120000000', '2026-06-30', 64.86),
(20, 'Trusts and estates finalized', 'Kshs.', '65000000', '2026-06-30', 35.14),
-- C21_18: Registration Services
(22, 'Registrar Certificate issued within 3 days (reduced from 5)', '%', '20', '2026-06-30', 20.00),
(22, '23 marriage offices inspected for Marriage Act compliance', '%', '15', '2026-06-30', 15.00),
(22, '1,500 societies registered', '%', '15', '2026-06-30', 15.00),
(22, 'Stakeholder sensitization in 10 Counties on societies registration', '%', '10', '2026-06-30', 10.00),
(22, 'Societies office bearers change reduced from 3 days to 1 day', '%', '10', '2026-06-30', 10.00),
(22, 'Adoption certificate reduced from 7 to 5 days', '%', '15', '2026-06-30', 15.00),
(22, 'Arms registration sensitization in 15 Counties', '%', '15', '2026-06-30', 15.00),
-- C21_20: Legal Profession Discipline
(24, 'ADR sessions in 4 Counties (Mombasa, Kilifi, Meru, Nakuru)', '%', '20', '2026-06-30', 20.00),
(24, '3 days to file charges after investigation completion sustained', '%', '30', '2026-06-30', 30.00),
(24, 'Public sensitization in 4 Counties + 3 virtual sessions', '%', '20', '2026-06-30', 20.00),
(24, '5 guest lectures on ethics at Law Schools', '%', '30', '2026-06-30', 30.00),
-- C21_25: Decentralization
(29, 'OAG services decentralized to remaining 14 Counties', '%', '50', '2026-06-30', 50.00),
(29, 'Strategic Communication Framework on OAG & DOJ services finalized', '%', '50', '2026-06-30', 50.00),
-- D1: Presidential Directives
(30, 'Grow minimum 40,000 trees + stakeholder mobilization', '%', '100', '2026-06-30', 70.00),
(30, 'Anti-Bribery corruption mitigation plan developed and implemented', '%', '100', '2026-06-30', 30.00),
-- E1: Procurement Opportunities
(31, 'SLO - 30% of procurement to youth/women/PWD', 'Kshs.', '104904350.70', '2026-06-30', 61.43),
(31, 'SDJHCA - 30% of procurement to youth/women/PWD', 'Kshs.', '65823808.80', '2026-06-30', 38.57),
-- F2: Youth Internships
(34, 'Pupillage placements', 'No.', '80', '2026-06-30', 27.59),
(34, 'Attachees', 'No.', '150', '2026-06-30', 51.72),
(34, 'Post-pupillage placements', 'No.', '50', '2026-06-30', 17.24),
(34, 'Internships', 'No.', '10', '2026-06-30', 3.45);
