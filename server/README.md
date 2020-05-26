# HPEDEV Hack Shack Workshops On Demand
### Getting Started
This is a HPE-Developer-Community Hack Shack Workshops on Demand registration portal application.

To run the backend server API, follow the steps below:

## Prerequisites
You need to have node.js and a package manager; both npm (npm is installed with node.js) and yarn package manager.

- [Node Download Page](https://nodejs.org/en/download/) - The latest LTS version will have node.js, npm, and npx.   
- [Yarn Package Manager](https://yarnpkg.com/en/docs/getting-started) - Required.  

  1. Install NPM modules

    ```
    $ npm install or yarn install
    ```

  2. Configure environment 

    - Server:
    - create a .env file using .env_example file
    ```
      $ cd server

      FROM_EMAIL_ADDRESS='' //email address to send email to registered customers
      SENDGRID_API_KEY="" //sendgrid api key to send emails
      PORT=               // run the backed server at port
      DB_PW=              // postgreSQL db password - you can set as you wish
      WORKSHOP_DURATION=  // you can ignore
      JUPYTER_EMAIL=''    // email of JupyterHub server to prepare notebooks
      FEEDBACK_URL=       // survey link
      PRODUCTION_API_SERVER=''  // swagger documentation
    ```

  2. Run the backend server:

    ```
    $ npm start
    ```

  3. Run the PostgreSQL database using docker-compose

    ```
    $ cd server
    $ docker-compose up
    ```
  4. Seed the database

    ```
    $ cd server
    $ npm run seed-data
    ```
  5. Reset the database

    ```
    $ cd server
    $ npm run reset-data
    ```
  