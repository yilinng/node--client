describe('My First Test', () => {
  beforeEach(() => {
    
    cy.request('https://jsonplaceholder.cypress.io/comments').as('comments')

      cy.get('@comments').should((response) => {
        expect(response.body).to.have.length(500)
        expect(response).to.have.property('headers')
        expect(response).to.have.property('duration')
        
    })
  })
  it('Gets, types and asserts', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()

    // Should be on a new URL which
    // includes '/commands/actions'
    cy.url().should('include', '/commands/actions')

    // Get an input, type into it and verify
    // that the value has been updated
  
  })
})