import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.scss']
})
export class ProductCategoryListComponent implements OnInit {
  @Input() title = 'titulo de la categoria';
  @Input() productsList: Array<IProduct> = [];
  constructor() { }

  ngOnInit(): void {
  }

}
