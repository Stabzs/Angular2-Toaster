import {Component, Input, Output, EventEmitter} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {BodyOutputType, Toast, ToasterConfig, ToasterService, ToasterContainerComponent}
from 'angular2-toaster/angular2-toaster';


@Component({
    selector: 'test-component',
    template: `<div>loaded via component</div>`
})

class TestComponent { }

@Component({
    selector: 'test-component2',
    template: `<div>loaded via component 2</div>`
})

class TestComponent2 { }

@Component({
    selector: 'action-component',
    template: `
        <div>Stabzs wants to speak.  Open Mic?</div>
        <div>Mic is {{micStatus ? 'Open' : 'Closed'}}
        <div>
            <button (click)="open()">Open</button>
            <button (click)="close()">Close</button>
        </div>`
})

class TestComponent3 {
    public micStatus: boolean = false;
    open() { this.micStatus = true; }
    close() { this.micStatus = false; }
}


@Component({
    selector: 'trusted-html',
    template: `
        <div>Allow {{name}} to speak?</div>
        <div>
            <button (click)="onMicOpen.emit([uuid, true])">Open</button>
            <button (click)="onMicOpen.emit([uuid, false])">Close</button>
        </div>`
})

class TestComponent4 {
    @Input() name: string;
    @Input() uuid: string;
    @Output() onMicOpen: EventEmitter<any> = new EventEmitter();
}


@Component({
    selector: 'root',
    directives: [ToasterContainerComponent, TestComponent4],
    providers: [ToasterService],
    template: `
        <toaster-container [toasterconfig]="config1"></toaster-container>
        <toaster-container [toasterconfig]="config2"></toaster-container>
        <button (click)="popToastFromObject()">pop toast from object</button><br/>
        <button (click)="popToastFromArgs()">pop toast from args</button><br/>
        <button (click)="popAsyncToastFromArgs()">pop async toast from args</button><br/>
        <button (click)="popTwoContainers()">pop toast to two containers</button><br/>
        <button (click)="popTwoContainersAsync()">pop toast to two containers async</button><br/>
        <button (click)="popToastWithActionComponent()">pop toast with action component</button><br/>
        <button (click)="popToastWithTrustedHtml()">pop toast with trusted html</button><br/>
        <button (click)="popClickHandler()">pop toast with click handler</button><br/>
        <button (click)="clearAll()">Clear All</button><br/>
        `
})

export class Root {
    private toasterService: ToasterService;

    constructor(toasterService: ToasterService) {
        this.toasterService = toasterService;
    }

    public config1: ToasterConfig = new ToasterConfig({
        showCloseButton: true, tapToDismiss:
        false, timeout: 0, toastContainerId: 1
    });
    public config2: ToasterConfig = new ToasterConfig({
        tapToDismiss:
        true, showCloseButton: false, toastContainerId: 2, positionClass: 'toast-top-center'
    });

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

        var toast4: Toast = {
            type: 'warning',
            title: 'Comp 2',
            body: TestComponent2,
            bodyOutputType: BodyOutputType.Component
        }

        console.log(this.toasterService.pop(toast));
        console.log(this.toasterService.pop(toast2));
        console.log(this.toasterService.pop(toast3));
        console.log(this.toasterService.pop(toast4));
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

    popToastWithActionComponent() {
        var toast: Toast = {
            type: 'info',
            title: 'Mic Request',
            showCloseButton: true,
            body: TestComponent3,
            toastContainerId: 1,
            bodyOutputType: BodyOutputType.Component
        }

        this.toasterService.pop(toast);
    }

    popToastWithTrustedHtml() {
        var toast: Toast = {
            type: 'info',
            title: 'Mic Request',
            showCloseButton: true,
            body: '<h4>Test with html</h4>',
            toastContainerId: 1,
            bodyOutputType: BodyOutputType.TrustedHtml
        }
        this.toasterService.pop(toast);
    }

    popClickHandler() {
        let toast: Toast = {
            type: 'info',
            title: 'Title',
            body: 'Click here to cancel',
            showCloseButton: true,
            timeout: 9000,

            clickHandler: (toast , isCloseButton) => {
                console.log("isCloseButton : "+isCloseButton);
                return false;
            }   
        };
    
        this.toasterService.pop(toast);
    }

    clearAll() {
        this.toasterService.clear();
    }
}

bootstrap(Root)