import {gql} from '@apollo/client';

export const CREATE_CHECKOUT = gql`
  mutation CreateCheckout($cartId: String!) {
    createCheckout(cartId: $cartId) {
      createdAt
      updatedAt
      id
      deletedAt
      success_url
      cancel_url
      payment_method
      email
      status
      checkout_url
      origin_payment_id
      total_price
      total_tax
      total_line_items_price
      billing_address {
        id
        first_name
        last_name
        phone_code
        phone
        company
        address1
        address2
        city
        province
        province_code
        country
        country_code
        zip
      }
      shipping_address {
        id
        first_name
        last_name
        phone_code
        phone
        company
        address1
        address2
        city
        province
        province_code
        country
        country_code
        zip
      }
      total_amount_shipping
      availablePaymentMethods {
        name
      }
      discount_code
      total_discount
      cart {
        cart_id
        customer_session_id
        shippingCountry
        line_items {
          id
          supplier
          product_image {
            id
            url
            width
            height
          }
          product_sku
          product_barcode
          product_brand
          product_id
          product_title
          variant_id
          variant_title
          variant {
            option
            value
          }
          quantity
          price {
            amount
            currencyCode
            tax
            discount
            compareAt
          }
          shipping {
            id
            name
            description
            price {
              amount
              currencyCode
            }
          }
        }
        total_amount
        currency
        available_shipping_countries
      }
    }
  }
`;

export const UPDATE_CHECKOUT = gql`
  mutation UpdateCheckout(
    $checkoutId: String!
    $status: String
    $email: String
    $successUrl: String
    $cancelUrl: String
    $paymentMethod: String
    $shippingAddress: AddressArgs
    $billingAddress: AddressArgs
  ) {
    updateCheckout(
      checkoutId: $checkoutId
      status: $status
      email: $email
      success_url: $successUrl
      cancel_url: $cancelUrl
      payment_method: $paymentMethod
      shipping_address: $shippingAddress
      billing_address: $billingAddress
    ) {
      createdAt
      updatedAt
      id
      deletedAt
      success_url
      cancel_url
      payment_method
      email
      status
      checkout_url
      origin_payment_id
      total_price
      total_tax
      total_line_items_price
      billing_address {
        id
        first_name
        last_name
        phone_code
        phone
        company
        address1
        address2
        city
        province
        province_code
        country
        country_code
        zip
      }
      shipping_address {
        id
        first_name
        last_name
        phone_code
        phone
        company
        address1
        address2
        city
        province
        province_code
        country
        country_code
        zip
      }
      total_amount_shipping
      availablePaymentMethods {
        name
      }
      discount_code
      total_discount
      cart {
        cart_id
        customer_session_id
        shippingCountry
        line_items {
          id
          supplier
          product_image {
            id
            url
            width
            height
          }
          product_sku
          product_barcode
          product_brand
          product_id
          product_title
          variant_id
          variant_title
          variant {
            option
            value
          }
          quantity
          price {
            amount
            currencyCode
            tax
            discount
            compareAt
          }
          shipping {
            id
            name
            description
            price {
              amount
              currencyCode
            }
          }
        }
        total_amount
        currency
        available_shipping_countries
      }
    }
  }
`;

export const CHECKOUT_INIT_PAYMENT_KLARNA = gql`
  mutation CheckoutInitPaymentKlarna(
    $checkoutId: String!
    $countryCode: String!
    $href: String!
    $email: String!
  ) {
    checkoutInitPaymentKlarna(
      checkoutId: $checkoutId
      country_code: $countryCode
      href: $href
      email: $email
    ) {
      order_id
      status
      purchase_country
      purchase_currency
      locale
      billing_address {
        given_name
        family_name
        email
        street_address
        postal_code
        city
        country
      }
      shipping_address {
        given_name
        family_name
        email
        street_address
        postal_code
        city
        country
      }
      order_amount
      order_tax_amount
      total_line_items_price
      order_lines {
        type
        name
        quantity
        unit_price
        tax_rate
        total_amount
        total_discount_amount
        total_tax_amount
        merchant_data
      }
      merchant_urls {
        terms
        checkout
        confirmation
        push
      }
      html_snippet
      started_at
      last_modified_at
      options {
        allow_separate_shipping_address
        date_of_birth_mandatory
        require_validate_callback_success
        phone_mandatory
        auto_capture
      }
      shipping_options {
        id
        name
        price
        tax_amount
        tax_rate
        preselected
      }
      merchant_data
      selected_shipping_option {
        id
        name
        price
        tax_amount
        tax_rate
        preselected
      }
    }
  }
`;

export const CHECKOUT_INIT_PAYMENT_STRIPE = gql`
  mutation CheckoutInitPaymentStripe(
    $checkoutId: String!
    $successUrl: String!
    $paymentMethod: String!
    $email: String!
  ) {
    checkoutInitPaymentStripe(
      checkoutId: $checkoutId
      success_url: $successUrl
      payment_method: $paymentMethod
      email: $email
    ) {
      checkout_url
      order_id
    }
  }
`;

export const CHECKOUT_PAYMENT_INTENT_STRIPE = gql`
  mutation CheckoutPaymentIntentStripe($checkoutId: String!) {
    checkoutPaymentIntentStripe(checkoutId: $checkoutId) {
      client_secret
    }
  }
`;
