import {gql} from '@apollo/client';

export const CHANNEL_GET_PRODUCTS_QUERY = gql`
  query ChannelGetProducts($currency: String, $imageSize: ImageSize) {
    channelGetProducts(currency: $currency, imageSize: $imageSize) {
      id
      title
      description
      tags
      sku
      quantity
      price {
        amount
        currencyCode
        baseAmount
        compareAt
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
      subcategories {
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
      productShipping {
        id
        name
        description
        customPriceEnabled
        default
        shippingCountry {
          id
          amount
          country
          currencyCode
          originalData {
            amount
            currencyCode
            baseAmount
          }
        }
      }
      supplier
      importedProduct
      referralFee
      optionsEnabled
      digital
      origin
      return {
        return_right
        return_label
        return_cost
        supplier_policy
        return_address {
          sameAsBusiness
          sameAsWarehouse
          country
          timezone
          address
          address2
          postCode
          returnCity
        }
      }
    }
  }
`;

export const CHANNEL_GET_PRODUCT_QUERY = gql`
  query ChannelGetProduct(
    $currency: String
    $imageSize: ImageSize
    $productId: Int
  ) {
    channelGetProduct(
      currency: $currency
      imageSize: $imageSize
      productId: $productId
    ) {
      id
      title
      description
      tags
      sku
      quantity
      price {
        amount
        currencyCode
        baseAmount
        compareAt
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
      subcategories {
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
      productShipping {
        id
        name
        description
        customPriceEnabled
        default
        shippingCountry {
          id
          amount
          country
          currencyCode
          originalData {
            amount
            currencyCode
            baseAmount
          }
        }
      }
      supplier
      importedProduct
      referralFee
      optionsEnabled
      digital
      origin
      return {
        return_right
        return_label
        return_cost
        supplier_policy
        return_address {
          sameAsBusiness
          sameAsWarehouse
          country
          timezone
          address
          address2
          postCode
          returnCity
        }
      }
    }
  }
`;
