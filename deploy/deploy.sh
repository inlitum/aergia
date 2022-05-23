#!/bin/bash
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
npm ci --omit=dev

echo "=+=+=+=+=+=+=+= Copying env file =+=+=+=+=+=+=+="
cp ../../.env ./.env

echo "=+=+=+=+=+=+=+= Migrating database =+=+=+=+=+=+=+="
if [ "$1" = "db" ]; then
  node ace migration:run
  node ace db:seed
else
    echo "Strings are not equal."
fi

echo "=+=+=+=+=+=+=+= Starting Aergia =+=+=+=+=+=+=+="
pm2 start server.js --name aergia

pm2 l
