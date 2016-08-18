import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ToastComponent} from './toast.component';
import {ToasterContainerComponent} from './toaster-container.component';
import {ToasterService} from './toaster.service';

@NgModule({
    imports: [BrowserModule],
    declarations: [ToastComponent, ToasterContainerComponent],
    providers: [ToasterService],
    exports: [ToasterContainerComponent, ToastComponent],
})
export class ToastModule {}
