#!/bin/sh

echo "Running migrations..."
pnpx prisma migrate deploy

echo "Starting app..."
pnpm run start:dev
