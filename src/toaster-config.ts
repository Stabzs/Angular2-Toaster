import {BodyOutputType} from './bodyOutputType';

export class ToasterConfig implements IToasterConfig {
    limit?: number|null;
    tapToDismiss: boolean;
    showCloseButton: boolean|Object;
    closeHtml: string;
    newestOnTop: boolean;
    timeout: number|Object;
    typeClasses: Object;
    iconClasses: Object;
    bodyOutputType: BodyOutputType;
    bodyTemplate: string;
    defaultTypeClass: string;
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
        this.closeHtml = configOverrides.closeHtml || '<button class="toast-close-button" type="button">&times;</button>';
        this.newestOnTop = configOverrides.newestOnTop != null ? configOverrides.newestOnTop : true;
        this.timeout = configOverrides.timeout != null ? configOverrides.timeout : 5000;
        this.typeClasses = configOverrides.typeClasses || {
            error: 'toast-error',
            info: 'toast-info',
            wait: 'toast-wait',
            success: 'toast-success',
            warning: 'toast-warning'
        };
        this.iconClasses = configOverrides.iconClasses || {
            error: 'icon-error',
            info: 'icon-info',
            wait: 'icon-wait',
            success: 'icon-success',
            warning: 'icon-warning'
        };
        this.bodyOutputType = configOverrides.bodyOutputType || BodyOutputType.Default;
        this.bodyTemplate = configOverrides.bodyTemplate || 'toasterBodyTmpl.html';
        this.defaultTypeClass = configOverrides.defaultTypeClass || 'toast-info';
        this.positionClass = configOverrides.positionClass || 'toast-top-right';
        this.titleClass = configOverrides.titleClass || 'toast-title';
        this.messageClass = configOverrides.messageClass || 'toast-message';
        this.animation = configOverrides.animation || '';
        this.preventDuplicates = configOverrides.preventDuplicates != null ? configOverrides.preventDuplicates : false;
        this.mouseoverTimerStop = configOverrides.mouseoverTimerStop != null ? configOverrides.mouseoverTimerStop : false;
        this.toastContainerId = configOverrides.toastContainerId != null ? configOverrides.toastContainerId : null;
    }
}

export interface IToasterConfig {
    limit?: number|null;
    tapToDismiss?: boolean;
    showCloseButton?: boolean|Object;
    closeHtml?: string;
    newestOnTop?: boolean;
    timeout?: number|Object;
    typeClasses?: Object;
    iconClasses?: Object;
    bodyOutputType?: BodyOutputType;
    bodyTemplate?: string;
    defaultTypeClass?: string;
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
