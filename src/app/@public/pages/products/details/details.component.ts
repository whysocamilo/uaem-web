import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '@client/core/services/cart.service.ts.service';
import { ICart } from '@client/pages/shopping-cart/shoppin-cart.interface';
import { CURRENCY_SELECT } from '@core/constants/config';
import { ProductsService } from '@core/services/products.service';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { closeAlert, loadData } from '@shared/alerts/alerts';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  product: IProduct;
  // products[Math.floor(Math.random() * products.length)];
  selectImage: string;
  currencySelect = CURRENCY_SELECT;
  randomItems: Array<IProduct> = [];
  screens = [];
  relationalProducts: Array<object> = [];
  loading: boolean;
  constructor(
    private productService: ProductsService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService
  ) {}
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      console.log('parametro detalles', +params.id);
      this.loading = true;
      this.loadDataValue(+params.id);
    });

    this.cartService.itemsVar$.subscribe((data: ICart) => {
      console.log(data);
      if (data.subtotal === 0) {
        this.product.qty = 1;
        return;
      }

      this.product.qty = this.findProduct(+this.product.id).qty;
    });
  }

  findProduct(id: number) {
    return this.cartService.cart.products.find( item => +item.id === id);
  }

  loadDataValue(id: number) {
    this.productService.getItem(id).subscribe((result) => {
      console.log(result);
      this.product = result.product;
      this.selectImage = this.product.img;
      this.screens = result.screens;
      this.relationalProducts = result.relational;
      this.randomItems = result.random;
      this.loading = false;
      closeAlert();
    });
  }
  changeValue(qty: number) {
    this.product.qty = qty;
  }

  selectOtherPlatform($event) {
    console.log($event.target.value);
    this.loadDataValue(+$event.target.value);
  }

  selectImgMain(i: number) {
    this.selectImage = this.screens[i];
  }
  addToCart() {
    this.cartService.manageProduct(this.product);
  }
}
