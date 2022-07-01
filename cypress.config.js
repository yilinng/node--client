const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    apiUrl: "http://localhost:3001",
    token: "",
    reToken: ""
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000/',
    specPattern: "cypress/**/*.spec.{js,jsx,ts,tsx}",
  },
});
