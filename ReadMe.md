## Trotter

Trotter does abstraction on creation of NFT tokens on multiple EVM-based blockchain networks.

# Prepare & run

> mkdir -p mongodb/databae

> docker-compose up -d

# Testing it out

Find what is local IP of the trotter docker container:

> docker inspect trotter | grep "IPAddress"

Open your favorite browser and open this IP:

> $DOCKER_IP_ADDRESS:3000/api

Play!