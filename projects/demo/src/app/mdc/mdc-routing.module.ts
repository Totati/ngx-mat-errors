import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MdcComponent } from './mdc.component';

const routes: Routes = [{ path: '', component: MdcComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MdcRoutingModule { }
