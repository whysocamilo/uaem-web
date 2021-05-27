import { IProductsPageInfo } from './products-page-info.interface';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IInfoPage } from "@core/interfaces/result-data.interface";
import { ProductsService } from "@core/services/products.service";
import { IProduct } from "@mugan86/ng-shop-ui/lib/interfaces/product.interface";
import { PRODUCTS_PAGES_INFO, TYPE_OPERATION } from "./products.constants";
import { ACTIVE_FILTERS } from '@core/constants/filters';
import { closeAlert, loadData } from '@shared/alerts/alerts';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  selectPage;
  infoPage: IInfoPage = {
    page: 1,
    pages: 8,
    total: 160,
    itemsPage: 8,
  };
  typeData: TYPE_OPERATION;
  ProductsPageInfo: IProductsPageInfo;
  productsList: Array<IProduct> = [];
  loading: boolean;
  constructor(
    private products: ProductsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.loading = true;
      this.ProductsPageInfo = PRODUCTS_PAGES_INFO[`${params.type}/${params.filter}`];
      this.typeData = params.type;
      this.selectPage = 1;
      this.loadData();
    });
  }

  loadData() {
    if (this.typeData === TYPE_OPERATION.PLATFORMS) {
      this.products
        .getByPlatform(
          this.selectPage,
          this.infoPage.itemsPage,
          ACTIVE_FILTERS.ACTIVE,
          false,
          this.ProductsPageInfo.platformsIds,
          true,
          true
        )
        .subscribe((data) => {
          this.asignResult(data);
        });
      return;
    }
    this.products
      .getByLastUnitsOffers(
        this.selectPage,
        this.infoPage.itemsPage,
        ACTIVE_FILTERS.ACTIVE,
        false,
        this.ProductsPageInfo.topPrice,
        this.ProductsPageInfo.stock,
        true,
        true
      )
      .subscribe((data) => {
        this.asignResult(data);
      });
  }
  private asignResult(data) {
    this.productsList = data.result;
    this.infoPage = data.info;
    closeAlert();
    this.loading = false;
  }
}
