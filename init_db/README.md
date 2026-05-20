Put your MySQL initialization files here.

Supported by the official MySQL image on first container startup:
- `*.sql`
- `*.sql.gz`
- `*.sh`

Example:
- `init_db/01-schema.sql`
- `init_db/02-seed.sql`

These files run only when the `mysql_data` volume is empty.
