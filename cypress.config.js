require('dotenv-extended').load()

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/output.xml',
  },
  env: {
    // HINT: here we read these keys from .env file
    //, feel free to remove the items that you don't need
    baseUrl: process.env.CYPRESS_BASE_URL,
    apiUrl: process.env.REACT_APP_NOT_SECRET_CODE,
    token: "",
    reToken: ""
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/**/*.spec.{js,jsx,ts,tsx}",
  }
});
