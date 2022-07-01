describe('the signup page', () => {
  /*
  beforeEach(async() => {
    
    cy.request('POST', 'http://localhost:8888/users/admin', { name: 'Jane' }).then(
      (response) => {
        // response.body is automatically serialized into JSON
        expect(response.body).to.have.property('name', 'Jane') // true
      }
    )
  })
  */
  it('user can authenticate using the signup form', () => {
    const name ="John Doe"
    const email = 'test@test.com';
    const password = 'testtest'
    const passwordConfirm = 'testtest'

    cy.visit('/login')
    cy.get('a').last().click()
    
    // Fill out the form
    cy.get('input[id=name]').type(name);
    cy.get('input[id=email]').type(email);
    cy.get('input[id=password]').type(`${password}`);
    cy.get('input[id=passwordConfirm]').type(`${passwordConfirm}`);

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
    //cy.get('.contextList .context').last().get('.contextMenu').click()
    
    //click delete icon
    //cy.get('.contextActionList .deleteContext').click()
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

  it('input name less than 6', () => {
    const name ="John"
    const email = 'test@test.com';
    const password = 'test'
    const passwordConfirm = 'test'

    cy.visit('/login')
    cy.get('a').last().click()
    
    // Fill out the form
    cy.get('input[id=name]').type(name);
    cy.get('input[id=email]').type(email);
    cy.get('input[id=password]').type(`${password}`);
    cy.get('input[id=passwordConfirm]').type(`${passwordConfirm}`);

    // Click the sign-in button
    cy.get('button[type=submit]').click();

    //login page will show 'cannot find user, please sign up'
    cy.get('.error').should('contain', '"name" length must be at least 6 characters long')
  })

  it('input password less than 6', () => {
    const name ="John Doe"
    const email = 'test@test.com';
    const password = 'test'
    const passwordConfirm = 'test'

    cy.visit('/login')
    cy.get('a').last().click()
    
    // Fill out the form
    cy.get('input[id=name]').type(name);
    cy.get('input[id=email]').type(email);
    cy.get('input[id=password]').type(`${password}`);
    cy.get('input[id=passwordConfirm]').type(`${passwordConfirm}`);

    // Click the sign-in button
    cy.get('button[type=submit]').click();

    //login page will show 'cannot find user, please sign up'
    cy.get('.error').should('contain', '"password" length must be at least 6 characters long')
  })

  it('input password do not match passwordConfirm', () => {
    const name ="John Doe"
    const email = 'test@test.com';
    const password = 'test12'
    const passwordConfirm = 'test34'

    cy.visit('/login')
    cy.get('a').last().click()
    
    // Fill out the form
    cy.get('input[id=name]').type(name);
    cy.get('input[id=email]').type(email);
    cy.get('input[id=password]').type(`${password}`);
    cy.get('input[id=passwordConfirm]').type(`${passwordConfirm}`);
    
    // Click the sign-in button
    cy.get('button[type=submit]').click();

    //login page will show 'cannot find user, please sign up'
    cy.get('.error').should('contain', 'Passwords do not match')
  })
})