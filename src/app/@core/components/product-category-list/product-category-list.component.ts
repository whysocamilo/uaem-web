import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '@client/core/services/cart.service.ts.service';
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
  @Input() showDesc: boolean;
  constructor(private router: Router, private cartService: CartService) {}

  addToCart($event: IProduct) {
    this.cartService.manageProduct($event);
  }
  showProductDetails($event: IProduct) {
    this.router.navigate(['/products/details', +$event.id]);
  }
}
