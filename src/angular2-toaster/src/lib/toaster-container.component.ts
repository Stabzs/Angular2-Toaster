import { 
    Component,
    Input, 
    OnInit,
    OnDestroy 
} from '@angular/core';
import { Transitions } from './transitions';
import { ToasterConfig } from './toaster-config';
import { ToasterService} from './toaster.service';
import { IClearWrapper } from './clearWrapper';
import { Toast } from './toast';

@Component({
    selector: 'toaster-container',
    template: `
        <div class="toast-container" [ngClass]="[toasterconfig.positionClass]">
            <div toastComp *ngFor="let toast of toasts" class="toast" [toast]="toast"
                [toasterconfig]="toasterconfig"
                [@toastState]="toasterconfig.animation"
                [titleClass]="toasterconfig.titleClass"
                [messageClass]="toasterconfig.messageClass"
                [ngClass]="[
                    toasterconfig.iconClasses[toast.type],
                    toasterconfig.typeClasses[toast.type]
                ]"
                (click)="click(toast)" (clickEvent)="childClick($event)"
                (removeToastEvent)="removeToast($event)"
            >
            </div>
        </div>
        `,
    animations: Transitions
})
export class ToasterContainerComponent implements OnInit, OnDestroy {
    private addToastSubscriber: any;
    private clearToastsSubscriber: any;
    private toasterService: ToasterService;

    @Input() toasterconfig: ToasterConfig;

    public toasts: Toast[] = [];

    constructor(toasterService: ToasterService) {
        this.toasterService = toasterService;
    }

    ngOnInit() {
        this.registerSubscribers();
        if (this.isNullOrUndefined(this.toasterconfig)) {
            this.toasterconfig = new ToasterConfig();
        }
    }

    // event handlers
    click(toast: Toast, isCloseButton?: boolean) {
        if (toast.onClickCallback) {
            toast.onClickCallback(toast);
        }

        const tapToDismiss = !this.isNullOrUndefined(toast.tapToDismiss) 
            ? toast.tapToDismiss
            : this.toasterconfig.tapToDismiss;

        if (tapToDismiss || (toast.showCloseButton && isCloseButton)) {
            this.removeToast(toast);
        }
    }

    childClick($event: any) {
        this.click($event.value.toast, $event.value.isCloseButton);
    }

    removeToast(toast: Toast) {
        const index = this.toasts.indexOf(toast);
        if (index < 0) { return };

        const toastId = this.toastIdOrDefault(toast);

        this.toasts.splice(index, 1);

        if (toast.onHideCallback) { toast.onHideCallback(toast); }
        this.toasterService._removeToastSubject.next({ toastId: toastId, toastContainerId: toast.toastContainerId });
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
        if (toast.toastContainerId && this.toasterconfig.toastContainerId
            && toast.toastContainerId !== this.toasterconfig.toastContainerId) { return };

        if (!toast.type 
            || !this.toasterconfig.typeClasses[toast.type]
            || !this.toasterconfig.iconClasses[toast.type]) {
            toast.type = this.toasterconfig.defaultToastType;
        }

        if (this.toasterconfig.preventDuplicates && this.toasts.length > 0) {
            if (toast.toastId && this.toasts.some(t => t.toastId === toast.toastId)) {
                return;
            } else if (this.toasts.some(t => t.body === toast.body)) {
                return;
            }
        }

        if (this.isNullOrUndefined(toast.showCloseButton)) {
            if (typeof this.toasterconfig.showCloseButton === 'object') {
                toast.showCloseButton = this.toasterconfig.showCloseButton[toast.type];
            } else if (typeof this.toasterconfig.showCloseButton === 'boolean') {
                toast.showCloseButton = <boolean>this.toasterconfig.showCloseButton;
            }
        }

        if (toast.showCloseButton) {
            toast.closeHtml = toast.closeHtml || this.toasterconfig.closeHtml;
        }

        toast.bodyOutputType = toast.bodyOutputType || this.toasterconfig.bodyOutputType;

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

    private isLimitExceeded() {
        return this.toasterconfig.limit && this.toasts.length > this.toasterconfig.limit;
    }

    private removeAllToasts() {
        for (let i = this.toasts.length - 1; i >= 0; i--) {
            this.removeToast(this.toasts[i]);
        }
    }

    private clearToasts(clearWrapper: IClearWrapper) {
        const toastId = clearWrapper.toastId ;
        const toastContainerId = clearWrapper.toastContainerId;

        if (this.isNullOrUndefined(toastContainerId) || (toastContainerId === this.toasterconfig.toastContainerId)) {
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

    private toastIdOrDefault(toast: Toast) {
        return toast.toastId || '';
    }

    private isNullOrUndefined(value: any): boolean {
        return value === null || typeof value === 'undefined';
    }

    ngOnDestroy() {
        if (this.addToastSubscriber) { this.addToastSubscriber.unsubscribe(); }
        if (this.clearToastsSubscriber) { this.clearToastsSubscriber.unsubscribe(); }
    }
}
