import { Page, Locator } from 'playwright';

class ProductsPage {
  private page: Page;
  private pageTitle: Locator;
  private productsContainer: Locator;
  private sortDropdown: Locator;
  private cartIcon: Locator;
  private cartBadge: Locator;
  private menuButton: Locator;
  private logoutLink: Locator;
  
  private getProductByName: (productName: string) => Locator;
  private getAddToCartButtonLocator: (productName: string) => Locator;
  private getRemoveButtonLocator: (productName: string) => Locator;
  private getProductPriceLocator: (productName: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.productsContainer = page.locator('.inventory_container');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');

    this.getProductByName = (productName: string) => 
      page.locator(`[data-test="inventory_item_name"]:has-text("${productName}")`);
    
    this.getAddToCartButtonLocator = (productName: string) => 
      page.locator(`[data-test="add-to-cart-${productName.toLowerCase().replace(/\s+/g, '-')}"]`);
    
    this.getRemoveButtonLocator = (productName: string) => 
      page.locator(`[data-test="remove-${productName.toLowerCase().replace(/\s+/g, '-')}"]`);
    
    this.getProductPriceLocator = (productName: string) => 
      page.locator(`.inventory_item:has([data-test="inventory_item_name"]:has-text("${productName}")) .inventory_item_price`);
  }

  async waitForPageLoad() {
    await this.page.waitForTimeout(1000);
    await this.pageTitle.waitFor();
    await this.productsContainer.waitFor();
  }

  async addProductToCart(productName: string) {
    const addButton = this.getAddToCartButtonLocator(productName);
    await addButton.waitFor();
    await addButton.click();
  }

  async removeProductFromCart(productName: string) {
    const removeButton = this.getRemoveButtonLocator(productName);
    await removeButton.waitFor();
    await removeButton.click();
  }

  async clickProduct(productName: string) {
    const product = this.getProductByName(productName);
    await product.waitFor();
    await product.click();
  }

  async sortProducts(sortOption: string) {
    await this.sortDropdown.waitFor();
    await this.sortDropdown.selectOption(sortOption);
  }

  async goToCart() {
    await this.cartIcon.click();
    await this.page.waitForLoadState('networkidle');
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.waitFor();
    await this.logoutLink.click();
  }

  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  async getCartItemCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text || '0');
  }

  async getProductPriceText(productName: string): Promise<string> {
    const priceElement = this.getProductPriceLocator(productName);
    await priceElement.waitFor();
    return await priceElement.textContent() || '';
  }

  async isProductInCart(productName: string): Promise<boolean> {
    const removeButton = this.getRemoveButtonLocator(productName);
    return await removeButton.isVisible();
  }

  async getAllProductNames(): Promise<string[]> {
    const productElements = await this.page.locator('.inventory_item_name ').all();
    const names: string[] = [];
    for (const element of productElements) {
      const name = await element.textContent();
      if (name) names.push(name);
    }
    return names;
  }

  async getAllProductPrices(): Promise<string[]> {
    const priceElements = await this.page.locator('.inventory_item_price').all();
    const prices: string[] = [];
    for (const element of priceElements) {
      const price = await element.textContent();
      if (price) prices.push(price);
    }
    return prices;
  }

  async getCurrentSortOption(): Promise<string> {
    return await this.sortDropdown.inputValue();
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible() && await this.productsContainer.isVisible();
  }
}

export default ProductsPage;
