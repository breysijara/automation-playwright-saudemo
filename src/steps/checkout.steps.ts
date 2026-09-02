import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../fixtures/customWorld';
import { CheckoutDataFactory } from '../factories/CheckoutDataFactory';

When('completa el formulario de información con datos válidos', async function (this: CustomWorld) {
  const customer = CheckoutDataFactory.getValidCustomer();
  await this.checkoutPage.fillCustomerInformation(customer.firstName, customer.lastName, customer.postalCode);
});

When('continúa al resumen de la orden', async function (this: CustomWorld) {
  await this.checkoutPage.clickContinue();
  const isOverview = await this.checkoutPage.isOverviewPageLoaded();
  expect(isOverview).toBeTruthy();
});

When('hace clic en continuar', async function (this: CustomWorld) {
  await this.checkoutPage.clickContinue();
});

When(
  'el usuario completa el formulario de checkout con nombre {string}, apellido {string} y código postal {string}',
  async function (this: CustomWorld, firstName: string, lastName: string, postalCode: string) {
    await this.checkoutPage.fillCustomerInformation(firstName, lastName, postalCode);
  }
);

When('el usuario ingresa datos de cliente con tipo de borde {string}', async function (this: CustomWorld, boundaryType: any) {
  const customer = CheckoutDataFactory.getBoundaryCustomer(boundaryType);
  await this.checkoutPage.fillCustomerInformation(customer.firstName, customer.lastName, customer.postalCode);
});

Then(
  'debería mostrarse el mensaje de error de checkout {string}',
  async function (this: CustomWorld, expectedErrorMessage: string) {
    const isVisible = await this.checkoutPage.isErrorMessageDisplayed();
    expect(isVisible).toBeTruthy();
    const actualMessage = await this.checkoutPage.getErrorMessage();
    expect(actualMessage).toBe(expectedErrorMessage);
  }
);

Then('el usuario debería avanzar exitosamente al resumen de la orden', async function (this: CustomWorld) {
  const isOverview = await this.checkoutPage.isOverviewPageLoaded();
  expect(isOverview).toBeTruthy();
});

Then(
  'el sistema debería mostrar el desglose de precios calculado correctamente:',
  async function (this: CustomWorld, _dataTable?: any) {
    const actualSubtotal = await this.checkoutPage.getItemSubtotal();
    const actualTax = await this.checkoutPage.getTax();
    const actualTotal = await this.checkoutPage.getTotal();

    // Verify subtotal matches dynamically calculated product sum if present
    if (this.testContext.expectedSubtotal > 0) {
      expect(actualSubtotal).toBeCloseTo(this.testContext.expectedSubtotal, 2);
    }

    // Verify mathematical integrity: Total = Subtotal + Tax
    const calculatedTotal = parseFloat((actualSubtotal + actualTax).toFixed(2));
    expect(actualTotal).toBe(calculatedTotal);
  }
);

When('el usuario finaliza la compra', async function (this: CustomWorld) {
  await this.checkoutPage.finishCheckout();
});

Then(
  'la orden debería completarse exitosamente mostrando el mensaje {string}',
  async function (this: CustomWorld, expectedHeader: string) {
    const isComplete = await this.checkoutPage.isOrderComplete();
    expect(isComplete).toBeTruthy();
    const actualHeader = await this.checkoutPage.getCompleteHeader();
    expect(actualHeader).toBe(expectedHeader);
  }
);

Then(
  'el texto descriptivo de confirmación debería indicar {string}',
  async function (this: CustomWorld, expectedText: string) {
    const actualText = await this.checkoutPage.getCompleteMessage();
    expect(actualText).toBe(expectedText);
  }
);
