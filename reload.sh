# Clear existing instances of aergia from pm2.
echo "+========== Stopping existing aergia instances ==========+"
pm2 stop aergia

# Pull latest changes.
echo "+========== Pulling latest changes ==========+"
git pull

if [ ! -d "node_modules" ]; then
echo "+========== Getting latest node packages ==========+"
    npm i
fi

# Build latest changes.
echo "+========== Building application ==========+"
node ace build --production

# Copy env file.
echo "+========== Copying environment variables ==========+"
cp .env build/'.env'

# Install node packages
echo "+========== Installing production packages ==========+"
cd build
npm ci --production

# Run pm2 instance
echo "+========== Starting aergia instances ==========+"
pm2 start server.js -i 5 --name aergia
