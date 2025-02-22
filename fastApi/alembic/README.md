Generic single-database configuration.

Run these in `fastApi/`

# Generate a New Migration:

`alembic revision --autogenerate -m "Your migration message"`

# Apply Migrations in Online Mode:

This command connects to your database and runs all pending migrations immediately.

`alembic upgrade head`

# Generate SQL Script in Offline Mode:

This command generates the SQL statements for all pending migrations without connecting to your database. You can redirect the output to a file for review or manual execution.

`alembic upgrade head --sql > migration.sql`

# Downgrade (Undo the Last Migration):

To roll back the last migration (online mode):

`alembic downgrade -1`
