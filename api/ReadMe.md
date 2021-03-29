NodeJS (Express) Boiler Plate   

The project structure was created using following commands (some modifications were made after)   
   
ExpressJs application generator   
```
npx express-generator
```   
   
Sequelize cli init
```
npx sequelize-cli init
```   
   
Creating models, migrations we're using sequelize here so creating a models and/or migrations can be done using the sequelize-cli command for example:
```
npx sequelize-cli model:generate --name user --attributes id:string,firstName:string,lastName:string,email:string
```   
   
Run migrations, make sure to have set you environment variables from the env.example to a new .env file   
```
npx sequelize db:migrate
```   
   
