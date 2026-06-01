#!/bin/bash
# Ubuntu server setup for TapHouse
# Run once on a fresh Ubuntu 22.04+ server

set -e

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2
sudo npm install -g pm2

# Clone / copy your code to /var/www/taphouse
sudo mkdir -p /var/www/taphouse
sudo chown $USER:$USER /var/www/taphouse

# ---- In /var/www/taphouse: ----
# cp .env.example .env.local
# nano .env.local        # fill in Firebase credentials
# npm install
# npm run build
# pm2 start ecosystem.config.js
# pm2 save
# pm2 startup            # follow the printed command to enable auto-start

# Nginx
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/taphouse
# Replace 'yourdomain.com' in the file, then:
# sudo ln -s /etc/nginx/sites-available/taphouse /etc/nginx/sites-enabled/taphouse
# sudo nginx -t && sudo systemctl reload nginx
# sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

echo "Setup complete. Edit /var/www/taphouse/.env.local then run: npm run build && pm2 start ecosystem.config.js"
