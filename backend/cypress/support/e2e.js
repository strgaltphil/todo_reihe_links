beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/todo.html');
})