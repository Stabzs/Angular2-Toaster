import {Component, Input, ChangeDetectorRef} from '@angular/core';
import {ToasterConfig} from './toaster-config';
import {ToasterService, IClearWrapper} from './toaster.service';
import {Toast} from './toast';
import {ToastComponent} from './toast.component';

@Component({
    selector: 'toaster-container',
    directives: [ToastComponent],
    template: `
        <div id="toast-container" [ngClass]="[toasterconfig.positionClass, toasterconfig.animationClass]" class="ng-animate">
            <div toastComp *ngFor="let toast of toasts" class="toast" [toast]="toast"
                [iconClass]="toasterconfig.iconClasses[toast.type]" 
                [ngClass]="toasterconfig.typeClasses[toast.type]"
                (click)="click(toast)" (clickEvent)="childClick($event)" 
                (mouseover)="stopTimer(toast)" (mouseout)="restartTimer">
            </div>
        </div>
        `//,
    // TODO: use styleUrls once Angular 2 supports the use of relative paths
    // https://github.com/angular/angular/issues/2383
    //styleUrls: ['./toaster.css']
})

export class ToasterContainerComponent {
    private addToastSubscriber: any;
    private clearToastsSubscriber: any;
    private toasterService: ToasterService;
    
    @Input() toasterconfig: ToasterConfig;

    public toasts: Toast[] = [];


    constructor(toasterService: ToasterService, private ref : ChangeDetectorRef) {
        this.toasterService = toasterService;
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
                    console.log("The toast click handler is not a callable function.");
                    return false;
                }
            }

            if (removeToast) {
                this.removeToast(toast);
            }
        }
    }
    
    childClick($event) {
        this.click($event.value.toast, $event.value.isCloseButton);
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
        this.addToastSubscriber = this.toasterService.addToast.subscribe((toast: Toast) => {
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

        if (toast.showCloseButton === null || typeof toast.showCloseButton === "undefined") {
            if (typeof this.toasterconfig.showCloseButton === "object") {
                toast.showCloseButton = this.toasterconfig.showCloseButton[toast.type];
            } else if (typeof this.toasterconfig.showCloseButton === "boolean") {
                toast.showCloseButton = <boolean>this.toasterconfig.showCloseButton;
            }
        }

        if (toast.showCloseButton) {
            toast.closeHtml = toast.closeHtml || this.toasterconfig.closeHtml;
        }

        toast.bodyOutputType = toast.bodyOutputType || this.toasterconfig.bodyOutputType;

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
        var timeout = (typeof toast.timeout === "number") 
            ? toast.timeout : this.toasterconfig.timeout;

        if (typeof timeout === "object") timeout = timeout[toast.type];
        if (timeout > 0) {
            toast.timeoutId = window.setTimeout(() => {
                this.ref.markForCheck();
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
        if (toast.timeoutId) {
            window.clearTimeout(toast.timeoutId);
            toast.timeoutId = null;
        }
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

        if (toastContainerId === null || typeof toastContainerId === 'undefined') {
            this.clearToastsAction(toastId);
        } else if (toastContainerId === this.toasterconfig.toastContainerId) {
            this.clearToastsAction(toastId);
        }
    }

    private clearToastsAction(toastId?: string) {
        if (toastId) {
            this.removeToast(this.toasts.filter(t => t.toastId === toastId)[0]);
        } else {
            this.removeAllToasts();
        }
    }

    ngOnDestroy() {
        if(this.addToastSubscriber) { this.addToastSubscriber.unsubscribe(); }
        if(this.clearToastsSubscriber) { this.clearToastsSubscriber.unsubscribe(); }
    }
}
