import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopGuard } from '@core/guards/shop.guard';
import { PublicComponent } from './public.component';
// rutas para el menu principal del cliente
const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./inicio/inicio.module').then((m) => m.InicioModule),
      },
      {
        path: 'products/details/:id',
        loadChildren: () =>
          import('./products/details/details.module').then(
            (m) => m.DetailsModule
          ),
      },
      {
        path: 'products/:type/:filter',
        loadChildren: () =>
          import('./products/products.module').then((m) => m.ProductsModule),
      },
      {
        path: 'cart',
        loadChildren: () =>
        import('./shopping-cart/shopping-cart.module').then((m) => m.ShoppingCartModule),
      },
      {
        path: 'checkout',
        loadChildren: () =>
          import('./forms/checkout/checkout.module').then((m) => m.CheckoutModule),
          canActivate: [ShopGuard]
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./orders/orders.module').then((m) => m.OrdersModule),
          canActivate: [ShopGuard]
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./contacto/contacto.module').then((m) => m.ContactoModule),
      },
      {
        path: 'faq',
        loadChildren: () =>
          import('./contacto/faq/faq.module').then((m) => m.FaqModule),
      },
      {
        path: 'terms',
        loadChildren: () =>
          import('./contacto/terminos/terminos.module').then((m) => m.TerminosModule),
      },
      {
        path: 'privacy',
        loadChildren: () =>
          import('./contacto/politicas/politicas.module').then((m) => m.PoliticasModule),
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./forms/login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'register',
        loadChildren: () =>
          import('./forms/register/register.module').then(
            (m) => m.RegisterModule
          ),
      },
      {
        path: 'active/:token',
        loadChildren: () =>
          import('./forms/active/active.module').then((m) => m.ActiveModule),
      },
      {
        path: 'forgot',
        loadChildren: () =>
          import('./forms/forgot/forgot.module').then((m) => m.ForgotModule),
      },
      {
        path: 'reset/:token',
        loadChildren: () =>
          import('./forms/change-password/change-password.module').then(
            (m) => m.ChangePasswordModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
