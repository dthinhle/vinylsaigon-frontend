#!/bin/bash

set -e

ssh_host=${1:-vinylsaigon.vn}

echo "Reverting deployment..."
ssh ${ssh_host} /bin/bash << EOF
set -e

cd /var/www/baka-frontend

mv .next .next-build || true
mv .next-backup .next
pm2 restart 3kshop-frontend
EOF

echo "Deployment completed successfully."


