#!/bin/bash

docker-compose down
ip=$(hostname -I | awk '{print $1}')
echo "nginx sendo configurado com o ip $ip";
sed "s/server [0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+:/server $ip:/" -i ../docker/nginx/nginx.conf
docker-compose up -d
