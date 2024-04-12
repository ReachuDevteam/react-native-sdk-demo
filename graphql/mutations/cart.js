import {gql} from '@apollo/client';

export const CREATE_CART_MUTATION = gql`
  mutation CreateCart($customerSessionId: String!, $currency: String!) {
    createCart(customerSessionId: $customerSessionId, currency: $currency) {
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
`;

export const UPDATE_CART_MUTATION = gql`
  mutation UpdateCart($cartId: String!, $shippingCountry: String!) {
    updateCart(cartId: $cartId, shipping_country: $shippingCountry) {
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
`;
