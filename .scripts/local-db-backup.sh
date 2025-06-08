#!/bin/sh
# @changed 2025.05.05, 20:24
# Call:
# sh .scripts/django-update-db.sh
# sh .scripts/django-update-db.sh --local

scriptsPath=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")
rootPath=`dirname "$scriptsPath"`
utilsPath="$rootPath/.utils"

# Import config variables...
test -f "$utilsPath/config.sh" && . "$utilsPath/config.sh"

dbPath="$rootPath/server/prisma/.data"
dbName="data.db"
testDbName="test.db"

TIMETAG=`$DATECMD +%y%m%d-%H%M`

if [ -f "$dbPath/$dbName" ]; then
  cp -vf "$dbPath/$dbName" "$dbPath/.backup-${TIMETAG}-$dbName"
fi
if [ -f "$dbPath/$testDbName" ]; then
  cp -vf "$dbPath/$testDbName" "$dbPath/.backup-${TIMETAG}-$testDbName"
fi
