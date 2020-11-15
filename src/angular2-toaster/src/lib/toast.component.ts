import {
    Component, Input, Output, ViewChild, ViewContainerRef, EventEmitter,
    ComponentFactoryResolver, ChangeDetectorRef, OnInit, AfterViewInit
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Toast } from './toast';
import { BodyOutputType } from './bodyOutputType';

@Component({
    selector: '[toastComp]',
    template: `
        <div class="toast-content">
            <div [ngClass]="titleClass">{{toast.title}}</div>
            <div [ngClass]="messageClass" [ngSwitch]="toast.bodyOutputType">
                <div *ngSwitchCase="bodyOutputType.Component" #componentBody></div>
                <div *ngSwitchCase="bodyOutputType.TrustedHtml" [innerHTML]="safeBodyHtml"></div>
                <div *ngSwitchCase="bodyOutputType.Default">{{toast.body}}</div>
            </div>
        </div>
        <button class="toast-close-button" *ngIf="toast.showCloseButton" (click)="click($event, toast)"
            [innerHTML]="safeCloseHtml">
        </button>`
})
export class ToastComponent implements OnInit, AfterViewInit {

    @Input() toast: Toast;
    @Input() titleClass: string;
    @Input() messageClass: string;
    @ViewChild('componentBody', { read: ViewContainerRef, static: false }) componentBody: ViewContainerRef;

    safeCloseHtml: SafeHtml;
    safeBodyHtml: SafeHtml;

    public bodyOutputType = BodyOutputType;

    @Output()
    public clickEvent = new EventEmitter();

    constructor(
      private sanitizer: DomSanitizer,
      private componentFactoryResolver: ComponentFactoryResolver,
      private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        if (this.toast.closeHtml) {
            this.safeCloseHtml = this.sanitizer.bypassSecurityTrustHtml(this.toast.closeHtml);
        }
        if (this.toast.bodyOutputType === BodyOutputType.TrustedHtml) {
            this.safeBodyHtml = this.sanitizer.bypassSecurityTrustHtml(this.toast.body);
        }
    }

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
            value : { toast: toast, isCloseButton: true}
        });
    }
}
