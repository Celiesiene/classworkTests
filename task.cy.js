/// <reference types="cypress" />

describe('Cypress Testų Scenarijai', () => {
  // Prieš kiekvieną testą atidaro pagrindinį puslapį
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/index.html')
  });

  describe('1. Pagrindinio puslapio testas', () => {
    it('Patikrina, ar banner yra matomas ir mygtuko paspaudimas pakeičia URL', () => {
      // Patikriname, ar banner yra matomas ir turi teisingą tekstą
      cy.get('.banner').should('be.visible').and('contain.text', 'Sveiki atvykę į Cypress testų puslapį!');
      // Gauname alert pranešimą ir patikriname jo tekstą
      cy.on('window:alert', (alertText) => {
        expect(alertText).to.eq('Navigacija į /commands/actions atlikta!');
      });
      // Paspaudžiame mygtuką "type"
      cy.get('#section-basic').find('button#action-type').click();
      // Patikriname, ar URL įtraukia "/commands/actions"
      cy.url().should('include', '/commands/actions');
    });
  });

  describe('2. Prisijungimo formos testas', () => {
    it('Užpildo formą ir rodo sveikinimo žinutę bei profilio informaciją', () => {
      // Sukuriame kintamuosius su prisijungimo duomenimis ir juos įvedame į formą
      const username = 'bebras';
      const password = 'bebrauskas';
      cy.get('#username').type(username);
      cy.get('#password').type(password);
      cy.get('#login-button').click();
      // Patikriname, ar rodoma sveikinimo žinutė
      cy.get('#greeting').should('be.visible').and('contain.text', `${username}`);
      // Patikriname, ar rodoma profilio informacija
      cy.get('#profile').should('be.visible').and('contain.text', 'Čia yra studento profilio informacija.');
    });
  });

  describe('3. Dynamic element test', () => {
    it('Checks if all list elements have a word "Item"', () => {
      // Find all of unordered list elements and check, if they have a word "Item":

      cy.get("ul#item-list li").each((element) => {
        cy.wrap(element).should("contain.text", "Item");
      });
    });
  });


  describe('4. API užklausų testas', () => {
    it('Stubina API užklausą ir rodo stubintus duomenis', () => {
      // Paruoštas stubintas atsakymas
      const stubbedData = {
        userId: 1,
        id: 1,
        title: 'Stubbed API Post Title',
        body: 'Stubbed API Post Body'
      };

      // Interceptuojame GET užklausą į JSONPlaceholder API
      cy.intercept('GET', 'https://jsonplaceholder.typicode.com/posts/1', {
        statusCode: 200,
        body: stubbedData
      }).as('getPost')
      // Paspaudžiame mygtuką, kuris iškviečia fetch užklausą
      cy.get('#fetch-data').click();
      // Laukiame, kol užklausa bus atlikta
      cy.wait('@getPost');
      // Patikriname, ar .data-container elemente rodomi stubinto atsakymo duomenys
      cy.get('.data-container').within(() => {
        cy.get('h3').should('contain', stubbedData.title);
        cy.get('p').should('contain', stubbedData.body);
      })
    });
  });

  describe('5. Asinchroninės operacijos testas', () => {
    it('Patikrina, ar asinchroninė operacija baigiasi teisingai', () => {
      cy.get('#async-action').click();
 
      // Iškart po paspaudimo turi būti rodomas pranešimas
      cy.get('#async-result').should('contain', 'Operacija prasidėjo...');
 
      // Laukiame, kol asinchroninė operacija baigsis (naudojame šiek tiek ilgesnį timeout)
      cy.get('#async-result', { timeout: 3500 }).should('contain', 'Asinchroninė operacija baigta!');
    });
  });
 
  describe('6. Hover efekto testas', () => {
    it('Rodo tooltip, kai užvedama pele ant hover-box', () => {
      // Iš pradžių tooltip neturėtų būti matomas
      cy.get('div.tooltip').should('not.be.visible');
      // Simuliuojame pelės užvedimą ant elemento
      cy.get('.hover-box').trigger('mouseover');
      cy.get('div.tooltip').should('be.visible');
      // Simuliuojame pelės nuvedimą nuo elemento
      cy.get('.hover-box').trigger('mouseout');
      cy.get('div.tooltip').should('not.be.visible');
    });
  });
});
