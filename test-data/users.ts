// test-data/users.ts
export const USERS = {
  STANDARD: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  LOCKED_OUT: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  },
  PROBLEM: {
    username: 'problem_user',
    password: 'secret_sauce'
  },
  PERFORMANCE_GLITCH: {
    username: 'performance_glitch_user',
    password: 'secret_sauce'
  },
  INVALID: {
    username: 'invalid_user',
    password: 'wrong_password'
  }
};

export const PRODUCTS = {
  SAUCE_LABS_BACKPACK: 'Sauce Labs Backpack',
  SAUCE_LABS_BIKE_LIGHT: 'Sauce Labs Bike Light',
  SAUCE_LABS_BOLT_TSHIRT: 'Sauce Labs Bolt T-Shirt',
  SAUCE_LABS_FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
  SAUCE_LABS_ONESIE: 'Sauce Labs Onesie',
  TEST_ALLTHETHINGS_TSHIRT: 'Test.allTheThings() T-Shirt (Red)'
};

export const SORT_OPTIONS = {
  NAME_A_TO_Z: 'az',
  NAME_Z_TO_A: 'za',
  PRICE_LOW_TO_HIGH: 'lohi',
  PRICE_HIGH_TO_LOW: 'hilo'
};

export const ERROR_MESSAGES = {
  LOCKED_OUT_USER: 'Epic sadface: Sorry, this user has been locked out.',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  MISSING_USERNAME: 'Epic sadface: Username is required',
  MISSING_PASSWORD: 'Epic sadface: Password is required'
};

export const CHECKOUT_INFO = {
  VALID: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345'
  },
  INVALID: {
    firstName: '',
    lastName: '',
    postalCode: ''
  },
  PARTIAL_MISSING_FIRST: {
    firstName: '',
    lastName: 'Doe',
    postalCode: '12345'
  },
  PARTIAL_MISSING_LAST: {
    firstName: 'John',
    lastName: '',
    postalCode: '12345'
  },
  PARTIAL_MISSING_POSTAL: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: ''
  }
};

export const CHECKOUT_ERROR_MESSAGES = {
  MISSING_FIRST_NAME: 'Error: First Name is required',
  MISSING_LAST_NAME: 'Error: Last Name is required',
  MISSING_POSTAL_CODE: 'Error: Postal Code is required'
};

export const SUCCESS_MESSAGES = {
  ORDER_COMPLETE_HEADER: 'Thank you for your order!',
  ORDER_COMPLETE_TEXT: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
};
