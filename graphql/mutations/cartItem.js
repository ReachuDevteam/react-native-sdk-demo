import {gql} from '@apollo/client';

export const CREATE_ITEM_TO_CART = gql`
  mutation CreateItemToCart($cartId: String!, $lineItems: [LineItemInput!]!) {
    createItemToCart(cartId: $cartId, line_items: $lineItems) {
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

export const UPDATE_ITEM_TO_CART = gql`
  mutation UpdateItemToCart(
    $cartId: String!
    $cartItemId: String!
    $shippingId: String
    $qty: Int
  ) {
    updateItemToCart(
      cartId: $cartId
      cartItemId: $cartItemId
      shipping_id: $shippingId
      qty: $qty
    ) {
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

export const REMOVE_ITEM_FROM_CART = gql`
  mutation RemoveItemToCart($cartId: String!, $cartItemId: String!) {
    removeItemToCart(cartId: $cartId, cartItemId: $cartItemId) {
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
