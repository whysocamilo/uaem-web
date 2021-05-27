import { Component, Input } from '@angular/core';
import { CURRENCIES_SYMBOL, CURRENCY_LIST } from '@mugan86/ng-shop-ui';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';

@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.scss'],
})
export class ProductCategoryListComponent {
  myCurrency = CURRENCIES_SYMBOL[CURRENCY_LIST.MEXICAN_PESO];
  @Input() title = '';
  @Input() productsList: Array<IProduct> = [];
  @Input() description = '';
  constructor() {}
  addToCart($event: IProduct) {
    console.log('Add to cart', $event);
  }
  showProductDetails($event: IProduct) {
    console.log('Shoe details', $event);
  }
}
