beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/todo.html');
    var button = cy.get('button').contains('Continue');
    button ? button.click() : null;
})