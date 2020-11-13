import { BodyOutputType } from './bodyOutputType';

export interface Toast {
    type: string;
    title?: string;
    body?: any;
    toastId?: string;
    toastContainerId?: number;
    onShowCallback?: OnActionCallback;
    onHideCallback?: OnActionCallback;
    onClickCallback?: OnActionCallback;
    timeout?: number;
    timeoutId?: number|null;
    bodyOutputType?: BodyOutputType;
    showCloseButton?: boolean;
    closeHtml?: string;
    data?: any;
    tapToDismiss?: boolean;
}

export type OnActionCallback = (toast: Toast) => void;
