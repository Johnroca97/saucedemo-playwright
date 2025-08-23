import { Page, Locator } from 'playwright';

class CartPage {
  private page: Page;
  private pageTitle: Locator;
  private cartItems: Locator;
  private checkoutButton: Locator;
  private continueShoppingButton: Locator;
  private cartQuantityLabel: Locator;
  
  private getCartItemByName: (productName: string) => Locator;
  private getRemoveButtonLocator: (productName: string) => Locator;
  private getItemQuantityLocator: (productName: string) => Locator;
  private getItemPriceLocator: (productName: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartQuantityLabel = page.locator('.cart_quantity_label');

    this.getCartItemByName = (productName: string) =>
      page.locator('[data-test="inventory-item-name"]').filter({ hasText: productName });

    
    this.getRemoveButtonLocator = (productName: string) => {
      const buttonId = this.transformProductNameToButtonId(productName);
      return page.locator(`[data-test="remove-${buttonId}"]`);
    };
    
    this.getItemQuantityLocator = (productName: string) => 
      page.locator(`.cart_item:has([data-test="inventory_item_name"]:has-text("${productName}")) .cart_quantity`);
    
    this.getItemPriceLocator = (productName: string) => 
      page.locator(`.cart_item:has([data-test="inventory_item_name"]:has-text("${productName}")) .inventory_item_price`);
  }

  private transformProductNameToButtonId(productName: string): string {
    return productName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\./g, '')         
      .replace(/\(/g, '')          
      .replace(/\)/g, '')         
      .replace(/'/g, '')          
      .replace(/,/g, '')          
      .replace(/-+/g, '-')        
      .replace(/^-|-$/g, '');     
  }

  async waitForPageLoad() {
    await this.pageTitle.waitFor();
  }

  async removeItem(productName: string) {
    const removeButton = this.getRemoveButtonLocator(productName);
    await removeButton.waitFor();
    await removeButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  // Métodos para obtener información (no aserciones)
  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  async getCartItemCount(): Promise<number> {
    const items = await this.cartItems.count();
    return items;
  }

  async getCartItems(): Promise<string[]> {
    const itemElements = await this.page.locator('.inventory_item_name ').all();
    const items: string[] = [];
    for (const element of itemElements) {
      const name = await element.textContent();
      if (name) items.push(name);
    }
    return items;
  }

  async getItemQuantity(productName: string): Promise<number> {
    const quantityElement = this.getItemQuantityLocator(productName);
    await quantityElement.waitFor();
    const text = await quantityElement.textContent();
    return parseInt(text || '0');
  }

  async getItemPrice(productName: string): Promise<string> {
    const priceElement = this.getItemPriceLocator(productName);
    await priceElement.waitFor();
    return await priceElement.textContent() || '';
  }

  async isItemInCart(productName: string): Promise<boolean> {
    const item = this.getCartItemByName(productName);
    return await item.isVisible();
  }

  async isCartEmpty(): Promise<boolean> {
    const count = await this.getCartItemCount();
    return count === 0;
  }

  async getAllItemPrices(): Promise<string[]> {
    const priceElements = await this.page.locator('.cart_item .inventory_item_price').all();
    const prices: string[] = [];
    for (const element of priceElements) {
      const price = await element.textContent();
      if (price) prices.push(price);
    }
    return prices;
  }

  async isCheckoutButtonEnabled(): Promise<boolean> {
    return await this.checkoutButton.isEnabled();
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible();
  }
}

export default CartPage;
