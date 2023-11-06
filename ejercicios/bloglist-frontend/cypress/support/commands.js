/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */

Cypress.Commands.add('login', ({ username, password }) => {
    cy.request('POST', 'http://localhost:3003/api/login', { username, password })
    .then(({ body }) => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
        // cy.visit('')
    })
})

Cypress.Commands.add('createBlog', ({ title, url }) => {
    cy.request({
        url:'http://localhost:3003/api/blogs',
        method:'POST',
        body:{
            title,
            url
        },
        headers:{ 'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}` }
    }).then(() => cy.visit(''))

})

Cypress.Commands.add('createUser',({ username, name, password }) => {
    cy.request(
        'POST', 
        'http://localhost:3003/api/users', 
        {
            username, 
            name, 
            password
        }).then(({ body }) => {
                    localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
                })
})