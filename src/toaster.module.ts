import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast.component';
import { ToasterContainerComponent } from './toaster-container.component';
import { ToasterService } from './toaster.service';


@NgModule({
    imports: [CommonModule],
    declarations: [
        ToastComponent,
        ToasterContainerComponent
    ],
    providers: [ToasterService],
    exports: [
        ToasterContainerComponent,
        ToastComponent
    ]
})
export class ToasterModule { }
