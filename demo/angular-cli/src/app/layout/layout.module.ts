import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        SharedModule
    ],
    providers: [
    ],
    declarations: [
        LayoutComponent
    ],
    exports: [
        LayoutComponent
    ]
})
export class LayoutModule { }
