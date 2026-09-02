import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { CartLocators } from '../locators/CartLocators';
import { Logger } from '../utils/logger';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private toSlug(name: string): string {
    return name.toLowerCase().replace(/ /g, '-');
  }

  async isPageLoaded(): Promise<boolean> {
    await this.waitForLocator(this.page.locator(CartLocators.cartList), 'visible');
    return await this.isVisible(this.page.locator(CartLocators.cartList));
  }

  async getPageTitle(): Promise<string> {
    return await this.getText(this.page.locator(CartLocators.headerTitle));
  }

  async getCartItemNames(): Promise<string[]> {
    const items = this.page.locator(CartLocators.cartItemName);
    const count = await items.count();
    if (count === 0) return [];
    return await items.allInnerTexts();
  }

  async getCartItemPrices(): Promise<number[]> {
    const prices = this.page.locator(CartLocators.cartItemPrice);
    const count = await prices.count();
    if (count === 0) return [];
    const texts = await prices.allInnerTexts();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }

  async removeProduct(productName: string): Promise<void> {
    const slug = this.toSlug(productName);
    const removeBtn = this.page.locator(CartLocators.removeButtonFor(slug));
    Logger.info(`Removing product from cart: "${productName}" (slug: ${slug})`);
    await this.click(removeBtn, `Remove [${productName}] button`);
  }

  async proceedToCheckout(): Promise<void> {
    Logger.info('Proceeding to Checkout Step One');
    await this.click(this.page.locator(CartLocators.checkoutButton), 'Checkout Button');
    await this.waitForUrl(/.*checkout-step-one\.html/);
  }

  async continueShopping(): Promise<void> {
    Logger.info('Continuing shopping');
    await this.click(this.page.locator(CartLocators.continueShoppingButton), 'Continue Shopping Button');
    await this.waitForUrl(/.*inventory\.html/);
  }

  async getCartItemsCount(): Promise<number> {
    return await this.getCount(this.page.locator(CartLocators.cartItem));
  }
}
