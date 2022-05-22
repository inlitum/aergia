echo "=+=+=+=+=+=+=+= Closing existing aergia instances =+=+=+=+=+=+=+="
pm2 stop aergia

echo "=+=+=+=+=+=+=+= Clearing previous git clone =+=+=+=+=+=+=+="
rm -r current

echo "=+=+=+=+=+=+=+= Cloning git repo =+=+=+=+=+=+=+="
git clone https://github.com/inlitum/aergia.git current
cd current

echo "=+=+=+=+=+=+=+= Installing npm dependencies =+=+=+=+=+=+=+="
npm i

echo "=+=+=+=+=+=+=+= Building documentation =+=+=+=+=+=+=+="
redoc-cli build -o ./resources/views/docs.edge ./docs/aergia.yaml

echo "=+=+=+=+=+=+=+= Building Aergia =+=+=+=+=+=+=+="
node ace build --prod

echo "=+=+=+=+=+=+=+= Installing production dependencies =+=+=+=+=+=+=+="
cd build
npm ci --production

echo "=+=+=+=+=+=+=+= Copying env file =+=+=+=+=+=+=+="
cp ../../.env ./.env

echo "=+=+=+=+=+=+=+= Migrating database =+=+=+=+=+=+=+="
node ace migration:run
node ace db:seed

echo "=+=+=+=+=+=+=+= Starting Aergia =+=+=+=+=+=+=+="
pm2 start server.js --name aergia
