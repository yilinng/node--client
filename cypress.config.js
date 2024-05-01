const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/output.xml',
  },
  env: {
    apiUrl: "http://192.168.99.100:3001",
    token: "",
    reToken: ""
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: process.env.REACT_APP_NOT_SECRET_CODE,
    specPattern: "cypress/**/*.spec.{js,jsx,ts,tsx}",
  },
});
