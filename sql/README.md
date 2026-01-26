# SQL Scripts Directory

This directory contains all SQL scripts organized by category.

## Directory Structure

### `schemas/`
Database schema creation scripts, table definitions, and RLS (Row Level Security) policies.
- Schema creation scripts (CREATE_*, create_*_schema.sql)
- Table creation scripts (create_*_tables.sql)
- RLS policy definitions
- Database setup scripts

### `surveys/`
Survey-related SQL scripts and individual survey data files.
- Survey schema definitions
- Individual survey data files (*_survey.sql)
- Survey table creation scripts

### `users/`
User account and profile management scripts.
- User creation scripts (create_*_users.sql)
- User profile setup
- User role assignments

### `fixes/`
Database repair, diagnostic, and fix scripts.
- Authentication fixes
- Database repair scripts
- Diagnostic queries
- Cleanup scripts

### `data/`
Data management, upload, and verification scripts.
- Data upload scripts
- Data verification/check scripts
- Data deletion scripts
- Migration templates

## Note
The `supabase/migrations/` directory contains official Supabase migration files and should not be modified manually.
