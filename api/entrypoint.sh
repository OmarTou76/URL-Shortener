#!/bin/sh

echo "Generating Prisma client..."
pnpx prisma generate

echo "Running migrations..."
pnpx prisma migrate deploy

echo "Starting app..."
pnpm run start:dev
