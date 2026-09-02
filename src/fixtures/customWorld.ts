import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { InventoryPage } from '../page-objects/InventoryPage';
import { CartPage } from '../page-objects/CartPage';
import { CheckoutPage } from '../page-objects/CheckoutPage';

export interface TestScenarioContext {
  addedProducts: string[];
  expectedSubtotal: number;
  expectedTax: number;
  expectedTotal: number;
  [key: string]: any;
}

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  // Page Object Instances
  loginPage!: LoginPage;
  inventoryPage!: InventoryPage;
  cartPage!: CartPage;
  checkoutPage!: CheckoutPage;

  // Scenario Shared State
  testContext: TestScenarioContext = {
    addedProducts: [],
    expectedSubtotal: 0,
    expectedTax: 0,
    expectedTotal: 0,
  };

  constructor(options: IWorldOptions) {
    super(options);
  }

  initPages(page: Page): void {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutPage = new CheckoutPage(page);
  }
}

setWorldConstructor(CustomWorld);
