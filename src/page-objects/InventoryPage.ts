import { Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { InventoryLocators } from '../locators/InventoryLocators';
import { Logger } from '../utils/logger';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private toSlug(name: string): string {
    return name.toLowerCase().replace(/ /g, '-');
  }

  async isPageLoaded(): Promise<boolean> {
    await this.waitForLocator(this.page.locator(InventoryLocators.inventoryContainer), 'visible');
    return await this.isVisible(this.page.locator(InventoryLocators.inventoryContainer));
  }

  async getPageTitle(): Promise<string> {
    return await this.getText(this.page.locator(InventoryLocators.headerTitle));
  }

  async addProductToCart(productName: string): Promise<void> {
    const slug = this.toSlug(productName);
    const addButton = this.page.locator(InventoryLocators.addToCartButtonFor(slug));
    Logger.info(`Adding product to cart: "${productName}" (slug: ${slug})`);
    await this.click(addButton, `Add to Cart [${productName}]`);
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const slug = this.toSlug(productName);
    const removeButton = this.page.locator(InventoryLocators.removeButtonFor(slug));
    Logger.info(`Removing product from cart: "${productName}" (slug: ${slug})`);
    await this.click(removeButton, `Remove [${productName}]`);
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = this.page.locator(InventoryLocators.shoppingCartBadge);
    if (await this.isVisible(badge, 2000)) {
      const text = await this.getText(badge);
      return parseInt(text, 10);
    }
    return 0;
  }

  async goToCart(): Promise<void> {
    Logger.info('Navigating to Shopping Cart');
    await this.click(this.page.locator(InventoryLocators.shoppingCartLink), 'Shopping Cart Link');
    await this.waitForUrl(/.*cart\.html/);
  }

  async sortProductsBy(optionValue: string): Promise<void> {
    Logger.info(`Sorting products by: ${optionValue}`);
    await this.selectOption(this.page.locator(InventoryLocators.productSortSelect), optionValue);
  }

  async getAllProductNames(): Promise<string[]> {
    await this.waitForLocator(this.page.locator(InventoryLocators.inventoryItem).first(), 'visible');
    return await this.page.locator(InventoryLocators.inventoryItemName).allInnerTexts();
  }

  async getAllProductPrices(): Promise<number[]> {
    await this.waitForLocator(this.page.locator(InventoryLocators.inventoryItem).first(), 'visible');
    const priceTexts = await this.page.locator(InventoryLocators.inventoryItemPrice).allInnerTexts();
    return priceTexts.map(text => parseFloat(text.replace('$', '')));
  }

  async getProductPrice(productName: string): Promise<number> {
    const itemContainer = this.page.locator(InventoryLocators.inventoryItem).filter({
      has: this.page.locator(InventoryLocators.inventoryItemName, { hasText: productName }),
    });
    const priceText = await this.getText(itemContainer.locator(InventoryLocators.inventoryItemPrice));
    return parseFloat(priceText.replace('$', ''));
  }

  async logout(): Promise<void> {
    Logger.info('Logging out user via sidebar menu');
    await this.click(this.page.locator(InventoryLocators.menuButton), 'Sidebar Menu Button');
    await this.click(this.page.locator(InventoryLocators.logoutSidebarLink), 'Logout Link');
    await this.waitForUrl(/.*saucedemo\.com\/?$/);
  }
}
