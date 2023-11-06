/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */

describe('Blog app', function() {
    beforeEach(function() {
    //   cy.visit('')
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      const user = {
        name:'testing',
        username:'test',
        password:'123'
      }
      cy.request('POST', 'http://localhost:3003/api/users', user)
      .then(({ body }) => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
      })
      cy.visit('')
    })
  
    it('Login form is shown', function() {
        cy.get('#login-form')
    })
    describe('Login',function() {
        it('succeeds with correct credentials', function() {
          cy.get('#login-form').get('[placeholder=username]').type('test')
          cy.get('#login-form').get('[placeholder=password]').type('123')
          cy.get('#login-form').find('button').click('')
        })
    
        it('fails with wrong credentials', function() {
            cy.get('#login-form').get('[placeholder=username]').type('test')
            cy.get('#login-form').get('[placeholder=password]').type('1234')
            cy.get('#login-form').find('button').click()
            cy.contains('Wrong credentials')
        })
      })
      describe('When logged in', function() {
        beforeEach(function() {
          cy.login({ username:'test', password:'123' })
          cy.visit('')
          cy.get('#login-form').get('[placeholder=username]').type('test')
          cy.get('#login-form').get('[placeholder=password]').type('123')
          cy.get('#login-form').find('button').click()
        })
    
        it('A blog can be created', function() {
          cy.createBlog({ title: 'new blog created from cypress', url:'http://localhost:3000' })

        })
        it('user can give like', function(){
            cy.createBlog({ title: 'new blog created from cypress2', url:'http://localhost:3000' })
            cy.visit('')
            cy.contains('new blog created from cypress2').contains('view').click()
            cy.get('.togglableContent').contains('like').parent().find('button').click()
        })
        it('user can delete his blog', function(){
            cy.createBlog({ title: 'blog to delete', url:'http://localhost:3000' })
            cy.visit('')
            cy.contains('blog to delete').contains('view').click()
            cy.contains('blog to delete')
            .get('.togglableContent')
            .contains('remove').click()
            cy.visit('')
        })
        describe('not authorizated', function(){
            it('user can´t delete other blog´s user', function(){
                cy.createBlog({ title: 'blog1', url:'http://localhost:3000' })
                cy.createBlog({ title: 'blog2', url:'http://localhost:3000' })
                cy.createBlog({ title: 'blog3', url:'http://localhost:3000' })
                cy.contains('logout').click()
                cy.createUser({ username:'test2', name:'testing2', password:'123' })
                cy.login({ username:'test2', password:'123' })
                // cy.visit('')
                cy.get('#login-form').get('[placeholder=username]').type('test2')
                cy.get('#login-form').get('[placeholder=password]').type('123')
                cy.get('#login-form').find('button').click()
                cy.contains('blog1')
                .contains('view')
                .click()
                .get('.togglableContent')
                .contains('remove').click()
            })

            
        })
      })
  })