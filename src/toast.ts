import {BodyOutputType} from './bodyOutputType';
import {ToasterConfig} from './toaster-config';

export interface Toast {
    type: ToastType;
    title?: string;
    body?: any;
    toastId?: string;
    toastContainerId?: number;
    onShowCallback?: OnActionCallback;
    onHideCallback?: OnActionCallback;
    timeout?: number;
    timeoutId?: number|null;
    bodyOutputType?: BodyOutputType;
    clickHandler?: ClickHandler;
    showCloseButton?: boolean;
    closeHtml?: string;
    data?: any;
}

export type ToastType = 'info' | 'wait' | 'warning' | 'success' | 'error' | string;
export type ClickHandler = (toast: Toast, isCloseButton?: boolean) => boolean;
export type OnActionCallback = (toast: Toast) => void;
