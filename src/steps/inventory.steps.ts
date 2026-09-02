import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../fixtures/customWorld';

Given('que el usuario se encuentra en el catálogo de productos', async function (this: CustomWorld) {
  const isLoaded = await this.inventoryPage.isPageLoaded();
  expect(isLoaded).toBeTruthy();
});

When('el usuario agrega los siguientes productos al carrito:', async function (this: CustomWorld, dataTable: DataTable) {
  const products = dataTable.hashes().map(row => row.producto);
  this.testContext.addedProducts = [];
  this.testContext.expectedSubtotal = 0;

  for (const product of products) {
    const price = await this.inventoryPage.getProductPrice(product);
    this.testContext.expectedSubtotal += price;
    await this.inventoryPage.addProductToCart(product);
    this.testContext.addedProducts.push(product);
  }
});

When('el usuario agrega el producto {string} al carrito', async function (this: CustomWorld, productName: string) {
  await this.inventoryPage.addProductToCart(productName);
  this.testContext.addedProducts.push(productName);
});

When('el usuario remueve el producto {string} desde el inventario', async function (this: CustomWorld, productName: string) {
  await this.inventoryPage.removeProductFromCart(productName);
  this.testContext.addedProducts = this.testContext.addedProducts.filter(p => p !== productName);
});

Then('el carrito de compras debería mostrar un contador de {int} productos', async function (this: CustomWorld, expectedCount: number) {
  const count = await this.inventoryPage.getCartBadgeCount();
  expect(count).toBe(expectedCount);
});

When('el usuario navega a la página del carrito', async function (this: CustomWorld) {
  await this.inventoryPage.goToCart();
});
