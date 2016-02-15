import { BodyOutputType } from './bodyOutputType';
export declare class ToasterConfig implements IToasterConfig {
    limit: number;
    tapToDismiss: boolean;
    showCloseButton: any;
    closeHtml: string;
    newestOnTop: boolean;
    timeout: number;
    typeClasses: Object;
    iconClasses: Object;
    bodyOutputType: BodyOutputType;
    bodyTemplate: string;
    defaultTypeClass: string;
    positionClass: string;
    animationClass: string;
    titleClass: string;
    messageClass: string;
    preventDuplicates: boolean;
    mouseoverTimerStop: boolean;
    toastContainerId: number;
    constructor(configOverrides?: IToasterConfig);
}
export interface IToasterConfig {
    limit?: number;
    tapToDismiss?: boolean;
    showCloseButton?: any;
    closeHtml?: string;
    newestOnTop?: boolean;
    timeout?: number;
    typeClasses?: Object;
    iconClasses?: Object;
    bodyOutputType?: BodyOutputType;
    bodyTemplate?: string;
    defaultTypeClass?: string;
    positionClass?: string;
    animationClass?: string;
    titleClass?: string;
    messageClass?: string;
    preventDuplicates?: boolean;
    mouseoverTimerStop?: boolean;
    toastContainerId?: number;
}
