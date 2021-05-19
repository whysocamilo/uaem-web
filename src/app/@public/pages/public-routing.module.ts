import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
        path: 'contacto',
        loadChildren: () =>
          import('./contacto/contacto.module').then((m) => m.ContactoModule),
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./forms/login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'register',
        loadChildren: () => import('./forms/register/register.module').then(m => m.RegisterModule)
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
