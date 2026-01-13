#!/bin/bash

set -e

ssh_host=${1:-vinylsaigon.vn}

echo "Starting deployment..."
echo "Building the project..."
rm -rf .next/cache
npm run build

echo "Build completed. Deploying to the server..."
rsync -av .next/ ${ssh_host}:/var/www/baka-frontend/.next-build

echo "Restarting the application on the server..."
ssh ${ssh_host} /bin/bash << EOF
set -e

cd /var/www/baka-frontend

rm -rf .next-backup || true
mv .next .next-backup || true
mv .next-build .next
pm2 reload ecosystem.config.js
EOF

echo "Deployment completed successfully."


