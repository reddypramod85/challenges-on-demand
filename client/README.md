# HPEDEV Hack Shack Workshops On Demand

This is a HPE-Developer-Community Hack Shack Workshops on Demand registration portal application.

To run the client/front end application, follow the steps below:

## Prerequisites
You need to have node.js and a package manager; both npm (npm is installed with node.js) and yarn package manager.

- [Node Download Page](https://nodejs.org/en/download/) - The latest LTS version will have node.js, npm, and npx.   
- [Yarn Package Manager](https://yarnpkg.com/en/docs/getting-started) - Required.  

  1. Install NPM modules

    ```
    $ yarn install
    ```

  2. Configure environment 

    - Client:
    - create a .env file using .env_example file
    ```
      $ cd client
      REACT_APP_API_ENDPOINT='http//localhost:port'// URL of backend server
    ```

  2. run the front end app:

    ```
    $ npm start
    ```
  