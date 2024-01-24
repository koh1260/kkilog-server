#!/bin/sh

npx prisma migrate deploy --schema /usr/app/dist/prisma/schema.prisma
node dist/src/main