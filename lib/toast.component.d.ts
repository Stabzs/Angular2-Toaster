import { ComponentFactoryResolver, ViewContainerRef, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Toast } from './toast';
export declare class ToastComponent {
    private resolver;
    private sanitizer;
    toast: Toast;
    iconClass: string;
    componentBody: ViewContainerRef;
    safeCloseHtml: SafeHtml;
    private bodyOutputType;
    clickEvent: EventEmitter<{}>;
    constructor(resolver: ComponentFactoryResolver, sanitizer: DomSanitizer);
    ngOnInit(): void;
    click(event: any, toast: Toast): void;
}
