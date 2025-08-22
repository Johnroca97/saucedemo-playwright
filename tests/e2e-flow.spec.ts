import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import CartPage from '../pages/CartPage';
import { USERS, PRODUCTS, CHECKOUT_INFO } from '../test-data/users';
import CheckoutStepOnePage from '../pages/CheckoutStepOnePage';
import CheckoutStepTwoPage from '../pages/CheckOutStepTwoPage';
import CheckoutCompletePage from '../pages/CheckoutCompletePage';

test.describe('End-to-End Shopping Flow', () => {
    let loginPage: LoginPage;
    let productsPage: ProductsPage;
    let cartPage: CartPage;
    let checkoutStepOnePage: CheckoutStepOnePage
    let checkoutStepTwoPage: CheckoutStepTwoPage;
    let checkoutCompletePage: CheckoutCompletePage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        checkoutStepOnePage = new CheckoutStepOnePage(page);
        checkoutStepTwoPage = new CheckoutStepTwoPage(page);
        checkoutCompletePage = new CheckoutCompletePage(page);
    });

    test('complete shopping flow: login, add products, checkout and complete order', async ({ page }) => {
        // Step 1: Login
        await loginPage.goto();
        await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);

        // Verify login success
        await expect(page).toHaveURL(/.*inventory/);
        await productsPage.waitForPageLoad();

        const pageTitle = await productsPage.getPageTitle();
        expect(pageTitle).toBe('Products');

        // Step 2: Add multiple products to cart
        const productsToAdd = [
            PRODUCTS.SAUCE_LABS_BACKPACK,
            PRODUCTS.SAUCE_LABS_BIKE_LIGHT,
            PRODUCTS.SAUCE_LABS_BOLT_TSHIRT
        ];

        const initialCartCount = await productsPage.getCartItemCount();

        for (const product of productsToAdd) {
            await productsPage.addProductToCart(product);
        }

        const finalCartCount = await productsPage.getCartItemCount();
        expect(finalCartCount).toBe(initialCartCount + productsToAdd.length);

        // Step 3: Navigate to cart and verify items
        await productsPage.goToCart();
        await expect(page).toHaveURL(/.*cart/);
        await cartPage.waitForPageLoad();

        const cartPageTitle = await cartPage.getPageTitle();
        expect(cartPageTitle).toBe('Your Cart');

        const cartItems = await cartPage.getCartItems();
        expect(cartItems.length).toBe(productsToAdd.length);

        for (const product of productsToAdd) {
            expect(cartItems).toContain(product);
            const isInCart = await cartPage.isItemInCart(product);
            expect(isInCart).toBe(true);
        }

        // Step 4: Remove one item and verify
        const productToRemove = PRODUCTS.SAUCE_LABS_BIKE_LIGHT;
        await cartPage.removeItem(productToRemove);

        const updatedCartItems = await cartPage.getCartItems();
        expect(updatedCartItems.length).toBe(productsToAdd.length - 1);
        expect(updatedCartItems).not.toContain(productToRemove);

        const isRemovedItemInCart = await cartPage.isItemInCart(productToRemove);
        expect(isRemovedItemInCart).toBe(false);

        const finalCartCountAfterRemoval = await productsPage.getCartItemCount();
        expect(finalCartCountAfterRemoval).toBe(productsToAdd.length - 1);

        // Step 5: Navigate to Checkout Information
        await cartPage.proceedToCheckout();
        await checkoutStepOnePage.waitForPageLoad();

        const checkoutInformationTitle = await checkoutStepOnePage.getPageTitle();
        expect(checkoutInformationTitle).toBe('Checkout: Your Information');

        // Fill checkout information
        await checkoutStepOnePage.fillCheckoutInformation(
            CHECKOUT_INFO.VALID.firstName,
            CHECKOUT_INFO.VALID.lastName,
            CHECKOUT_INFO.VALID.postalCode
        );
        await checkoutStepOnePage.clickContinue();

        // Step 6: Verify Checkout Step Two
        await checkoutStepTwoPage.waitForPageLoad();
        const checkoutOverviewTitle = await checkoutStepTwoPage.getPageTitle();
        expect(checkoutOverviewTitle).toBe('Checkout: Overview');

        // Validar que los productos correctos están en el summary
        const summaryItems = await checkoutStepTwoPage.getCartItems();
        expect(summaryItems).toContain(PRODUCTS.SAUCE_LABS_BACKPACK);
        expect(summaryItems).toContain(PRODUCTS.SAUCE_LABS_BOLT_TSHIRT);
        expect(summaryItems).not.toContain(PRODUCTS.SAUCE_LABS_BIKE_LIGHT);

        // Validar cálculo de totales
        const expectedTotal = await checkoutStepTwoPage.calculateExpectedTotal();
        const displayedTotal = await checkoutStepTwoPage.getTotalValue();
        expect(displayedTotal).toBe(expectedTotal);

        // Step 7: Finish checkout
        await checkoutStepTwoPage.clickFinish();

        // Step 8: Verify Checkout Complete Page
        await checkoutCompletePage.waitForPageLoad();
        const completeTitle = await checkoutCompletePage.getPageTitle();
        expect(completeTitle).toBe('Checkout: Complete!');

        const orderCompleted = await checkoutCompletePage.isOrderCompleted();
        expect(orderCompleted).toBe(true);

        const successUrl = await checkoutCompletePage.isSuccessPage();
        expect(successUrl).toBe(true);

        // Step 9: Navigate back home
        await checkoutCompletePage.clickBackHome();
        await expect(page).toHaveURL(/.*inventory/);
    });
});