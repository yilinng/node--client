
describe('the login page', () => {
  
  before(() => {
    cy.signup()
    cy.logout()
  })
  
  it('user can authenticate using the login form', () => {
   
    const email = 'test123@test.com';
    const password = 'test123'
    cy.visit('/login')

      
    // Fill out the form
    cy.get('input[id=email]').type(email);
    cy.get('input[id=password]').type(`${password}`);

    // Click the sign-in button
    cy.get('button[type=submit]').click();
    
    //Dashborad should have Profile
    cy.get('h2').should('contain', 'Profile')

    //visit todos and click sidebutton open sidebarTodo   
    cy.get('a').eq(1).click()

  
    // Click the sideBtn open sidebarTodo
    cy.get('.sideBtn').click();

    // Click the+ Add a page button
    cy.get('button[type=button]').click();

    // Click the last item from sidebarTodo
    cy.get('.sideBarTodo .list div.li').last().click();

    const title = "cypress test"
    const context2 = "テレビ東京系アニメ「NARUTO-ナルト- 疾風伝」新オープニングテーマ「紅蓮」収録、前作より約2年3ヵ月ぶり初のセルフタイトルとなる6th Album「DOES」を8月6日にリリース！記念に映像作"


    // Click the sideBtn close sidebarTodo
    cy.get('.sideBtn').click();

     // Fill out the todo form
    cy.get('textarea[name=title]').type(title);

    cy.get('.contextList .context .contextText textarea[name=context]').first().type('{enter}', {force: true});

    cy.get('.contextList .context .contextText textarea[name=context]').first().type(`${context2} {enter}`, {force: true});


    //click contextMenu and show contextActionList
    cy.get('.contextList .context .contextMenu').last().click()
    
    //click delete icon
    cy.get('.contextActionList .deleteContext').click()
    // Click updateBtn to update
    cy.get('.updateBtn').click();

    // Click the sideBtn open sidebarTodo
    cy.get('.sideBtn').click();

    //click the sidebar minMenu 
    //cy.get('.sideBarTodo .list div.li').last().get('.minMenu').click();

    //click delete button
    //cy.get('.action .deleteAction').click();
    
    // cleck cancel back to Dashboard
    cy.get('a').click()
    
    // Click logout
    cy.get('.logout').click();
  })

  it('input invalid email', () => {
    const email = 'test@test.com';
    const password = 'test123'

    cy.visit('/login')
    
    // Fill out the form
    cy.get('input[id=email]').type(email);
    cy.get('input[id=password]').type(`${password}`);
    
    // Click the sign-in button
    cy.get('button[type=submit]').click();

    //login page will show 'cannot find user, please sign up'
    cy.get('.error').should('contain', 'cannot find user, please sign up')
  })
})