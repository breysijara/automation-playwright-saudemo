import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../fixtures/customWorld';
import { UserFactory } from '../factories/UserFactory';

Given('que el usuario navega a la página de inicio de sesión', async function (this: CustomWorld) {
  await this.loginPage.navigate();
});

Given('que el usuario inicia sesión con credenciales válidas', async function (this: CustomWorld) {
  await this.loginPage.navigate();
  const user = UserFactory.getStandardUser();
  await this.loginPage.login(user.username, user.password);
  const isLoaded = await this.inventoryPage.isPageLoaded();
  expect(isLoaded).toBeTruthy();
});

When('el usuario inicia sesión con credenciales válidas', async function (this: CustomWorld) {
  const user = UserFactory.getStandardUser();
  await this.loginPage.login(user.username, user.password);
});

When('el usuario intenta iniciar sesión con una cuenta bloqueada', async function (this: CustomWorld) {
  const user = UserFactory.getLockedOutUser();
  await this.loginPage.login(user.username, user.password);
});

When(
  'el usuario intenta iniciar sesión con el criterio de error {string}',
  async function (this: CustomWorld, criterion: string) {
    const user = UserFactory.getInvalidScenario(criterion);
    await this.loginPage.login(user.username, user.password);
  }
);

Then('el usuario debería ser redirigido a la página de productos', async function (this: CustomWorld) {
  const isLoaded = await this.inventoryPage.isPageLoaded();
  expect(isLoaded).toBeTruthy();
});

Then('el título de la página debería ser {string}', async function (this: CustomWorld, expectedTitle: string) {
  const title = await this.inventoryPage.getPageTitle();
  expect(title).toBe(expectedTitle);
});

Then('debería mostrarse el mensaje de error {string}', async function (this: CustomWorld, expectedMsg: string) {
  const isVisible = await this.loginPage.isErrorMessageDisplayed();
  expect(isVisible).toBeTruthy();
  const actualMsg = await this.loginPage.getErrorMessage();
  expect(actualMsg).toBe(expectedMsg);
});
