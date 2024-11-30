describe('Todo Page', () => {
    it('should display the correct title in the header', () => {
        cy.get('h1').should('contain.text', 'Todo Liste');
    });

    it('should load the form correctly', () => {
        // Prevent form submission redirect
        cy.get('#todo-form').invoke('removeAttr', 'action');

        cy.get('#todo-form').should('exist');
        cy.get('#todo').should('have.attr', 'placeholder', 'Neue Aufgabe');
        cy.get('#due').should('have.attr', 'type', 'date');
        cy.get('#status').should('exist');
    });

    it('should add 3 ToDos and display them correctly', () => {
        // 1. Add the first ToDo: 1 day ago, status "Erledigt"
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const formattedYesterday = yesterday.toISOString().split('T')[0];
        cy.get('input[name="title"]').type('ToDo 1: 1 Day Ago');
        cy.get('input[name="due"]').type(formattedYesterday);
        cy.get('select[name="status"]').select('2');
        cy.get('form').submit();

        // 2. Add the second ToDo: Today, status "In Bearbeitung"
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];
        cy.get('input[name="title"]').type('ToDo 2: Today');
        cy.get('input[name="due"]').type(formattedToday);
        cy.get('select[name="status"]').select('1');
        cy.get('form').submit();

        // 3. Add the third ToDo: 1 day later, status "Offen"
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedTomorrow = tomorrow.toISOString().split('T')[0];
        cy.get('input[name="title"]').type('ToDo 3: 1 Day Later');
        cy.get('input[name="due"]').type(formattedTomorrow);
        cy.get('select[name="status"]').select('0');
        cy.get('form').submit();

        // Wait for the todos to appear
        cy.wait(1000);

        // 4. Verify the ToDos are listed correctly
        // First ToDo - 1 day ago, status "erledigt"
        cy.get('#todo-list')
            .contains('ToDo 1: 1 Day Ago')
            .parents('.todo')
            .within(() => {
                cy.get('.due').should('contain.text', yesterday.toLocaleDateString());
                cy.get('.status').should('contain.text', 'erledigt');
            });

        // Second ToDo - Today, status "In Bearbeitung"
        cy.get('#todo-list')
            .contains('ToDo 2: Today')
            .parents('.todo')
            .within(() => { 
                cy.get('.due').should('contain.text', today.toLocaleDateString());
                cy.get('.status').should('contain.text', 'in Bearbeitung');
            });

        // Third ToDo - 1 day later, status "Offen"
        cy.get('#todo-list')
            .contains('ToDo 3: 1 Day Later')
            .parents('.todo')
            .within(() => {
                cy.get('.due').should('contain.text', tomorrow.toLocaleDateString());
                cy.get('.status').should('contain.text', 'offen');
            });
    });

    it('should update name, due date and status of `ToDo 2`', () => {
        // 1. Find and click the "bearbeiten" button for the ToDo 2: Today
        cy.get('#todo-list')
            .contains('ToDo 2: Today')
            .parents('.todo')
            .find('.edit')
            .click();

        // 2. Change the title to "ToDo 2: 1 Day Later"
        cy.get('input[name="title"]')
            .clear()
            .type('ToDo 2: 1 Day Later');

        // 3. Change the date (1 day later)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedTomorrow = tomorrow.toISOString().split('T')[0];
        cy.get('input[name="due"]')
            .clear()
            .type(formattedTomorrow);
        
        // 5. Change the status: Select "offen" (value = 0)
        cy.get('select[name="status"]').select('0');
        
        cy.get('form').submit();

        // Wait for the changes to appear
        cy.wait(1000);

        // 4. Verify the updated ToDo is listed with the new date
        cy.get('#todo-list')
            .contains('ToDo 2: 1 Day Later')
            .parents('.todo')
            .within(() => {
                cy.get('.due').should('contain.text', tomorrow.toLocaleDateString());
                cy.get('.status').should('contain.text', 'offen');
            });
    });

    it('should update status of `ToDo 2` on clicking the button `offen`', () => {
        // Find and trigger status button
        cy.get('#todo-list')
            .contains('ToDo 2: 1 Day Later')
            .parents('.todo')
            .find('.status')
            .click();

        // Verify the new status
        cy.get('#todo-list')
            .contains('ToDo 2: 1 Day Later')
            .parents('.todo')
            .within(() => {
                cy.get('.status').should('contain.text', 'in Bearbeitung');
            });
    });

    it('should delete all 3 ToDos', () => {
        // Find and trigger delete buttons
        cy.get('#todo-list')
            .contains('ToDo 1: 1 Day Ago')
            .parents('.todo')
            .find('.delete')
            .click();

        cy.get('#todo-list')
            .contains('ToDo 2: 1 Day Later')
            .parents('.todo')
            .find('.delete')
            .click();

        cy.get('#todo-list')
            .contains('ToDo 3: 1 Day Later')
            .parents('.todo')
            .find('.delete')
            .click();

        // Wait for the changes to appear
        cy.wait(1000);

        // Verify that the deleted ToDos are not in the list anymore
        cy.get('#todo-list').should('not.contain', 'ToDo 1: 1 Day Ago');
        cy.get('#todo-list').should('not.contain', 'ToDo 2: 1 Day Later');
        cy.get('#todo-list').should('not.contain', 'ToDo 3: 1 Day Later');
    });
});