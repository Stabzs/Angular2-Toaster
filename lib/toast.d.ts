import { BodyOutputType } from './bodyOutputType';
import { ToasterConfig } from './toaster-config';
export interface Toast {
    type: string;
    title?: string;
    body?: any;
    toastId?: string;
    toastContainerId?: number;
    onShowCallback?: OnActionCallback;
    onHideCallback?: OnActionCallback;
    timeout?: number;
    timeoutId?: number;
    bodyOutputType?: BodyOutputType;
    clickHandler?: ClickHandler;
    showCloseButton?: boolean;
    closeHtml?: string;
    toasterConfig?: ToasterConfig;
}
export interface ClickHandler {
    (toast: Toast, isCloseButton?: boolean): boolean;
}
export interface OnActionCallback {
    (toast: Toast): void;
}
