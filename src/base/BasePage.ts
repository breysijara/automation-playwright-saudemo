import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/logger';
import { Config } from '../config/environment';

/**
 * BasePage encapsula las operaciones fundamentales de interacción con el navegador.
 */
export abstract class BasePage {
  protected page: Page;
  protected defaultTimeout: number;

  constructor(page: Page) {
    this.page = page;
    this.defaultTimeout = Config.defaultTimeout;
  }

  /**
   * Navega hacia una URL relativa o absoluta con espera explícita al estado DOM.
   */
  async navigateTo(urlPath: string = ''): Promise<void> {
    const targetUrl = urlPath.startsWith('http') ? urlPath : `${Config.baseUrl}${urlPath}`;
    Logger.info(`Navigating to URL: ${targetUrl}`);
    await this.page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout: this.defaultTimeout,
    });
  }

  /**
   * Espera explícita a que un localizador se encuentre en un estado determinado.
   */
  async waitForLocator(locator: Locator, state: 'visible' | 'attached' | 'detached' | 'hidden' = 'visible', customTimeout?: number): Promise<void> {
    const timeout = customTimeout || this.defaultTimeout;
    await locator.waitFor({ state, timeout });
  }

  /**
   * Clic en un elemento con validación explícita de visibilidad y habilitación.
   */
  async click(locator: Locator, description?: string): Promise<void> {
    const desc = description || locator.toString();
    Logger.info(`Clicking on element: ${desc}`);
    await this.waitForLocator(locator, 'visible');
    await expect(locator).toBeEnabled({ timeout: this.defaultTimeout });
    await locator.click({ timeout: this.defaultTimeout });
  }

  /**
   * Escribe texto en un campo de entrada tras asegurar visibilidad y editable.
   */
  async fill(locator: Locator, value: string, description?: string): Promise<void> {
    const desc = description || locator.toString();
    Logger.info(`Filling text into [${desc}]`);
    await this.waitForLocator(locator, 'visible');
    await expect(locator).toBeEditable({ timeout: this.defaultTimeout });
    await locator.fill(value, { timeout: this.defaultTimeout });
  }

  /**
   * Limpia y escribe texto secuencialmente (simulación de teclado humano).
   */
  async type(locator: Locator, value: string, description?: string): Promise<void> {
    const desc = description || locator.toString();
    Logger.info(`Typing text into [${desc}]`);
    await this.waitForLocator(locator, 'visible');
    await locator.pressSequentially(value, { timeout: this.defaultTimeout });
  }

  /**
   * Obtiene el texto visible de un elemento con espera explícita.
   */
  async getText(locator: Locator): Promise<string> {
    await this.waitForLocator(locator, 'visible');
    const text = await locator.innerText({ timeout: this.defaultTimeout });
    return text.trim();
  }

  /**
   * Obtiene el valor de un atributo de un elemento.
   */
  async getAttribute(locator: Locator, attributeName: string): Promise<string | null> {
    await this.waitForLocator(locator, 'attached');
    return await locator.getAttribute(attributeName, { timeout: this.defaultTimeout });
  }

  /**
   * Verifica si un elemento es visible inmediatamente o dentro de un timeout explícito.
   */
  async isVisible(locator: Locator, timeout: number = 3000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Selecciona una opción en un dropdown por valor visible.
   */
  async selectOption(locator: Locator, value: string): Promise<void> {
    Logger.info(`Selecting option [${value}] on dropdown`);
    await this.waitForLocator(locator, 'visible');
    await locator.selectOption(value, { timeout: this.defaultTimeout });
  }

  /**
   * Retorna la cantidad de elementos que coinciden con el localizador.
   */
  async getCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  /**
   * Espera explícita hasta que la URL contenga el patrón esperado.
   */
  async waitForUrl(pattern: string | RegExp): Promise<void> {
    Logger.info(`Waiting for URL pattern: ${pattern.toString()}`);
    await this.page.waitForURL(pattern, { timeout: this.defaultTimeout });
  }

  /**
   * Captura de pantalla manual para evidencias.
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    Logger.info(`Taking screenshot: ${name}`);
    return await this.page.screenshot({ fullPage: true });
  }
}
