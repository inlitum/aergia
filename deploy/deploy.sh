echo "Closing existing aergia instances"
pm2 stop aergia
echo "Clearing previous git clone"
rm -r current
echo "Cloning git repo"
git clone https://github.com/inlitum/aergia.git current
cd current
echo "Installing npm dependencies"
npm i
echo "Building Aergia"
node ace build --prod
cd build
echo "Installing production dependencies"
npm ci --production
echo "Copying env file"
cp ../../.env ./.env
echo "Starting Aergia"
pm2 start server.js --name aergia
