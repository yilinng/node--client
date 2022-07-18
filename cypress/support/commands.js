// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("signup", () => {
  cy.request({
    method: 'POST',
    form: true,
    url: Cypress.env("apiUrl") + "/api/users/signup",
    headers: {
      'Content-Type': 'application/json'  
    },
    body: { 
      "name": "test from cypress",
      "email": "test123@test.com", 
      "password": "test123"
     }
  })
  .as('signupResponse')
  .then(response => {
    Cypress.env('token', response.body.accessToken); // either this or some global var but remember that this will only work in one test case
    Cypress.env('retoken', response.body.refreshToken); // either this or some global var but remember that this will only work in one test case
    console.log(response)
    return response;
  })
  .its('status')
  .should('eq', 201);

})

Cypress.Commands.add("login", () => {
  cy.request({
    method: 'POST',
    form: true,
    url: Cypress.env("apiUrl") + "/api/users/login",
    headers: {
      'Content-Type': 'application/json'  
    },
    body: { 
      "email": "test123@test.com", 
      "password": "test123"
     }
  })
  .as('signupResponse')
  .then(response => {
    Cypress.env('token', response.body.accessToken); // either this or some global var but remember that this will only work in one test case
    Cypress.env('retoken', response.body.refreshToken); // either this or some global var but remember that this will only work in one test case
    console.log(response)
    return response;
  })
  .its('status')
  .should('eq', 201);

})

Cypress.Commands.add("logout", () => {
  cy.request({
    method: 'DELETE',
    form: true,
    url: Cypress.env("apiUrl") + "/api/users/logout",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + Cypress.env("token")  
    },
    body: { email: 'test123@test.com' }
  })
  .as('logoutResponse')
  .then(response => {
    //Cypress.env('token', ''); // either this or some global var but remember that this will only work in one test case
    //Cypress.env('retoken', ''); // either this or some global var but remember that this will only work in one test case
    return response;
  })
  .its('status')
  .should('eq', 204);

})