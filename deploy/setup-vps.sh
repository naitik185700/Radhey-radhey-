#!/bin/bash
set -e

DOMAIN="rr.guardianslegalsolutions.com"
IP="187.127.188.22"

echo "=== RADHEY RADHEY GIRLS POINT - VPS DEPLOYMENT ==="
echo "Target Domain: $DOMAIN"
echo "Target Server IP: $IP"

# 1. Update OS Packages
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl git ufw nginx certbot python3-certbot-nginx

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
    git fetch origin main
    git reset --hard origin/main
fi

cd $APP_DIR

# 5. Environment configuration (create .env for Prisma and Next.js)
echo "Generating .env configuration..."
cat << 'EOF' > .env
DATABASE_URL="file:./dev.db"
JWT_SECRET="radhey_radhey_girls_point_secure_jwt_token_auth_secret_key_2026"
NEXTAUTH_SECRET="radhey_radhey_girls_point_auth_secret_key_2026"
NEXTAUTH_URL="https://rr.guardianslegalsolutions.com"
NEXT_PUBLIC_APP_URL="https://rr.guardianslegalsolutions.com"
NEXT_PUBLIC_STORE_NAME="Radhey Radhey Girls Point"
NEXT_PUBLIC_STORE_TAGLINE="Trendy • Ethnic • Daily Wear | Suits | Co-ords | Palazzo | Kurtis"
NEXT_PUBLIC_CURRENCY_SYMBOL="₹"
NEXT_PUBLIC_WHATSAPP_NUMBER="918950729243"
NODE_ENV="production"
PORT=3000
EOF

cp .env .env.production
cp .env .env.local
export DATABASE_URL="file:./dev.db"

# 6. Install dependencies and build Next.js
echo "Installing npm dependencies..."
npm ci

echo "Setting up Prisma database..."
npx prisma generate
npx prisma db push --accept-data-loss
node prisma/seed.js || true
node prisma/update-campaign.js || true
node prisma/update-address.js || true

echo "Building Next.js production build..."
npm run build

# 7. Setup PM2 Daemon
echo "Starting app via PM2..."
pm2 delete radhey-radhey || true
pm2 start npm --name "radhey-radhey" -- start -- -p 3000
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME || true

# 8. Configure Nginx Reverse Proxy for Domain
echo "Configuring Nginx for $DOMAIN and $IP..."
sudo tee /etc/nginx/sites-available/radhey-radhey > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN $IP;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/radhey-radhey /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# 9. Configure UFW Firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# 10. Automatically obtain Let's Encrypt SSL
echo "Attempting SSL Certificate generation for $DOMAIN..."
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m contact@guardianslegalsolutions.com --redirect || echo "SSL step completed. You can re-run 'sudo certbot --nginx -d $DOMAIN' if needed."

echo ""
echo "=========================================================="
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "Website URL:     https://$DOMAIN"
echo "Direct Server:   http://$IP"
echo "Admin Dashboard: https://$DOMAIN/admin"
echo "=========================================================="
