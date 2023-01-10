import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'legacy',
    loadChildren: () =>
      import('./legacy/legacy.module').then((m) => m.LegacyModule),
  },
  {
    path: 'mdc',
    loadChildren: () => import('./mdc/mdc.module').then((m) => m.MdcModule),
  },
  {
    path: '**',
    redirectTo: 'mdc'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
