#!/bin/bash

# MDI AI Detection Database Setup Script

# Configuration variables - update these with your specific details
DB_NAME="mdi_ai_detection"
DB_USER="mdi_admin"
DB_PASSWORD="secure_password_here"
DB_HOST="localhost"
DB_PORT="5432"

# Display script header
echo "===================================================="
echo "MDI AI Detection System - Database Setup"
echo "===================================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install PostgreSQL first."
    echo "Visit https://www.postgresql.org/download/ for installation instructions."
    exit 1
fi

echo "PostgreSQL is installed. Proceeding with database setup..."
echo ""

# Create database user if it doesn't exist
echo "Creating database user '$DB_USER' if it doesn't exist..."
sudo -u postgres psql -c "DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
    CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';
  END IF;
END
\$\$;"

# Create database if it doesn't exist
echo "Creating database '$DB_NAME' if it doesn't exist..."
sudo -u postgres psql -c "SELECT 'CREATE DATABASE $DB_NAME' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec"

# Grant privileges to the user
echo "Granting privileges to user '$DB_USER'..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -c "ALTER USER $DB_USER WITH SUPERUSER;"

# Run schema.sql to create tables and load sample data
echo "Creating tables and loading sample data..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f schema.sql

# Check if the setup was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "===================================================="
    echo "Database setup completed successfully!"
    echo "===================================================="
    echo ""
    echo "Database Name: $DB_NAME"
    echo "Username: $DB_USER"
    echo "Password: $DB_PASSWORD"
    echo "Host: $DB_HOST"
    echo "Port: $DB_PORT"
    echo ""
    echo "You can connect to the database using the command:"
    echo "psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
    echo ""
    echo "To test the connection, run:"
    echo "PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c 'SELECT COUNT(*) FROM cameras;'"
    echo ""
else
    echo "An error occurred during the database setup. Please check the error messages above."
    exit 1
fi 