import { NgModule } from '@angular/core';
import {LayoutComponent} from "../layout/layout.component";
import {HomeModule} from './home/home.module';
import {HomeComponent} from './home/home/home.component';
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";

const routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', loadChildren: './users/users.module#UsersModule' }
    ],
  },
  {
    path: 'home', component: HomeComponent
  }
];

@NgModule({
  imports: [
    HomeModule,
    SharedModule,
    RouterModule.forRoot(routes),
  ],
  declarations: [
  ],
  exports: [
    RouterModule
  ]
})
export class RoutesModule { }
