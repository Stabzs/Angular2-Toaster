import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser'
import {BodyOutputType, Toast, ToasterConfig, ToasterService, ToasterContainerComponent} 
    from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'test-component',
    template: `<div>loaded via component</div>`
})

class TestComponent {}


@Component({
    selector: 'root',
    directives: [ToasterContainerComponent],
    providers: [ToasterService],
    template: `
        <toaster-container [toasterconfig]="config1"></toaster-container>
        <toaster-container [toasterconfig]="config2"></toaster-container>
        <button (click)="popToastFromObject()">pop toast from object</button><br/>
        <button (click)="popToastFromArgs()">pop toast from args</button><br/>
        <button (click)="popAsyncToastFromArgs()">pop async toast from args</button><br/>
        <button (click)="popTwoContainers()">pop toast to two containers</button><br/>
        <button (click)="popTwoContainersAsync()">pop toast to two containers async</button><br/>
        <button (click)="clearAll()">Clear All</button><br/>
        `
})

export class Root{
    private toasterService: ToasterService;
    
    constructor(toasterService: ToasterService) {
        this.toasterService = toasterService;    
    }
    
    public config1 : ToasterConfig = new ToasterConfig({showCloseButton: true, tapToDismiss: 
        false, timeout: 0, toastContainerId: 1});
    public config2 : ToasterConfig = new ToasterConfig({tapToDismiss: 
        true, showCloseButton: false, toastContainerId: 2, positionClass: 'toast-top-center'});
    
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
        
        console.log(this.toasterService.pop(toast));
        console.log(this.toasterService.pop(toast2));
        console.log(this.toasterService.pop(toast3));
    }
    
    popToastFromArgs() {
        this.toasterService.pop('success', 'Args Title', 'Args Body');
        this.toasterService.pop('warning', 'Args Title', 'Args Body');
        this.toasterService.pop('error', 'Args Title', 'Args Body');
        this.toasterService.pop('wait', 'Args Title', 'Args Body');
    }
    
    popAsyncToastFromArgs() {
        this.toasterService.popAsync('success', 'Args Title', 'Args Body');
        this.toasterService.popAsync('warning', 'Args Title', 'Args Body');
        this.toasterService.popAsync('error', 'Args Title', 'Args Body');
        this.toasterService.popAsync('wait', 'Args Title', 'Args Body');
    }
    
    popTwoContainers() {
        var containerOneToast1: Toast = {
            type: 'info',
            title: 'Test Title',
            body: 'Test Body - Container One Toast 1',
            toastContainerId: 1
        }
        
        var containerOneToast2: Toast = {
            type: 'info',
            title: 'Test Title',
            body: 'Test Body',
            toastContainerId: 1
        }
        
        var containerTwoToast1: Toast = {
            type: 'info',
            title: 'Test Title',
            body: 'Test Body - Container Two Toast 1',
            toastContainerId: 2
        }
        
        var toast: Toast = {
            type: 'info',
            title: 'Test Title',
            body: 'Test Body - Toast',
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
        
        console.log(this.toasterService.pop(containerOneToast1));
        console.log(this.toasterService.pop(containerOneToast2));    
        console.log(this.toasterService.pop(containerTwoToast1));
        console.log(this.toasterService.pop(toast));
        console.log(this.toasterService.pop(toast2));
        console.log(this.toasterService.pop(toast3));    
    }
    
    popTwoContainersAsync() {
        var containerOneToast1: Toast = {
            type: 'info',
            title: 'Test Title',
            body: 'Test Body - Container One Toast 1',
            toastContainerId: 1
        }
        
        var containerOneToast2: Toast = {
            type: 'info',
            title: 'Test Title',
            body: 'Test Body',
            toastContainerId: 1
        }
        
        var containerTwoToast1: Toast = {
            type: 'info',
            title: 'Test Title',
            body: 'Test Body - Container Two Toast 1',
            toastContainerId: 2
        }
        
        var toast: Toast = {
            type: 'info',
            title: 'Test Title',
            body: 'Test Body - Toast',
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
        
        this.toasterService.popAsync(containerOneToast1).subscribe(t => console.log(t));
        this.toasterService.popAsync(containerOneToast2)
        this.toasterService.popAsync(containerTwoToast1);
        this.toasterService.popAsync(toast); 
        this.toasterService.popAsync(toast2);
        this.toasterService.popAsync(toast3);
    }
    
    clearAll() {
        this.toasterService.clear();
    }
}

bootstrap(Root)