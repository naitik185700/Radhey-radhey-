#!/bin/bash
set -e

echo "=== RADHEY RADHEY GIRLS POINT - AUTOMATED VPS DEPLOYMENT ==="
echo "Target VPS: 187.127.188.22"

# 1. Update OS Packages
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl git ufw nginx

# 2. Install Node.js 20 LTS
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3. Install PM2 process manager
sudo npm install -g pm2

# 4. Clone or pull repository
APP_DIR="/var/www/radhey-radhey"
if [ ! -d "$APP_DIR" ]; then
    echo "Cloning repository..."
    sudo mkdir -p /var/www
    sudo git clone https://github.com/naitik185700/Radhey-radhey-.git $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR
else
    echo "Updating existing repository..."
    cd $APP_DIR
    git pull origin main
fi

cd $APP_DIR

# 5. Install dependencies and build Next.js
echo "Installing npm dependencies..."
npm ci

echo "Setting up Prisma database..."
npx prisma generate
npx prisma db push
node prisma/seed.js || true
node prisma/update-campaign.js || true
node prisma/update-address.js || true

echo "Building Next.js production build..."
npm run build

# 6. Setup PM2 Daemon
echo "Starting app via PM2..."
pm2 delete radhey-radhey || true
pm2 start npm --name "radhey-radhey" -- start -- -p 3000
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME || true

# 7. Configure Nginx Reverse Proxy
echo "Configuring Nginx on port 80..."
sudo tee /etc/nginx/sites-available/radhey-radhey > /dev/null << 'EOF'
server {
    listen 80;
    server_name 187.127.188.22;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/radhey-radhey /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# 8. Configure UFW Firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "=== DEPLOYMENT COMPLETE! ==="
echo "Access your live store at: http://187.127.188.22"
echo "Admin Dashboard: http://187.127.188.22/admin"
