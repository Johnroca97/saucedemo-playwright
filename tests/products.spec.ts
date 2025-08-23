import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import { USERS, PRODUCTS, SORT_OPTIONS } from '../test-data/users';

test.describe('Products Page Functionality', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await productsPage.waitForPageLoad();
  });

  test('should display all products correctly', async () => {
    // Act
    const productNames = await productsPage.getAllProductNames();
    const productPrices = await productsPage.getAllProductPrices();
    
    // Assert
    expect(productNames.length).toBeGreaterThan(0);
    expect(productPrices.length).toBeGreaterThan(0);
    expect(productNames.length).toBe(productPrices.length);
    
    // Verificar que productos específicos están presentes
    expect(productNames).toContain(PRODUCTS.SAUCE_LABS_BACKPACK);
    expect(productNames).toContain(PRODUCTS.SAUCE_LABS_BIKE_LIGHT);
  });

  test('should add product to cart successfully', async () => {
    // Arrange
    const productName = PRODUCTS.SAUCE_LABS_BACKPACK;
    const initialCartCount = await productsPage.getCartItemCount();
    
    // Act
    await productsPage.addProductToCart(productName);
    
    // Assert
    const finalCartCount = await productsPage.getCartItemCount();
    expect(finalCartCount).toBe(initialCartCount + 1);
    
    const isProductInCart = await productsPage.isProductInCart(productName);
    expect(isProductInCart).toBe(true);
  });

  test('should remove product from cart successfully', async () => {
    // Arrange - Primero agregar un producto
    const productName = PRODUCTS.SAUCE_LABS_BACKPACK;
    await productsPage.addProductToCart(productName);
    const cartCountAfterAdd = await productsPage.getCartItemCount();
    
    // Act
    await productsPage.removeProductFromCart(productName);
    
    // Assert
    const finalCartCount = await productsPage.getCartItemCount();
    expect(finalCartCount).toBe(cartCountAfterAdd - 1);
    
    const isProductInCart = await productsPage.isProductInCart(productName);
    expect(isProductInCart).toBe(false);
  });

  test('should add multiple products to cart', async () => {
    // Arrange
    const products = [
      PRODUCTS.SAUCE_LABS_BACKPACK,
      PRODUCTS.SAUCE_LABS_BIKE_LIGHT,
      PRODUCTS.SAUCE_LABS_BOLT_TSHIRT
    ];
    const initialCartCount = await productsPage.getCartItemCount();
    
    // Act
    for (const product of products) {
      await productsPage.addProductToCart(product);
    }
    
    // Assert
    const finalCartCount = await productsPage.getCartItemCount();
    expect(finalCartCount).toBe(initialCartCount + products.length);
    
    // Verificar que todos los productos están en el carrito
    for (const product of products) {
      const isProductInCart = await productsPage.isProductInCart(product);
      expect(isProductInCart).toBe(true);
    }
  });
});