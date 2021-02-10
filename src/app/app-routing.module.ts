import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/*establcemos las rutas que va tener nuestra pagina*/
const routes: Routes = [

  {
    //configuramos la ruta vacia para redireccione a una pagina en concreto
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    //configuramos la ruta que no existe para redireccione a una pagina en concreto
    path: '**',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
