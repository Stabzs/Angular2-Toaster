import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home/home.component';

import { ToasterModule } from '@angular2-toaster/angular2-toaster';

const routes: Routes = [
    { path: '', component: HomeComponent } 
];

@NgModule({
    imports: [
        ToasterModule.forChild(),
        RouterModule.forChild(routes)
    ],
    entryComponents: [
    ],
    declarations: [
      HomeComponent
    ],
    exports: [
        RouterModule
    ]
})
export class HomeModule { }