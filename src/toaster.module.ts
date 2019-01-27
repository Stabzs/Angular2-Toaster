import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast.component';
import { ToasterContainerComponent } from './toaster-container.component';
import { ToasterService } from './toaster.service';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [
        ToastComponent,
        ToasterContainerComponent,
        SanitizeHtmlPipe
    ],
    exports: [
        ToasterContainerComponent,
        ToastComponent
    ]
})
export class ToasterModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ToasterModule,
            providers: [ToasterService, ToasterContainerComponent]
        }
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: ToasterModule,
            providers: [ToasterContainerComponent]
        }
    }
}
