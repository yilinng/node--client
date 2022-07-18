describe('user api testing', () => {

  it('user login - POST', () => {
    cy.login()
  })

  it('user logout - DELETE', () => {
    cy.logout()
  })
});