import { Page, Locator } from 'playwright';

class CheckoutStepTwoPage {
  private page: Page;
  private pageTitle: Locator;
  private cartItems: Locator;
  private finishButton: Locator;
  private cancelButton: Locator;
  private paymentInformation: Locator;
  private shippingInformation: Locator;
  private itemTotal: Locator;
  private taxLabel: Locator;
  private totalLabel: Locator;
  private summaryInfo: Locator;

  private getItemByName: (productName: string) => Locator;
  private getItemPriceLocator: (productName: string) => Locator;
  private getItemQuantityLocator: (productName: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.paymentInformation = page.locator('[data-test="payment-info-value"]');
    this.shippingInformation = page.locator('[data-test="shipping-info-value"]');
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.summaryInfo = page.locator('.summary_info');

    this.getItemByName = (productName: string) => 
      page.locator(`.cart_item:has([data-test="inventory_item_name"]:has-text("${productName}"))`);
    
    this.getItemPriceLocator = (productName: string) => 
      page.locator(`.cart_item:has([data-test="inventory_item_name"]:has-text("${productName}")) .inventory_item_price`);
    
    this.getItemQuantityLocator = (productName: string) => 
      page.locator(`.cart_item:has([data-test="inventory_item_name"]:has-text("${productName}")) .cart_quantity`);
  }

  async waitForPageLoad() {
    await this.pageTitle.waitFor();
    await this.summaryInfo.waitFor();
  }

  async clickFinish() {
    await this.finishButton.waitFor();
    await this.finishButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
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

  async getItemPrice(productName: string): Promise<string> {
    const priceElement = this.getItemPriceLocator(productName);
    await priceElement.waitFor();
    return await priceElement.textContent() || '';
  }

  async getItemQuantity(productName: string): Promise<number> {
    const quantityElement = this.getItemQuantityLocator(productName);
    await quantityElement.waitFor();
    const text = await quantityElement.textContent();
    return parseInt(text || '0');
  }

  async getPaymentInformation(): Promise<string> {
    return await this.paymentInformation.textContent() || '';
  }

  async getShippingInformation(): Promise<string> {
    return await this.shippingInformation.textContent() || '';
  }

  async getItemTotal(): Promise<string> {
    return await this.itemTotal.textContent() || '';
  }

  async getTax(): Promise<string> {
    return await this.taxLabel.textContent() || '';
  }

  async getTotalAmount(): Promise<string> {
    return await this.totalLabel.textContent() || '';
  }

  async getItemTotalValue(): Promise<number> {
    const text = await this.getItemTotal();
    const match = text.match(/\$(\d+\.\d{2})/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTaxValue(): Promise<number> {
    const text = await this.getTax();
    const match = text.match(/\$(\d+\.\d{2})/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTotalValue(): Promise<number> {
    const text = await this.getTotalAmount();
    const match = text.match(/\$(\d+\.\d{2})/);
    return match ? parseFloat(match[1]) : 0;
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

  async isItemInSummary(productName: string): Promise<boolean> {
    const item = this.getItemByName(productName);
    return await item.isVisible();
  }

  async isFinishButtonEnabled(): Promise<boolean> {
    return await this.finishButton.isEnabled();
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible() && await this.summaryInfo.isVisible();
  }

  async isSummaryComplete(): Promise<boolean> {
    const hasItems = await this.getCartItemCount() > 0;
    const hasTotal = await this.totalLabel.isVisible();
    const hasTax = await this.taxLabel.isVisible();
    const hasItemTotal = await this.itemTotal.isVisible();
    
    return hasItems && hasTotal && hasTax && hasItemTotal;
  }

  async calculateExpectedTotal(): Promise<number> {
    const itemTotal = await this.getItemTotalValue();
    const tax = await this.getTaxValue();
    return Math.round((itemTotal + tax) * 100) / 100;
  }
}

export default CheckoutStepTwoPage;
