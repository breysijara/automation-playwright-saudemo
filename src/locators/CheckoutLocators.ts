export const CheckoutLocators = {
  headerTitle: '[data-test="title"]',
  // Step 1: Customer Information
  firstNameInput: '[data-test="firstName"]',
  lastNameInput: '[data-test="lastName"]',
  postalCodeInput: '[data-test="postalCode"]',
  continueButton: '[data-test="continue"]',
  cancelButton: '[data-test="cancel"]',
  errorMessage: '[data-test="error"]',
  errorButton: '[data-test="error-button"]',

  // Step 2: Overview
  cartItem: '[data-test="inventory-item"]',
  paymentInfo: '[data-test="payment-info-value"]',
  shippingInfo: '[data-test="shipping-info-value"]',
  subtotalLabel: '[data-test="subtotal-label"]',
  taxLabel: '[data-test="tax-label"]',
  totalLabel: '[data-test="total-label"]',
  finishButton: '[data-test="finish"]',

  // Step 3: Complete
  completeHeader: '[data-test="complete-header"]',
  completeText: '[data-test="complete-text"]',
  backHomeButton: '[data-test="back-to-products"]',
  ponyExpressImage: '[data-test="pony-express"]',
};
