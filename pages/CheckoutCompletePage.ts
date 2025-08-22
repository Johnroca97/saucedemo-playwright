import { Page, Locator } from 'playwright';

class CheckoutCompletePage {
  private page: Page;
  private pageTitle: Locator;
  private completeHeader: Locator;
  private completeText: Locator;
  private completeImage: Locator;
  private backHomeButton: Locator;
  private checkoutCompleteContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.completeImage = page.locator('[data-test="pony_express"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.checkoutCompleteContainer = page.locator('.checkout_complete_container');
  }

  async waitForPageLoad() {
    await this.page.waitForTimeout(1000);
    await this.pageTitle.waitFor();
    await this.completeHeader.waitFor();
  }

  async clickBackHome() {
    await this.backHomeButton.waitFor();
    await this.backHomeButton.click();
  }

  // Métodos para obtener información (no aserciones)
  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  async getCompleteHeader(): Promise<string> {
    return await this.completeHeader.textContent() || '';
  }

  async getCompleteText(): Promise<string> {
    return await this.completeText.textContent() || '';
  }

  async isCompleteImageVisible(): Promise<boolean> {
    return await this.completeImage.isVisible();
  }

  async isBackHomeButtonVisible(): Promise<boolean> {
    return await this.backHomeButton.isVisible();
  }

  async isBackHomeButtonEnabled(): Promise<boolean> {
    return await this.backHomeButton.isEnabled();
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible() && 
           await this.completeHeader.isVisible() && 
           await this.checkoutCompleteContainer.isVisible();
  }

  async isOrderCompleted(): Promise<boolean> {
    const header = await this.getCompleteHeader();
    const text = await this.getCompleteText();
    const imageVisible = await this.isCompleteImageVisible();
    
    return header.includes('Thank you') || 
           header.includes('complete') || 
           text.includes('dispatched') ||
           imageVisible;
  }

  async getCompletePageUrl(): Promise<string> {
    return this.page.url();
  }

  async isSuccessPage(): Promise<boolean> {
    const url = await this.getCompletePageUrl();
    return url.includes('checkout-complete');
  }
}

export default CheckoutCompletePage;
