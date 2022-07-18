describe('user api testing', () => {

  it('user signup - POST', () => {
    cy.signup()
  })

  it('user logout - DELETE', () => {
    cy.logout()
  })
});