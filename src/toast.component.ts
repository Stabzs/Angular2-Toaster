import {
    Component, Input, Output, ViewChild, ViewContainerRef, EventEmitter,
    ComponentFactoryResolver, ChangeDetectorRef, AfterViewInit
} from '@angular/core';
import { Toast } from './toast';
import { BodyOutputType } from './bodyOutputType';

@Component({
    selector: '[toastComp]',
    template: `
        <i class="toaster-icon" [ngClass]="iconClass"></i>
        <div class="toast-content">
            <div [ngClass]="titleClass">{{toast.title}}</div>
            <div [ngClass]="messageClass" [ngSwitch]="toast.bodyOutputType">
                <div *ngSwitchCase="bodyOutputType.Component" #componentBody></div>
                <div *ngSwitchCase="bodyOutputType.TrustedHtml" [innerHTML]="toast.body | sanitizeHtml"></div>
                <div *ngSwitchCase="bodyOutputType.Default">{{toast.body}}</div>
            </div>
        </div>
        <div class="toast-close-button" *ngIf="toast.showCloseButton" (click)="click($event, toast)"
            [innerHTML]="toast.closeHtml | sanitizeHtml">
        </div>`
})

export class ToastComponent implements AfterViewInit {

    @Input() toast: Toast;
    @Input() iconClass: string;
    @Input() titleClass: string;
    @Input() messageClass: string;
    @ViewChild('componentBody', { read: ViewContainerRef }) componentBody: ViewContainerRef;

    public bodyOutputType = BodyOutputType;

    @Output()
    public clickEvent = new EventEmitter();

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngAfterViewInit() {
        if (this.toast.bodyOutputType === this.bodyOutputType.Component) {
            const component = this.componentFactoryResolver.resolveComponentFactory(this.toast.body);
            const componentInstance: any = this.componentBody.createComponent(component, undefined, this.componentBody.injector);
            componentInstance.instance.toast = this.toast;
            this.changeDetectorRef.detectChanges();
        }
    }

    click(event: MouseEvent, toast: Toast) {
        event.stopPropagation();
        this.clickEvent.emit({
            value: { toast: toast, isCloseButton: true }
        });
    }
}
