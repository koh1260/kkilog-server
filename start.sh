#!/bin/sh

npx prisma generate --schema /usr/app/dist/prisma/schema.prisma
node dist/src/main