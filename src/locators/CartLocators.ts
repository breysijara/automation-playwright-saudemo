export const CartLocators = {
  headerTitle: '[data-test="title"]',
  cartList: '[data-test="cart-list"]',
  cartItem: '[data-test="inventory-item"]',
  cartItemName: '[data-test="inventory-item-name"]',
  cartItemPrice: '[data-test="inventory-item-price"]',
  cartQuantity: '[data-test="item-quantity"]',
  checkoutButton: '[data-test="checkout"]',
  continueShoppingButton: '[data-test="continue-shopping"]',
  removeButtonFor: (productSlug: string) => `[data-test="remove-${productSlug}"]`,
};
