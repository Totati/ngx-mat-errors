import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegacyComponent } from './legacy.component';

const routes: Routes = [{ path: '', component: LegacyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegacyRoutingModule { }
