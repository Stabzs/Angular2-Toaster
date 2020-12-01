import { Injectable } from '@angular/core';
import { BodyOutputType } from './bodyOutputType';
import { ToastType } from './toast';

export const DefaultTypeClasses : { [key in ToastType]? : string } = {
    error: 'toast-error',
    info: 'toast-info',
    wait: 'toast-wait',
    success: 'toast-success',
    warning: 'toast-warning'
};

export const DefaultIconClasses : { [key in ToastType]? : string } = {
    error: 'icon-error',
    info: 'icon-info',
    wait: 'icon-wait',
    success: 'icon-success',
    warning: 'icon-warning'
};

export interface IToasterConfig {
    limit?: number|null;
    tapToDismiss?: boolean;
    showCloseButton?: boolean|{ [key in ToastType]?: boolean};
    closeHtml?: string;
    newestOnTop?: boolean;
    timeout?: number|{ [key in ToastType]?: number };
    typeClasses?: { [key in ToastType]?: string };
    iconClasses?: { [key in ToastType]?: string };
    bodyOutputType?: BodyOutputType;
    bodyTemplate?: string;
    defaultToastType?: ToastType;
    // Options (see CSS):
    // 'toast-top-full-width', 'toast-bottom-full-width', 'toast-center',
    // 'toast-top-left', 'toast-top-center', 'toast-top-right',
    // 'toast-bottom-left', 'toast-bottom-center', 'toast-bottom-right',
    positionClass?: string;
    titleClass?: string;
    messageClass?: string;
    animation?: string;
    preventDuplicates?: boolean;
    mouseoverTimerStop?: boolean;
    toastContainerId?: number|null;
}

@Injectable()
export class ToasterConfig implements IToasterConfig {
    limit?: number|null;
    tapToDismiss: boolean;
    showCloseButton: boolean|{ [key in ToastType]?: boolean };
    closeHtml: string;
    newestOnTop: boolean;
    timeout: number|{ [key in ToastType]?: number };
    typeClasses: { [key in ToastType]?: string };
    iconClasses: { [key in ToastType]?: string };
    bodyOutputType: BodyOutputType;
    bodyTemplate: string;
    defaultToastType: ToastType;
    // Options (see CSS):
    // 'toast-top-full-width', 'toast-bottom-full-width', 'toast-center',
    // 'toast-top-left', 'toast-top-center', 'toast-top-right',
    // 'toast-bottom-left', 'toast-bottom-center', 'toast-bottom-right',
    positionClass: string;
    titleClass: string;
    messageClass: string;
    animation: string;
    preventDuplicates: boolean;
    mouseoverTimerStop: boolean;
    toastContainerId?: number|null;

    constructor(configOverrides?: IToasterConfig) {
        configOverrides = configOverrides || {};
        this.limit = configOverrides.limit || null;
        this.tapToDismiss = configOverrides.tapToDismiss != null ? configOverrides.tapToDismiss : true;
        this.showCloseButton = configOverrides.showCloseButton != null ? configOverrides.showCloseButton : false;
        this.closeHtml = configOverrides.closeHtml || '<span>&times;</span>';
        this.newestOnTop = configOverrides.newestOnTop != null ? configOverrides.newestOnTop : true;
        this.timeout = configOverrides.timeout != null ? configOverrides.timeout : 5000;
        this.typeClasses = configOverrides.typeClasses || DefaultTypeClasses;
        this.iconClasses = configOverrides.iconClasses || DefaultIconClasses;
        this.bodyOutputType = configOverrides.bodyOutputType || BodyOutputType.Default;
        this.bodyTemplate = configOverrides.bodyTemplate || 'toasterBodyTmpl.html';
        this.defaultToastType = configOverrides.defaultToastType || 'info';
        this.positionClass = configOverrides.positionClass || 'toast-top-right';
        this.titleClass = configOverrides.titleClass || 'toast-title';
        this.messageClass = configOverrides.messageClass || 'toast-message';
        this.animation = configOverrides.animation || '';
        this.preventDuplicates = configOverrides.preventDuplicates != null ? configOverrides.preventDuplicates : false;
        this.mouseoverTimerStop = configOverrides.mouseoverTimerStop != null ? configOverrides.mouseoverTimerStop : false;
        this.toastContainerId = configOverrides.toastContainerId != null ? configOverrides.toastContainerId : null;
    }
}
