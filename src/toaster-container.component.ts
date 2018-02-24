import { Component, Input, ChangeDetectorRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ToasterConfig } from './toaster-config';
import { ToasterService} from './toaster.service';
import { IClearWrapper } from './clearWrapper';
import { Toast } from './toast';

@Component({
    selector: 'toaster-container',
    template: `
        <div id="toast-container" [ngClass]="[toasterconfig.positionClass]">
            <div toastComp *ngFor="let toast of toasts" class="toast" [toast]="toast"
                [@toastState]="toasterconfig.animation"
                [iconClass]="toasterconfig.iconClasses[toast.type]"
                [titleClass]="toasterconfig.titleClass"
                [messageClass]="toasterconfig.messageClass"
                [ngClass]="toasterconfig.typeClasses[toast.type]"
                (click)="click(toast)" (clickEvent)="childClick($event)"
                (mouseover)="stopTimer(toast)" (mouseout)="restartTimer(toast)">
            </div>
        </div>
        `,
    animations: [
        trigger('toastState', [
            state('flyRight, flyLeft, slideDown, slideUp, fade', style({ opacity: 1, transform: 'translate(0,0)' })),
            transition('void => flyRight', [
                style({
                    opacity: 0, transform: 'translateX(100%)'
                }),
                animate('0.25s ease-in')
            ]),
            transition('flyRight => void', [
                animate('0.25s 10ms ease-out', style({
                    opacity: 0, transform: 'translateX(100%)'
                }))
            ]),
            transition('void => flyLeft', [
                style({
                    opacity: 0, transform: 'translateX(-100%)'
                }),
                animate('0.25s ease-in')
            ]),
            transition('flyLeft => void', [
                animate('0.25s 10ms ease-out', style({
                    opacity: 0, transform: 'translateX(-100%)'
                }))
            ]),
            transition('void => slideDown', [
                style({
                    opacity: 0, transform: 'translateY(-200%)'
                }),
                animate('0.3s ease-in')
            ]),
            transition('slideDown => void', [
                animate('0.3s 10ms ease-out', style({
                    opacity: 0, transform: 'translateY(200%)'
                }))
            ]),
            transition('void => slideUp', [
                style({
                    opacity: 0, transform: 'translateY(200%)'
                }),
                animate('0.3s ease-in')
            ]),
            transition('slideUp => void', [
                animate('0.3s 10ms ease-out', style({
                    opacity: 0, transform: 'translateY(-200%)'
                }))
            ]),
            transition('void => fade', [
                style({
                    opacity: 0,
                }),
                animate('0.3s ease-in')
            ]),
            transition('fade => void', [
                animate('0.3s 10ms ease-out', style({
                    opacity: 0,
                }))
            ])
        ]),
    ]
})

export class ToasterContainerComponent implements OnInit, OnDestroy {
    private addToastSubscriber: any;
    private clearToastsSubscriber: any;
    private toasterService: ToasterService;

    private timeoutIds = new Map<string, number>();

    @Input() toasterconfig: ToasterConfig;

    public toasts: Toast[] = [];

    constructor(toasterService: ToasterService, private ref: ChangeDetectorRef, private ngZone: NgZone) {
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
            let removeToast = true;
            if (toast.clickHandler) {
                if (typeof toast.clickHandler === 'function') {
                    removeToast = toast.clickHandler(toast, isCloseButton);
                } else {
                    console.log('The toast click handler is not a callable function.');
                    return false;
                }
            }

            if (removeToast) {
                this.removeToast(toast);
            }
        }
    }

    childClick($event: any) {
        this.click($event.value.toast, $event.value.isCloseButton);
    }

    stopTimer(toast: Toast) {
        if (this.toasterconfig.mouseoverTimerStop) {
            const toastId = this.toastIdOrDefault(toast);
            const timeoutId = this.timeoutIds.get(toastId);

            if (timeoutId) {
                window.clearTimeout(timeoutId);
                this.timeoutIds.delete(toastId);
            }
        }
    }

    restartTimer(toast: Toast) {
        const timeoutId = this.timeoutIds.get(this.toastIdOrDefault(toast));

        if (this.toasterconfig.mouseoverTimerStop) {
            if (!timeoutId) {
                this.configureTimer(toast);
            }
        } else if (!timeoutId && this.toasterconfig.timeout) {
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
        if (toast.toastContainerId && this.toasterconfig.toastContainerId
            && toast.toastContainerId !== this.toasterconfig.toastContainerId) { return };

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

        if (toast.showCloseButton === null || typeof toast.showCloseButton === 'undefined') {
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
        let timeout = (typeof toast.timeout === 'number')
            ? toast.timeout : this.toasterconfig.timeout;

        if (typeof timeout === 'object') { timeout = timeout[toast.type] };
        if (timeout > 0) {
            this.ngZone.runOutsideAngular(() => {
                const timeoutId = window.setTimeout(() => {
                    this.ngZone.run(() => {
                        this.ref.markForCheck();
                        this.removeToast(toast);
                    });
                }, timeout);

                this.timeoutIds.set(this.toastIdOrDefault(toast), timeoutId);
            });
        }
    }

    private isLimitExceeded() {
        return this.toasterconfig.limit && this.toasts.length > this.toasterconfig.limit;
    }

    private removeToast(toast: Toast) {
        const index = this.toasts.indexOf(toast);
        if (index < 0) { return };

        const toastId = this.toastIdOrDefault(toast);
        const timeoutId = this.timeoutIds.get(toastId);

        this.toasts.splice(index, 1);

        if (timeoutId) {
            window.clearTimeout(timeoutId);
            this.timeoutIds.delete(toastId);
        }
        if (toast.onHideCallback) { toast.onHideCallback(toast); }
        this.toasterService._removeToastSubject.next({ toastId: toastId, toastContainerId: toast.toastContainerId });
    }

    private removeAllToasts() {
        for (let i = this.toasts.length - 1; i >= 0; i--) {
            this.removeToast(this.toasts[i]);
        }
    }

    private clearToasts(clearWrapper: IClearWrapper) {
        const toastId = clearWrapper.toastId;
        const toastContainerId = clearWrapper.toastContainerId;

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

    private toastIdOrDefault(toast: Toast) {
        return toast.toastId || '';
    }

    ngOnDestroy() {
        if (this.addToastSubscriber) { this.addToastSubscriber.unsubscribe(); }
        if (this.clearToastsSubscriber) { this.clearToastsSubscriber.unsubscribe(); }
    }
}
