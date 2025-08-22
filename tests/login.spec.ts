import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import { USERS, ERROR_MESSAGES } from '../test-data/users';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Arrange & Act
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    
    // Assert - Las aserciones van en los tests, NO en los Page Objects
    await expect(page).toHaveURL(/.*inventory/);
    await productsPage.waitForPageLoad();
    
    const pageTitle = await productsPage.getPageTitle();
    expect(pageTitle).toBe('Products');
    
    const isPageLoaded = await productsPage.isPageLoaded();
    expect(isPageLoaded).toBe(true);
  });

  test('should show error message for locked out user', async () => {
    // Arrange & Act
    await loginPage.login(USERS.LOCKED_OUT.username, USERS.LOCKED_OUT.password);
    
    // Assert
    const isErrorVisible = await loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBe(true);
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(ERROR_MESSAGES.LOCKED_OUT_USER);
    
    // Verificar que sigue en la página de login
    const isLoginFormVisible = await loginPage.isLoginFormVisible();
    expect(isLoginFormVisible).toBe(true);
  });

  test('should show error message for invalid credentials', async () => {
    // Arrange & Act
    await loginPage.login(USERS.INVALID.username, USERS.INVALID.password);
    
    // Assert
    const isErrorVisible = await loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBe(true);
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test('should show error message when username is missing', async () => {
    // Arrange & Act
    await loginPage.fillPassword(USERS.STANDARD.password);
    await loginPage.clickLogin();
    
    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(ERROR_MESSAGES.MISSING_USERNAME);
  });

  test('should show error message when password is missing', async () => {
    // Arrange & Act
    await loginPage.fillUsername(USERS.STANDARD.username);
    await loginPage.clickLogin();
    
    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(ERROR_MESSAGES.MISSING_PASSWORD);
  });

  test('should clear form fields correctly', async () => {
    // Arrange
    await loginPage.fillUsername(USERS.STANDARD.username);
    await loginPage.fillPassword(USERS.STANDARD.password);
    
    // Act
    await loginPage.clearForm();
    
    // Assert
    const usernameValue = await loginPage.getUsernameValue();
    const passwordValue = await loginPage.getPasswordValue();
    
    expect(usernameValue).toBe('');
    expect(passwordValue).toBe('');
  });

  test('should maintain form state during interaction', async () => {
    // Arrange & Act
    const testUsername = USERS.STANDARD.username;
    await loginPage.fillUsername(testUsername);
    
    // Assert
    const usernameValue = await loginPage.getUsernameValue();
    expect(usernameValue).toBe(testUsername);
  });
});
