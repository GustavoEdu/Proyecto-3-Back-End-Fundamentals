# Proyecto-3-Back-End-Fundamentals
Chat App with NodeJS, Express and MySQL.

### Getting Started
First, install all the dependencies of the project:

```
npm install
```

Fill the details in a .env file taking into consideration .env.example template.

Run the sequelize-cli:

```
npx sequelize-cli init
```

Edit the /src/config/config.json file with the database details (Same as .env).

Make all the migrations that are pending with:

```bash
npx sequelize-cli db:migrate
# or activate the sync option
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:4000 with the browser to see the result.

You can start editing the page by modifying any file in the src folder.

### Learn More
To learn more about the technologies that the project covers, take a look at the documentation resources:

* [Express](https://expressjs.com/es/).
* [Sequelize](https://sequelize.org/docs/v6/).