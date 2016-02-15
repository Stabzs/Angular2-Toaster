import {Component, Input, DynamicComponentLoader, ChangeDetectorRef} from 'angular2/core';
import {BodyOutputType} from './bodyOutputType';
import {ToasterConfig} from './toaster-config';
import {ToasterService, IClearWrapper} from './toaster.service';
import {Toast} from './toast';

@Component({
    selector: 'toaster-container',
    template: `
        <div id="toast-container" [ngClass]="[toasterconfig.positionClass, toasterconfig.animationClass]" class="ng-animate">
            <div *ngFor="#toast of toasts" class="toast" [ngClass]="toasterconfig.typeClasses[toast.type]" (click)="click(toast)" 
                (mouseover)="stopTimer(toast)" (mouseout)="restartTimer">
                <div *ngIf="toast.showCloseButton" (click)="click(toast, true)" [innerHTML]="toast.closeHtml"></div>
                <i class="toaster-icon" [ngClass]="toasterconfig.iconClasses[toast.type]"></i>
                <div [ngClass]="toast.toasterConfig.titleClass">{{toast.title}}</div>
                <div [ngClass]="toast.toasterConfig.messageClass" [ngSwitch]="toast.bodyOutputType">
                    <div *ngSwitchWhen="bodyOutputType.Component" id="componentBody"></div> 
                    <div *ngSwitchWhen="bodyOutputType.TrustedHtml" [innerHTML]="toast.html"></div>
                    <div *ngSwitchWhen="bodyOutputType.Default">{{toast.body}}</div>
                </div>
            </div>
        </div>
        `
})


export class ToasterContainerComponent {
    private addToastSubscriber: any;
    private clearToastsSubscriber: any;
    private toasterService: ToasterService;
    private dcl: DynamicComponentLoader;
    private changeDetectorRef: ChangeDetectorRef;
    private id: number = 0;

    @Input() toasterconfig: ToasterConfig;

    public toasts: Toast[] = [];
    public bodyOutputType = BodyOutputType;

    constructor(toasterService: ToasterService, dcl: DynamicComponentLoader, changeDetectorRef: ChangeDetectorRef) {
        this.toasterService = toasterService;
        this.dcl = dcl;
        this.changeDetectorRef = changeDetectorRef;
    }

    ngOnInit() {
        this.registerSubscribers();
        if (this.toasterconfig === null || typeof this.toasterconfig === 'undefined') {
            this.toasterconfig = new ToasterConfig();
        }
    }
    
    
    // event handlers
    click(toast: Toast, isCloseButton?: boolean) {
        if (this.toasterconfig.tapToDismiss || (toast.showCloseButton && isCloseButton)) {
            var removeToast = true;
            if (toast.clickHandler) {
                if (typeof toast.clickHandler === "function") {
                    removeToast = toast.clickHandler(toast, isCloseButton);
                } else {
                    throw new Error("The toast click handler is not a callable function.")
                }
            }

            if (removeToast) {
                this.removeToast(toast);
            }
        }
    }

    stopTimer(toast: Toast) {
        if (this.toasterconfig.mouseoverTimerStop) {
            if (toast.timeoutId) {
                window.clearTimeout(toast.timeoutId);
                toast.timeoutId = null;
            }
        }
    }

    restartTimer(toast: Toast) {
        if (this.toasterconfig.mouseoverTimerStop) {
            if (toast.timeoutId) {
                this.configureTimer(toast);
            }
        } else if (toast.timeoutId === null) {
            this.removeToast(toast);
        }
    }
    
    
    // private functions
    private registerSubscribers() {
        this.addToastSubscriber = this.toasterService.addToast.subscribe((toast) => {
            this.addToast(toast);
        });

        this.clearToastsSubscriber = this.toasterService.clearToasts.subscribe((clearWrapper: IClearWrapper) => {
            this.clearToasts(clearWrapper);
        });
    }

    private addToast(toast: Toast) {
        toast.toasterConfig = this.toasterconfig;

        if (toast.toastContainerId && this.toasterconfig.toastContainerId
            && toast.toastContainerId !== this.toasterconfig.toastContainerId) return;

        if (!toast.type) {
            toast.type = this.toasterconfig.defaultTypeClass;
        }

        if (this.toasterconfig.preventDuplicates && this.toasts.length > 0) {
            if (toast.toastId && this.toasts.some(t => t.toastId === toast.toastId)) {
                return;
            } else if (this.toasts.some(t => t.body === toast.body)) {
                return;
            }
        }

        toast.toastId = ++this.id;

        if (toast.showCloseButton === null || typeof toast.showCloseButton === "undefined") {
            if (typeof this.toasterconfig.showCloseButton === "object") {
                toast.showCloseButton = this.toasterconfig.showCloseButton[toast.type];
            } else if (typeof this.toasterconfig.showCloseButton === "boolean") {
                toast.showCloseButton = this.toasterconfig.showCloseButton;
            }
        }

        if (toast.showCloseButton) {
            toast.closeHtml = toast.closeHtml || this.toasterconfig.closeHtml;
        }

        toast.bodyOutputType = toast.bodyOutputType || this.toasterconfig.bodyOutputType;

        if (toast.bodyOutputType === this.bodyOutputType.Component) {
            setTimeout(() => {
                this.dcl.loadAsRoot(toast.body, '#componentBody', null);
                
                // TODO: Necessary per https://github.com/angular/angular/issues/6223
                // until loadAsRoot matches loadIntoLocation behavior
                this.changeDetectorRef.detectChanges();
            }, 0);
        }

        this.configureTimer(toast);

        if (this.toasterconfig.newestOnTop) {
            this.toasts.unshift(toast);
            if (this.isLimitExceeded()) {
                this.toasts.pop();
            }
        } else {
            this.toasts.push(toast);
            if (this.isLimitExceeded()) {
                this.toasts.shift();
            }
        }

        if (toast.onShowCallback) {
            toast.onShowCallback(toast);
        }
    }

    private configureTimer(toast: Toast) {
        var timeout = toast.timeout || this.toasterconfig.timeout;

        if (typeof timeout === "object") timeout = timeout[toast.type];
        if (timeout > 0) {
            toast.timeoutId = window.setTimeout(() => {
                this.removeToast(toast);
            }, timeout);
        }
    }

    private isLimitExceeded() {
        return this.toasterconfig.limit && this.toasts.length > this.toasterconfig.limit;
    }

    private removeToast(toast: Toast) {
        var index = this.toasts.indexOf(toast);
        if (index < 0) return;

        this.toasts.splice(index, 1);
        if (toast.timeoutId) window.clearTimeout(toast.timeoutId);
        if (toast.onHideCallback) toast.onHideCallback(toast);
    }

    private removeAllToasts() {
        for (var i = this.toasts.length - 1; i >= 0; i--) {
            this.removeToast(this.toasts[i]);
        }
    }

    private clearToasts(clearWrapper: IClearWrapper) {
        let toastId = clearWrapper.toastId;
        let toastContainerId = clearWrapper.toastContainerId;

        if (toastContainerId == null || typeof toastContainerId === 'undefined') {
            this.clearToastsAction(toastId);
        } else if (toastContainerId === this.toasterconfig.toastContainerId) {
            this.clearToastsAction(toastId);
        }
    }

    private clearToastsAction(toastId?: number) {
        if (toastId) {
            this.removeToast(this.toasts.find(t => t.toastId === toastId));
        } else {
            this.removeAllToasts();
        }
    }

    ngOnDestroy() {
        this.addToastSubscriber.dispose();
        this.clearToastsSubscriber.dispose();
    }
}