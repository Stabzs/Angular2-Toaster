import {Component, Input, ViewChild, ComponentFactoryResolver, ViewContainerRef, EventEmitter}
from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser'

import {Toast} from './toast';
import {BodyOutputType} from './bodyOutputType';

@Component({
    selector: '[toastComp]',
    template: `
        <i class="toaster-icon" [ngClass]="iconClass"></i>
        <div class="toast-content">
            <div [ngClass]="toast.toasterConfig.titleClass">{{toast.title}}</div>
            <div [ngClass]="toast.toasterConfig.messageClass" [ngSwitch]="toast.bodyOutputType">
                <div *ngSwitchCase="bodyOutputType.Component" #componentBody></div>
                <div *ngSwitchCase="bodyOutputType.TrustedHtml" [innerHTML]="toast.body"></div>
                <div *ngSwitchCase="bodyOutputType.Default">{{toast.body}}</div>
            </div>
        </div>
        <div class="toast-close-button" *ngIf="toast.showCloseButton" (click)="click($event, toast)"
            [innerHTML]="safeCloseHtml">
        </div>`,
    outputs: ['clickEvent']
})

export class ToastComponent {

    @Input() toast: Toast;
    @Input() iconClass: string;
    @ViewChild('componentBody', { read: ViewContainerRef }) componentBody: ViewContainerRef;

    safeCloseHtml: SafeHtml;

    private bodyOutputType = BodyOutputType;
    public clickEvent = new EventEmitter();

    constructor(
      private resolver: ComponentFactoryResolver,
      private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        if (this.toast.bodyOutputType === this.bodyOutputType.Component) {
          let factory = this.resolver.resolveComponentFactory(this.toast.body);
          this.componentBody.createComponent(factory, 0, this.componentBody.injector);
        }

        if (this.toast.closeHtml) {
            this.safeCloseHtml = this.sanitizer.bypassSecurityTrustHtml(this.toast.closeHtml);
        }
    }

    click(event, toast: Toast) {
        event.stopPropagation();
        this.clickEvent.emit({
            value : { toast: toast, isCloseButton: true}
        });
    }
}
