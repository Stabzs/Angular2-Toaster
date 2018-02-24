import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
    { path: '', component: UsersComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    entryComponents: [
    ],
    declarations: [
        UsersComponent,
    ],
    exports: [
        RouterModule
    ]
})
export class UsersModule { }
