#!/bin/sh

if [ -z "$DATABASE_URL" ]; then
    echo "Environment variable DATABASE_URL is required."
    echo "Use \`set -a; source .env; set +a\` in to expose local variables form a local \`.env\` file."
    echo "Check the environment variable via: \`echo \$DATABASE_URL\`."
    echo "Or, alternately, run it as \`DATABASE_URL=\"...\" $0\`."
    exit 1
fi

echo "Installing with DATABASE_URL=\"$DATABASE_URL\"..."

psql "$DATABASE_URL" < 00-init-scheme.sql && \
psql "$DATABASE_URL" < 01-connect-pg-simple-table.sql && \
psql "$DATABASE_URL" < 02-system-tables.sql && \
psql "$DATABASE_URL" < 03-data-tables.sql && \
echo OK
