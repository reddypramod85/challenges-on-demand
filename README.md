# HPEDEV Hack Shack Workshops On Demand

This is a HPE-Developer-Community Hack Shack Workshops on Demand registration portal application.

To run this application, follow the steps below:

## Prerequisites
You need to have node.js and a package manager; both npm (npm is installed with node.js) and yarn package manager.

- [Node Download Page](https://nodejs.org/en/download/) - The latest LTS version will have node.js, npm, and npx.   
- [Yarn Package Manager](https://yarnpkg.com/en/docs/getting-started) - Required.  

  1. Install NPM modules

    ```
    $ npm install or yarn install
    $ npm run dev
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

    - Client:
    - create a .env file using .env_example file
    ```
      $ cd client
      REACT_APP_API_ENDPOINT='http//localhost:port'// URL of backend server
    ```

  2. Concurrently install and run client and server:

    ```
    $ npm run dev
    ```
  3. You can run both front end and backend server seperately

    - Front end
    ```
    $ cd client
    $ yarn install
    $ yarn start

    ```
    - Backend
    ```
    $ cd server
    $ yarn install
    $ yarn start

    ```

  4. Run the PostgreSQL database using docker-compose

    ```
    $ cd server
    $ docker-compose up
    ```
  5. Seed the database

    ```
    $ cd server
    $ npm run seed-data
    ```
  6. Reset the database

    ```
    $ cd server
    $ npm run reset-data
    ```
  