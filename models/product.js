export class Product {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.price = data.price;
    this.currencyCode = data.currencyCode;
    this.imageUrl = data.imageUrl;
    this.productShipping = data.productShipping;
  }

  static fromJson(json) {
    return new Product({
      id: +json.id,
      title: json.title,
      description: json.description || '',
      price: json.price.amount,
      currencyCode: json.price.currency_code,
      imageUrl: json.images && json.images[0] ? json.images[0].url : '',
      productShipping: json.product_shipping,
    });
  }
}
