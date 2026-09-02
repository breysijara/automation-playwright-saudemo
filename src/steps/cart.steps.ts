import { When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../fixtures/customWorld';

Then('el carrito debería contener exactamente los siguientes productos:', async function (this: CustomWorld, dataTable: DataTable) {
  const expectedProducts = dataTable.hashes().map(row => row.producto);
  const actualProducts = await this.cartPage.getCartItemNames();
  expect(actualProducts.sort()).toEqual(expectedProducts.sort());
});

When('el usuario remueve el producto {string} desde el carrito', async function (this: CustomWorld, productName: string) {
  await this.cartPage.removeProduct(productName);
});

Then('el carrito debería estar vacío', async function (this: CustomWorld) {
  const count = await this.cartPage.getCartItemsCount();
  expect(count).toBe(0);
});

When('el usuario procede al checkout', async function (this: CustomWorld) {
  await this.cartPage.proceedToCheckout();
});
