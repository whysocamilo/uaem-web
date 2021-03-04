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
          import('./inicio/inicio.module').then(
            (m) => m.InicioModule
          ),
      },
      {
        path: 'contacto',
        loadChildren: () =>
          import('./contacto/contacto.module').then(
            (m) => m.ContactoModule
          ),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
