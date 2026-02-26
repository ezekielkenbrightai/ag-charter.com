-- OAG Kenya Digital Platform - Database Schema
-- PostgreSQL 16+

-- Drop existing tables if resetting
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS pc_sub_indicators CASCADE;
DROP TABLE IF EXISTS pc_indicators CASCADE;
DROP TABLE IF EXISTS pc_categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS access_tiers CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

-- ============================================
-- ACCESS TIERS (from AG Outline - 7 levels)
-- ============================================
CREATE TABLE access_tiers (
    id SERIAL PRIMARY KEY,
    level INTEGER UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- ============================================
-- DEPARTMENTS (3-tier org structure)
-- ============================================
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    short_name VARCHAR(100),
    tier VARCHAR(60) NOT NULL,
    type VARCHAR(50) DEFAULT 'department',
    parent_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    head_title VARCHAR(200),
    color VARCHAR(7),
    sort_order INTEGER DEFAULT 0
);

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    staff_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(200) UNIQUE,
    password_hash VARCHAR(200) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    title VARCHAR(200),
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    tier_level INTEGER NOT NULL REFERENCES access_tiers(level),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_staff_id ON users(staff_id);
CREATE INDEX idx_users_tier ON users(tier_level);
CREATE INDEX idx_users_dept ON users(department_id);

-- ============================================
-- SESSIONS (for connect-pg-simple)
-- ============================================
CREATE TABLE sessions (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);
CREATE INDEX idx_sessions_expire ON sessions(expire);

-- ============================================
-- PERFORMANCE CONTRACT
-- ============================================
CREATE TABLE pc_categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(5) NOT NULL,
    name VARCHAR(200) NOT NULL,
    weight NUMERIC(5,2) NOT NULL,
    fiscal_year VARCHAR(20) DEFAULT 'FY 2025/26'
);

CREATE TABLE pc_indicators (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES pc_categories(id) ON DELETE CASCADE,
    indicator_code VARCHAR(20) NOT NULL,
    name VARCHAR(500) NOT NULL,
    unit_of_measure VARCHAR(50),
    target_value VARCHAR(200),
    actual_value VARCHAR(200),
    weight NUMERIC(5,2),
    deadline DATE,
    status VARCHAR(50) DEFAULT 'pending'
);

CREATE TABLE pc_sub_indicators (
    id SERIAL PRIMARY KEY,
    indicator_id INTEGER NOT NULL REFERENCES pc_indicators(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    unit_of_measure VARCHAR(50),
    target_value VARCHAR(200),
    actual_value VARCHAR(200),
    completion_date DATE,
    weight_pct NUMERIC(5,2)
);

-- ============================================
-- AUDIT LOG
-- ============================================
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_created ON audit_log(created_at);
