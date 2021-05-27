import { FormsModule } from '@angular/forms';
import { ProductCategoryListModule } from '@core/components/product-category-list/product-category-list.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ProductCategoryListModule,
    NgbPaginationModule,
    FormsModule
  ]
})
export class ProductsModule { }
