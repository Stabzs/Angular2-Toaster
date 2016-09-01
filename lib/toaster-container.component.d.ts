import { ChangeDetectorRef } from '@angular/core';
import { ToasterConfig } from './toaster-config';
import { ToasterService } from './toaster.service';
import { Toast } from './toast';
export declare class ToasterContainerComponent {
    private ref;
    private addToastSubscriber;
    private clearToastsSubscriber;
    private toasterService;
    toasterconfig: ToasterConfig;
    toasts: Toast[];
    constructor(toasterService: ToasterService, ref: ChangeDetectorRef);
    ngOnInit(): void;
    click(toast: Toast, isCloseButton?: boolean): boolean;
    childClick($event: any): void;
    stopTimer(toast: Toast): void;
    restartTimer(toast: Toast): void;
    private registerSubscribers();
    private addToast(toast);
    private configureTimer(toast);
    private isLimitExceeded();
    private removeToast(toast);
    private removeAllToasts();
    private clearToasts(clearWrapper);
    private clearToastsAction(toastId?);
    ngOnDestroy(): void;
}
