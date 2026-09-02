import { Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { LoginLocators } from '../locators/LoginLocators';
import { Logger } from '../utils/logger';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForLocator(this.page.locator(LoginLocators.loginButton), 'visible');
  }

  async login(username?: string, password?: string): Promise<void> {
    Logger.info(`Performing login attempt for user: [${username || '<empty>'}]`);
    if (username !== undefined && username !== '') {
      await this.fill(this.page.locator(LoginLocators.usernameInput), username, 'Username field');
    } else {
      await this.page.locator(LoginLocators.usernameInput).clear();
    }

    if (password !== undefined && password !== '') {
      await this.fill(this.page.locator(LoginLocators.passwordInput), password, 'Password field');
    } else {
      await this.page.locator(LoginLocators.passwordInput).clear();
    }

    await this.click(this.page.locator(LoginLocators.loginButton), 'Login Button');
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.page.locator(LoginLocators.errorMessage));
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.page.locator(LoginLocators.errorMessage));
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.isVisible(this.page.locator(LoginLocators.loginButton));
  }
}
