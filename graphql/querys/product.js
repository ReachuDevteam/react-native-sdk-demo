import {gql} from '@apollo/client';

export const CHANNEL_GET_PRODUCTS_QUERY = gql`
  query GetProducts($currency: String, $imageSize: ImageSize) {
    Channel {
      GetProducts(currency: $currency, image_size: $imageSize) {
        id
        title
        description
        tags
        sku
        quantity
        price {
          amount
          currency_code
          compare_at
        }
        variants {
          id
          barcode
          quantity
          sku
          title
        }
        barcode
        options {
          id
          name
          order
          values
        }
        categories {
          id
          name
        }
        images {
          id
          url
          width
          height
          order
        }
        product_shipping {
          id
          name
          description
          custom_price_enabled
          default
          shipping_country {
            id
            amount
            country
            currency_code
          }
        }
        supplier
        imported_product
        referral_fee
        options_enabled
        digital
        origin
        return {
          return_right
          return_label
          return_cost
          supplier_policy
          return_address {
            same_as_business
            same_as_warehouse
            country
            timezone
            address
            address_2
            post_code
            return_city
          }
        }
      }
    }
  }
`;

export const CHANNEL_GET_PRODUCT_QUERY = gql`
  query GetProduct(
    $currency: String
    $imageSize: ImageSize
    $sku: String
    $barcode: String
    $productId: Int
  ) {
    Channel {
      GetProduct(
        currency: $currency
        image_size: $imageSize
        sku: $sku
        barcode: $barcode
        product_id: $productId
      ) {
        id
        title
        description
        tags
        sku
        quantity
        price {
          amount
          currency_code
          compare_at
        }
        variants {
          id
          barcode
          quantity
          sku
          title
        }
        barcode
        options {
          id
          name
          order
          values
        }
        categories {
          id
          name
        }
        images {
          id
          url
          width
          height
          order
        }
        product_shipping {
          id
          name
          description
          custom_price_enabled
          default
          shipping_country {
            id
            amount
            country
            currency_code
          }
        }
        supplier
        imported_product
        referral_fee
        options_enabled
        digital
        origin
        return {
          return_right
          return_label
          return_cost
          supplier_policy
          return_address {
            same_as_business
            same_as_warehouse
            country
            timezone
            address
            address_2
            post_code
            return_city
          }
        }
      }
    }
  }
`;
