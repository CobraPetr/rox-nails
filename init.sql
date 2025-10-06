-- Database initialization script for Rox Nails application
-- This script sets up the initial database configuration

-- Create database if it doesn't exist (handled by Docker)
-- CREATE DATABASE IF NOT EXISTS rox_nails_prod;

-- Set timezone
SET timezone = 'UTC';

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set up proper permissions
GRANT ALL PRIVILEGES ON DATABASE rox_nails_prod TO postgres;

-- Create a backup user (optional)
-- CREATE USER rox_nails_backup WITH PASSWORD 'backup_password';
-- GRANT CONNECT ON DATABASE rox_nails_prod TO rox_nails_backup;
-- GRANT USAGE ON SCHEMA public TO rox_nails_backup;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO rox_nails_backup;

-- Log initialization
INSERT INTO pg_stat_statements_info (dealloc) VALUES (0) ON CONFLICT DO NOTHING;
