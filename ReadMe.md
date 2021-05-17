# Trotter

Trotter does abstraction on creation of NFT tokens on multiple EVM-based blockchain networks.

## Prepare & run

> mkdir -p mongodb/database

> docker-compose up -d

## Testing it out

Find what is local IP of the trotter docker container:

> docker inspect trotter | grep "IPAddress"

Open your favorite browser and open this IP:

> \$DOCKER_IP_ADDRESS:3000/api

Play!

## Configuration

Configuration is done via environment variables.

### database

You can use Mongo DB (local via docker) or cloud firestore https://cloud.google.com/firestore

#### mongo (default)

> MONGODB_URL=

#### firestore (process.env.DB_DIALECT=firestore)

> Create a google project
> Create a service account with cloudd atastore admin rights
> Enable Firestore API
> set process.env.GOOGLE_PROJECT_ID
> set path of your mounted service account credentials through process.env.GOOGLE_APPLICATION_CREDENTIALS (https://cloud.google.com/docs/authentication/production#passing_variable)

### RPC endpoints

> API_MATIC_TESTNET="https://rpc-mumbai.maticvigil.com/"

> API_MATIC_MAINNET="https://rpc-mainnet.maticvigil.com/"

> API_ETH_TESTNET="https://rinkeby.infura.io/v3/"

> API_ETH_MAINNET="https://mainnet.infura.io/v3/f3f30b367c6c45c093d0a7c7bd7709fa"

> API_BSC_TESTNET="https://data-seed-prebsc-1-s1.binance.org:8545"

### private key seed (for admin account)

> WALLET="input engage salon smooth choose buffalo priority february advice crop visit stand"

### prod | develop

TROTTER_NODE_ENV=develop
