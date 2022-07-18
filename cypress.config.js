const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/output.xml',
  },
  env: {
    apiUrl: "https://express-api-react-notion.vercel.app",
    token: "",
    reToken: ""
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: process.env.REACT_APP_NOT_SECRET_CODE,
    specPattern: "cypress/**/*.spec.{js,jsx,ts,tsx}",
  }
});
