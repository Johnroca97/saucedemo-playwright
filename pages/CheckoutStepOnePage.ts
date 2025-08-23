import { Page, Locator } from 'playwright';

class CheckoutStepOnePage {
  private page: Page;
  private pageTitle: Locator;
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private postalCodeInput: Locator;
  private continueButton: Locator;
  private cancelButton: Locator;
  private errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async waitForPageLoad() {
    await this.pageTitle.waitFor();
    await this.firstNameInput.waitFor();
  }

  async fillFirstName(firstName: string) {
    await this.firstNameInput.waitFor();
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.waitFor();
    await this.lastNameInput.fill(lastName);
  }

  async fillPostalCode(postalCode: string) {
    await this.postalCodeInput.waitFor();
    await this.postalCodeInput.fill(postalCode);
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillPostalCode(postalCode);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clearForm() {
    await this.firstNameInput.clear();
    await this.lastNameInput.clear();
    await this.postalCodeInput.clear();
  }

  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  async getFirstNameValue(): Promise<string> {
    return await this.firstNameInput.inputValue();
  }

  async getLastNameValue(): Promise<string> {
    return await this.lastNameInput.inputValue();
  }

  async getPostalCodeValue(): Promise<string> {
    return await this.postalCodeInput.inputValue();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor();
    return await this.errorMessage.textContent() || '';
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async isContinueButtonEnabled(): Promise<boolean> {
    return await this.continueButton.isEnabled();
  }

  async isCancelButtonVisible(): Promise<boolean> {
    return await this.cancelButton.isVisible();
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible() && await this.firstNameInput.isVisible();
  }

  async areAllFieldsEmpty(): Promise<boolean> {
    const firstName = await this.getFirstNameValue();
    const lastName = await this.getLastNameValue();
    const postalCode = await this.getPostalCodeValue();
    
    return firstName === '' && lastName === '' && postalCode === '';
  }

  async areAllFieldsFilled(): Promise<boolean> {
    const firstName = await this.getFirstNameValue();
    const lastName = await this.getLastNameValue();
    const postalCode = await this.getPostalCodeValue();
    
    return firstName !== '' && lastName !== '' && postalCode !== '';
  }
}

export default CheckoutStepOnePage;
