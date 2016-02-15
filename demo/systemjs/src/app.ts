import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser'
import {BodyOutputType, Toast, ToasterConfig, ToasterService, ToasterContainerComponent} from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'test-component',
    template: `
        <div>loaded via component</div>
        `
})

class TestComponent {}


@Component({
    selector: 'root',
    directives: [ToasterContainerComponent],
    providers: [ToasterService],
    template: `
        <toaster-container ></toaster-container>
        <button (click)="popToastFromObject()">pop toast from object</button><br/>
        <button (click)="popToastFromArgs()">pop toast from args</button><br/>
        <button (click)="clearAll()">Clear All</button><br/>
        `
})

export class Root{
    private toasterService: ToasterService;
    
    constructor(toasterService: ToasterService) {
        this.toasterService = toasterService;    
    }
    
    public toasterconfig : ToasterConfig = new ToasterConfig({showCloseButton: true, tapToDismiss: false, timeout: 0});
    
    popToastFromObject() {
        var toast: Toast = {
            type: 'info',
            title: 'Test Title',
            body: 'Test Body',
            onHideCallback: () => console.log(toast.title + ' was closed!')
        }
        
        var toast2: Toast = {
            type: 'success', 
            title: 'Yay',
            body: TestComponent,
            bodyOutputType: BodyOutputType.Component
        }
        
        var toast3: Toast = {
            type: 'success',
            title: 'close button',
            showCloseButton: true
        };
        
        this.toasterService.pop(toast);
        this.toasterService.pop(toast2);
        this.toasterService.pop(toast3);
    }
    
    popToastFromArgs() {
        this.toasterService.pop('success', 'Args Title', 'Args Body');
        this.toasterService.pop('warning', 'Args Title', 'Args Body');
        this.toasterService.pop('error', 'Args Title', 'Args Body');
        this.toasterService.pop('wait', 'Args Title', 'Args Body');
    }
    
    clearAll() {
        this.toasterService.clear();
    }
}

bootstrap(Root)