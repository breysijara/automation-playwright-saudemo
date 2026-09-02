import { Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { CheckoutLocators } from '../locators/CheckoutLocators';
import { Logger } from '../utils/logger';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // --- Step One: Customer Information ---

  async fillCustomerInformation(firstName?: string, lastName?: string, postalCode?: string): Promise<void> {
    Logger.info(`Filling checkout form: First=${firstName || ''}, Last=${lastName || ''}, Zip=${postalCode || ''}`);

    if (firstName !== undefined && firstName !== '') {
      await this.fill(this.page.locator(CheckoutLocators.firstNameInput), firstName, 'First Name');
    } else {
      await this.page.locator(CheckoutLocators.firstNameInput).clear();
    }

    if (lastName !== undefined && lastName !== '') {
      await this.fill(this.page.locator(CheckoutLocators.lastNameInput), lastName, 'Last Name');
    } else {
      await this.page.locator(CheckoutLocators.lastNameInput).clear();
    }

    if (postalCode !== undefined && postalCode !== '') {
      await this.fill(this.page.locator(CheckoutLocators.postalCodeInput), postalCode, 'Postal Code');
    } else {
      await this.page.locator(CheckoutLocators.postalCodeInput).clear();
    }
  }

  async clickContinue(): Promise<void> {
    Logger.info('Submitting customer info (Continue)');
    await this.click(this.page.locator(CheckoutLocators.continueButton), 'Continue Button');
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.page.locator(CheckoutLocators.errorMessage));
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.page.locator(CheckoutLocators.errorMessage));
  }

  // --- Step Two: Overview & State Verification ---

  async isOverviewPageLoaded(): Promise<boolean> {
    await this.waitForUrl(/.*checkout-step-two\.html/);
    return await this.isVisible(this.page.locator(CheckoutLocators.finishButton));
  }

  async getItemSubtotal(): Promise<number> {
    const text = await this.getText(this.page.locator(CheckoutLocators.subtotalLabel));
    // text is like "Item total: $29.99"
    const match = text.match(/\$([0-9]+\.[0-9]{2})/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTax(): Promise<number> {
    const text = await this.getText(this.page.locator(CheckoutLocators.taxLabel));
    // text is like "Tax: $2.40"
    const match = text.match(/\$([0-9]+\.[0-9]{2})/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTotal(): Promise<number> {
    const text = await this.getText(this.page.locator(CheckoutLocators.totalLabel));
    // text is like "Total: $32.39"
    const match = text.match(/\$([0-9]+\.[0-9]{2})/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getPaymentInfo(): Promise<string> {
    return await this.getText(this.page.locator(CheckoutLocators.paymentInfo));
  }

  async getShippingInfo(): Promise<string> {
    return await this.getText(this.page.locator(CheckoutLocators.shippingInfo));
  }

  async finishCheckout(): Promise<void> {
    Logger.info('Completing order (Finish)');
    await this.click(this.page.locator(CheckoutLocators.finishButton), 'Finish Button');
    await this.waitForUrl(/.*checkout-complete\.html/);
  }

  // --- Step Three: Complete Confirmation ---

  async isOrderComplete(): Promise<boolean> {
    await this.waitForLocator(this.page.locator(CheckoutLocators.completeHeader), 'visible');
    return await this.isVisible(this.page.locator(CheckoutLocators.completeHeader));
  }

  async getCompleteHeader(): Promise<string> {
    return await this.getText(this.page.locator(CheckoutLocators.completeHeader));
  }

  async getCompleteMessage(): Promise<string> {
    return await this.getText(this.page.locator(CheckoutLocators.completeText));
  }

  async backHome(): Promise<void> {
    Logger.info('Navigating back to products from order completion');
    await this.click(this.page.locator(CheckoutLocators.backHomeButton), 'Back Home Button');
    await this.waitForUrl(/.*inventory\.html/);
  }
}
