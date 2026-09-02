export const InventoryLocators = {
  headerTitle: '[data-test="title"]',
  inventoryContainer: '[data-test="inventory-container"]',
  inventoryList: '[data-test="inventory-list"]',
  inventoryItem: '[data-test="inventory-item"]',
  inventoryItemName: '[data-test="inventory-item-name"]',
  inventoryItemPrice: '[data-test="inventory-item-price"]',
  inventoryItemDesc: '[data-test="inventory-item-desc"]',
  shoppingCartLink: '[data-test="shopping-cart-link"]',
  shoppingCartBadge: '[data-test="shopping-cart-badge"]',
  productSortSelect: '[data-test="product-sort-container"]',
  menuButton: '#react-burger-menu-btn',
  logoutSidebarLink: '[data-test="logout-sidebar-link"]',
  resetAppStateLink: '[data-test="reset-sidebar-link"]',
  // Helper dynamic selector functions
  addToCartButtonFor: (productSlug: string) => `[data-test="add-to-cart-${productSlug}"]`,
  removeButtonFor: (productSlug: string) => `[data-test="remove-${productSlug}"]`,
};
