import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast.component';
import { ToasterContainerComponent } from './toaster-container.component';
import { ToasterService } from './toaster.service';
import { TrustHtmlPipe } from './trust-html.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [
        ToastComponent,
        ToasterContainerComponent,
        TrustHtmlPipe
    ],
    exports: [
        ToasterContainerComponent,
        ToastComponent
    ]
})
export class ToasterModule {
    static forRoot(): ModuleWithProviders<ToasterModule> {
        return {
            ngModule: ToasterModule,
            providers: [ToasterService, ToasterContainerComponent]
        }
    }

    static forChild(): ModuleWithProviders<ToasterModule> {
        return {
            ngModule: ToasterModule,
            providers: [ToasterContainerComponent]
        }
    }
 }
