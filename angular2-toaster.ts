import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './src/toast.component';
import { ToasterContainerComponent } from './src/toaster-container.component';
import { ToasterService } from './src/toaster.service';

export { ToastComponent } from "./src/toast.component";
export { ToasterContainerComponent } from "./src/toaster-container.component";
export { ToasterService } from "./src/toaster.service";
export { ToasterConfig } from "./src/toaster-config";
export { Toast, ClickHandler, OnActionCallback } from './src/toast'

@NgModule({
    imports: [CommonModule],
    declarations: [ToastComponent, ToasterContainerComponent],
    providers: [ToasterService],
    exports: [ToasterContainerComponent, ToastComponent],
})
export class ToasterModule {}