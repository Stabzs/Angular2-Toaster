import {NgModule, Component} from '@angular/core';
import { ToasterService, IToasterConfig, ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app',
  template: `
    <div id="main" role="main">    
        <toaster-container [toasterconfig]="appToasterConfig"></toaster-container>
        <input type="button" value="pop toast" (click)="popToast()" />
        <input type="button" value="clear all" (click)="clear()" />
    </div>
  `
})
export class AppComponent {
    private toasterService: ToasterService;
    private appToasterConfig: IToasterConfig = new ToasterConfig({
        animation: 'fade', newestOnTop: false
    });

    constructor(toasterService: ToasterService) {
        this.toasterService = toasterService;    
    }
    
    ngAfterViewInit() {
        this.toasterService.pop('success', 'Args Title', 'Args Body');
    }
    
    popToast() {
        this.toasterService.pop('info', 'Toast', 'Popped from click');
    }

    clear() {
        this.toasterService.clear();
    }
}
