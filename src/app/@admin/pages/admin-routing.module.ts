import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@core/guards/admin.guard';
import { AdminComponent } from './admin.component';
// Las rutas para el panel de control del admin
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./panel/panel.module').then((m) => m.PanelModule),
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./usuarios/usuarios.module').then((m) => m.UsuariosModule),
      },
      {
        path: 'genres',
        loadChildren: () => import('./genres/genres.module').then(m => m.GenresModule)
      },
      {
        path: 'tags',
        loadChildren: () => import('./tags/tags.module').then(m => m.TagsModule)
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
