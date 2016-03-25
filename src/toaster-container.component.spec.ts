import {Component, Input, DynamicComponentLoader, ChangeDetectorRef, provide} from 'angular2/core';

import {
describe, expect, it, inject, injectAsync, beforeEach, beforeEachProviders,
TestComponentBuilder, ComponentFixture
} from 'angular2/testing';

import {Toast} from './toast';
import {ToasterService} from './toaster.service';
import {ToasterContainerComponent} from './toaster-container.component';
import {ToasterConfig} from './toaster-config';
import {BodyOutputType} from './bodyOutputType';

// Mock component for bootstrapping <toaster-container></toaster-container>
// Note override to ToasterService injection to allow for isAsync:false
@Component({
    selector: 'test-component',
    template: '<toaster-container [toasterconfig]="toasterconfig"></toaster-container>',
    directives: [ToasterContainerComponent],
    providers: [provide(ToasterService, { useFactory: () => { return new ToasterService(false) } })],
})
export class TestComponent {
    toasterService: ToasterService;

    constructor(toasterService: ToasterService) {
        this.toasterService = toasterService;
    }

    public toasterconfig: ToasterConfig = new ToasterConfig({ showCloseButton: true, tapToDismiss: false, timeout: 0 });
}

// Mock component for testing bodyOutputType Component rendering
@Component({
    selector: 'test-dynamic-component',
    template: `<div>loaded via component</div>`
})
class TestDynamicComponent { }


export function main() {
    describe('ToasterContainerComponent with async ToasterService', () => {
        var toasterService: ToasterService,
            toasterContainer: ToasterContainerComponent,
            dynamicComponentLoader: DynamicComponentLoader,
            changeDetectorRef: ChangeDetectorRef,
            testComponentBuilder: TestComponentBuilder;

        beforeEachProviders(() => [
            ChangeDetectorRef
        ]);

        beforeEach(inject([DynamicComponentLoader, ChangeDetectorRef, TestComponentBuilder],
            (dcl, cdr, tcb) => {
                toasterService = new ToasterService();
                toasterContainer = new ToasterContainerComponent(toasterService, dcl, cdr);
                dynamicComponentLoader = dcl;
                changeDetectorRef = cdr;
                testComponentBuilder = tcb;
            }
        ));


        it('should pop toast asynchronously', () => {
            toasterContainer.ngOnInit();
            toasterService.pop('success', 'test', 'test');

            setTimeout(function() {
                expect(toasterContainer.toasts.length).toBe(1);
            }, 0); 
        });

        it('should clear toast asynchronously', () => {
            toasterContainer.ngOnInit();
            toasterService.pop('success', 'test', 'test');

            setTimeout(function() {
                expect(toasterContainer.toasts.length).toBe(1);
            }, 0);

            toasterService.clear();

            setTimeout(function() {
                expect(toasterContainer.toasts.length).toBe(0);
            }, 0);
        });
    });


    describe('ToasterContainerComponent with sync ToasterService', () => {
        var toasterService: ToasterService,
            toasterContainer: ToasterContainerComponent;

        beforeEachProviders(() => [
            ToasterContainerComponent,
            ToasterService,
            DynamicComponentLoader,
            ChangeDetectorRef
        ]);

        beforeEach(inject([DynamicComponentLoader, ChangeDetectorRef], (dcl, changeDetector) => {
            toasterService = new ToasterService(false);
            toasterContainer = new ToasterContainerComponent(toasterService, dcl, changeDetector);
        }));


        it('should pop toast synchronously', () => {
            toasterContainer.ngOnInit();
            toasterService.pop('success', 'test', 'test');

            expect(toasterContainer.toasts.length).toBe(1);
        });

        it('should clear toast synchronously', () => {
            toasterContainer.ngOnInit();

            toasterService.pop('success', 'test', 'test');
            expect(toasterContainer.toasts.length).toBe(1);

            toasterService.clear();
            expect(toasterContainer.toasts.length).toBe(0);
        });

        it('should not register subscribers until ngOnInit is called', () => {
            toasterService.pop('success', 'test', 'test');
            expect(toasterContainer.toasts.length).toBe(0);

            toasterContainer.ngOnInit();

            toasterService.pop('success', 'test', 'test');
            expect(toasterContainer.toasts.length).toBe(1);
        });

        it('should remove subscribers when ngOnDestroy is called', () => {
            toasterContainer.ngOnInit();

            toasterService.pop('success', 'test', 'test');
            expect(toasterContainer.toasts.length).toBe(1);

            toasterContainer.ngOnDestroy();

            toasterService.pop('success', 'test 2', 'test 2');
            toasterService.clear();
            expect(toasterContainer.toasts.length).toBe(1);
        });

        it('stopTimer should clear timer if mouseOverTimerStop is true', () => {
            toasterContainer.toasterconfig = new ToasterConfig({ mouseoverTimerStop: true, timeout: 100 });
            toasterContainer.ngOnInit();

            toasterService.pop('success', 'test', 'test');
            var toast = toasterContainer.toasts[0];

            expect(toasterContainer.toasterconfig.mouseoverTimerStop).toBe(true);
            expect(toast).toBeDefined();
            expect(toast.timeoutId).toBeDefined();

            toasterContainer.stopTimer(toast);
            expect(toast.timeoutId).toBeNull();
        });

        it('stopTimer should not clear timer if mouseOverTimerStop is false', () => {
            toasterContainer.toasterconfig = new ToasterConfig({ timeout: 100 });
            toasterContainer.ngOnInit();

            toasterService.pop('success', 'test', 'test');
            var toast = toasterContainer.toasts[0];

            expect(toasterContainer.toasterconfig.mouseoverTimerStop).toBe(false);
            expect(toast).toBeDefined();
            expect(toast.timeoutId).toBeDefined();

            toasterContainer.stopTimer(toast);
            expect(toast.timeoutId).toBeDefined();
        });

        it('stopTimer should not clear timer if mouseOverTimerStop is true and timeout is 0', () => {
            toasterContainer.toasterconfig = new ToasterConfig({ mouseoverTimerStop: true, timeout: 0 });
            toasterContainer.ngOnInit();

            toasterService.pop('success', 'test', 'test');
            var toast = toasterContainer.toasts[0];

            expect(toasterContainer.toasterconfig.mouseoverTimerStop).toBe(true);
            expect(toast).toBeDefined();
            expect(toast.timeout).toBeUndefined();
            expect(toast.timeoutId).toBeUndefined();

            toasterContainer.stopTimer(toast);
            expect(toast.timeoutId).toBeUndefined();
        });

        it('restartTimer should restart timer if mouseOverTimerStop is true', () => {
            toasterContainer.toasterconfig = new ToasterConfig({ mouseoverTimerStop: true, timeout: 100 });
            toasterContainer.ngOnInit();

            toasterService.pop('success', 'test', 'test');
            var toast = toasterContainer.toasts[0];

            expect(toasterContainer.toasterconfig.mouseoverTimerStop).toBe(true);
            expect(toast).toBeDefined();
            expect(toast.timeoutId).toBeDefined();

            toasterContainer.restartTimer(toast);
            expect(toast.timeoutId).toBeDefined();
        });

        it('restartTimer should not restart timer if mouseOverTimerStop is true and timeoutId is undefined', () => {
            toasterContainer.toasterconfig = new ToasterConfig({ mouseoverTimerStop: true, timeout: 0 });
            toasterContainer.ngOnInit();

            toasterService.pop('success', 'test', 'test');
            var toast = toasterContainer.toasts[0];

            expect(toasterContainer.toasterconfig.mouseoverTimerStop).toBe(true);
            expect(toast).toBeDefined();
            expect(toast.timeoutId).toBeUndefined();

            toasterContainer.restartTimer(toast);
            expect(toast.timeoutId).toBeUndefined();
        });

        it('restartTimer should not restart timer if mouseOverTimerStop is false', () => {
            toasterContainer.toasterconfig = new ToasterConfig({ timeout: 1 });
            toasterContainer.ngOnInit();

            toasterService.pop('success', 'test', 'test');
            var toast = toasterContainer.toasts[0];

            expect(toasterContainer.toasterconfig.mouseoverTimerStop).toBe(false);
            expect(toast).toBeDefined();
            expect(toast.timeoutId).toBeDefined();

            toasterContainer.restartTimer(toast);

            setTimeout(() => {
                expect(toast.timeoutId).toBeNull();
            }, 2)
        });

        it('restartTimer should remove toast if mouseOverTimerStop is false and timeoutId is null', () => {
            toasterContainer.toasterconfig = new ToasterConfig({ timeout: 0 });
            toasterContainer.ngOnInit();

            toasterService.pop('success', 'test', 'test');
            var toast = toasterContainer.toasts[0];

            expect(toasterContainer.toasterconfig.mouseoverTimerStop).toBe(false);
            expect(toast).toBeDefined();
            expect(toast.timeoutId).toBeUndefined();

            toast.timeoutId = null;
            toasterContainer.restartTimer(toast);
            expect(toasterContainer.toasts.length).toBe(0);
        });

        it('addToast should not add toast if toasterContainerId is provided and it does not match', () => {
            toasterContainer.toasterconfig = new ToasterConfig({ toastContainerId: 2 })
            var toast: Toast = { type: 'success', toastContainerId: 1 };
            toasterContainer.ngOnInit();

            toasterService.pop(toast);

            expect(toasterContainer.toasts.length).toBe(0);
        });

        it('addToast should use defaultTypeClass if type is empty string', () => {
            toasterContainer.ngOnInit();

            toasterService.pop('', '', '');

            expect(toasterContainer.toasterconfig.defaultTypeClass).toBe('toast-info');
            expect(toasterContainer.toasts.length).toBe(1);
            expect(toasterContainer.toasts[0].type).toBe('toast-info');
        });

        it('addToast should not add toast if preventDuplicates and the same toastId exists', () => {
            toasterContainer.toasterconfig = new ToasterConfig({ preventDuplicates: true });
            toasterContainer.ngOnInit();
            var toast: Toast = { type: 'info', toastId: 1 };
            toasterService.pop(toast);

            expect(toasterContainer.toasts.length).toBe(1);
            toasterService.pop(toast);
            expect(toasterContainer.toasts.length).toBe(1);
        });

        it('addToast should not add toast if preventDuplicates and toastId does not exist and the same body exists', () => {
            toasterContainer.toasterconfig = new ToasterConfig({ preventDuplicates: true });
            toasterContainer.ngOnInit();
            var toast: Toast = { type: 'info', body: 'test' };
            var toast2: Toast = { type: 'info', body: 'test2' };
            var toast3: Toast = { type: 'info', body: 'test2' };
            toasterService.pop(toast);

            expect(toasterContainer.toasts.length).toBe(1);
            toasterService.pop(toast2);
            expect(toasterContainer.toasts.length).toBe(2);
            toasterService.pop(toast3);
            expect(toasterContainer.toasts.length).toBe(2);
        });

        it('addToast uses toast.showCloseButton if defined', () => {
            toasterContainer.ngOnInit();
            var toast: Toast = { type: 'info', showCloseButton: true };

            toasterService.pop(toast);
            expect(toasterContainer.toasts[0].showCloseButton).toBe(true);
        });

        it('addToast uses toasterconfig.showCloseButton object if defined and toast.showCloseButton is undefined', () => {
            toasterContainer.toasterconfig = new ToasterConfig({ showCloseButton: { 'info': true } });

            toasterContainer.ngOnInit();
            var toast: Toast = { type: 'info' };
            var toast2: Toast = { type: 'success' };

            toasterService.pop(toast);
            toasterService.pop(toast2);

            var infoToast = toasterContainer.toasts.filter(t => t.type === 'info')[0];
            var successToast = toasterContainer.toasts.filter(t => t.type === 'success')[0];

            expect(infoToast.showCloseButton).toBe(true);
            expect(successToast.showCloseButton).toBeUndefined();
        });

        it('addToast uses toast.showCloseButton if defined', () => {
            toasterContainer.toasterconfig = new ToasterConfig({ showCloseButton: '' });
            toasterContainer.ngOnInit();
            var toast: Toast = { type: 'info' };

            toasterService.pop(toast);
            expect(toasterContainer.toasts[0].showCloseButton).toBeUndefined;
        });

        it('addToast removes toast from bottom if toasterconfig.newestOnTop and limit exceeded', () => {
            toasterContainer.toasterconfig = new ToasterConfig({ limit: 2 });
            toasterContainer.ngOnInit();

            expect(toasterContainer.toasterconfig.newestOnTop).toBe(true);
            expect(toasterContainer.toasterconfig.limit).toBe(2);

            var toast1: Toast = { type: 'info', title: '1', body: '1' };
            var toast2: Toast = { type: 'info', title: '2', body: '2' };
            var toast3: Toast = { type: 'info', title: '3', body: '3' };
            var toast4: Toast = { type: 'info', title: '4', body: '4' };

            toasterService.pop(toast1);
            toasterService.pop(toast2);
            toasterService.pop(toast3);
            toasterService.pop(toast4);
            expect(toasterContainer.toasts.length).toBe(2);
            expect(toasterContainer.toasts[0].title).toBe('4');
            expect(toasterContainer.toasts[0]).toBe(toast4);
        });

        it('addToast removes toast from top if !toasterconfig.newestOnTop and limit exceeded', () => {
            toasterContainer.toasterconfig = new ToasterConfig({ newestOnTop: false, limit: 2 });
            toasterContainer.ngOnInit();

            expect(toasterContainer.toasterconfig.newestOnTop).toBe(false);
            expect(toasterContainer.toasterconfig.limit).toBe(2);

            var toast1: Toast = { type: 'info', title: '1', body: '1' };
            var toast2: Toast = { type: 'info', title: '2', body: '2' };
            var toast3: Toast = { type: 'info', title: '3', body: '3' };
            var toast4: Toast = { type: 'info', title: '4', body: '4' };

            toasterService.pop(toast1);
            toasterService.pop(toast2);
            toasterService.pop(toast3);
            toasterService.pop(toast4);
            expect(toasterContainer.toasts.length).toBe(2);
            expect(toasterContainer.toasts[0].title).toBe('3');
            expect(toasterContainer.toasts[0]).toBe(toast3);
        });

        it('addToast calls onShowCallback if it exists', () => {
            toasterContainer.ngOnInit();

            var toast: Toast = { type: 'info', title: 'default', onShowCallback: (toaster) => toaster.title = 'updated' };
            toasterService.pop(toast);

            expect(toasterContainer.toasts[0].title).toBe('updated');
        });

        it('addToast uses toasterconfig.timeout object if defined and type exists', () => {
            toasterContainer.toasterconfig = new ToasterConfig({ timeout: { 'info': 10 } });

            toasterContainer.ngOnInit();
            var toast: Toast = { type: 'info' };
            var toast2: Toast = { type: 'success' };

            toasterService.pop(toast);
            toasterService.pop(toast2);

            var infoToast = toasterContainer.toasts.filter(t => t.type === 'info')[0];
            var successToast = toasterContainer.toasts.filter(t => t.type === 'success')[0];

            expect(infoToast.timeoutId).toBeDefined();
            expect(successToast.timeoutId).toBeUndefined();
        });

        it('removeToast will not remove the toast if it is not found in the toasters array', () => {
            toasterContainer.ngOnInit();
            var toast: Toast = { type: 'info', toastId: 1 };
            var toast2: Toast = { type: 'success', toastId: 2 };

            toasterService.pop(toast);

            expect(toasterContainer.toasts.length).toBe(1);

            toasterService.clear(toast2.toastId);
            expect(toasterContainer.toasts.length).toBe(1);
        });

        it('removeToast calls onHideCallback if it exists', () => {
            toasterContainer.ngOnInit();

            var status = 'not updated';
            var toast: Toast = { type: 'info', title: 'default', onHideCallback: (toast) => status = 'updated' };
            toasterService.pop(toast);
            toasterService.clear(toast.toastId);

            expect(status).toBe('updated');
        });

        it('clearToasts will clear toasts from all containers if toastContainerId is undefined', () => {
            toasterContainer.ngOnInit();

            var toast: Toast = { type: 'info' };
            toasterService.pop(toast);
            
            expect(toasterContainer.toasts.length).toBe(1);
            
            toasterService.clear(null, undefined);
            expect(toasterContainer.toasts.length).toBe(0);
        });
        
        it('clearToasts will clear toasts from specified container if toastContainerId is number', () => {
            toasterContainer.toasterconfig = new ToasterConfig({toastContainerId: 1});
            toasterContainer.ngOnInit();

            var toast: Toast = { type: 'info', toastContainerId: 1 };
            toasterService.pop(toast);
            
            expect(toasterContainer.toasts.length).toBe(1);
            
            toasterService.clear(null, 1);
            expect(toasterContainer.toasts.length).toBe(0);
        });
        
        it('clearToasts will not clear toasts from specified container if toastContainerId does not match', () => {
            toasterContainer.toasterconfig = new ToasterConfig({toastContainerId: 1});
            toasterContainer.ngOnInit();

            var toast: Toast = { type: 'info', toastContainerId: 1 };
            toasterService.pop(toast);
            
            expect(toasterContainer.toasts.length).toBe(1);
            
            toasterService.clear(null, 2);
            expect(toasterContainer.toasts.length).toBe(1);
        });
    });


    describe('ToasterContainerComponent when included as a component', () => {
        var dynamicComponentLoader: DynamicComponentLoader,
            changeDetectorRef: ChangeDetectorRef,
            testComponentBuilder: TestComponentBuilder;

        let fixture;

        beforeEach(injectAsync([TestComponentBuilder], tcb => {
            return tcb
                .createAsync(TestComponent)
                .then(f => fixture = f)
                .catch(e => expect(e).toBeUndefined());
        }));

        it('should use the bound toasterconfig object if provided', () => {
            fixture.detectChanges();

            expect(fixture.componentInstance).toBeDefined();

            var container = fixture.debugElement.children[0].componentInstance;

            expect(container).toBeDefined();
            expect(container.toasterconfig).toBeDefined();
            expect(container.toasterconfig.showCloseButton).toBe(true);
            expect(container.toasterconfig.tapToDismiss).toBe(false);
            expect(container.toasterconfig.timeout).toBe(0);
        });

        it('should invoke the click event when a toast is clicked but not remove toast if !tapToDismiss', () => {
            fixture.detectChanges();
            var container = fixture.debugElement.children[0].componentInstance;
            expect(container.toasterconfig.tapToDismiss).toBe(false);

            fixture.componentInstance.toasterService.pop('success', 'test', 'test');
            fixture.detectChanges();
            expect(container.toasts.length).toBe(1);

            var toast = fixture.nativeElement.querySelector('div.toast');

            toast.click();
            fixture.detectChanges();
            expect(container.toasts.length).toBe(1);
        });

        it('should invoke the click event when a toast is clicked and remove toast if tapToDismiss', () => {
            fixture.componentInstance.toasterconfig.tapToDismiss = true;
            fixture.detectChanges();
            expect(fixture.componentInstance).toBeDefined();
            var container = fixture.debugElement.children[0].componentInstance;

            expect(container.toasterconfig.tapToDismiss).toBe(true);

            fixture.componentInstance.toasterService.pop('success', 'test', 'test');

            fixture.detectChanges();
            expect(container.toasts.length).toBe(1);

            var toast = fixture.nativeElement.querySelector('div.toast');

            toast.click();
            fixture.detectChanges();
            expect(container.toasts.length).toBe(0);
        });

        it('should invoke the click event when the close button is clicked even if !tapToDismiss', () => {
            fixture.detectChanges();
            var container = fixture.debugElement.children[0].componentInstance;

            expect(container.toasterconfig.tapToDismiss).toBe(false);

            fixture.componentInstance.toasterService.pop('success', 'test', 'test');

            fixture.detectChanges();
            expect(container.toasts.length).toBe(1);

            var toastButton = fixture.nativeElement.querySelector('.toast-close-button');

            toastButton.click();
            fixture.detectChanges();
            expect(container.toasts.length).toBe(0);
        });

        it('should remove toast if clickHandler evaluates to true', () => {
            fixture.detectChanges();
            var container = fixture.debugElement.children[0].componentInstance;
            var toast: Toast = {
                type: 'success', clickHandler: (toast, isCloseButton) => { return true; }
            };

            fixture.componentInstance.toasterService.pop(toast);
            fixture.detectChanges();
            expect(container.toasts.length).toBe(1);

            var toastButton = fixture.nativeElement.querySelector('.toast-close-button');

            toastButton.click();
            fixture.detectChanges();
            expect(container.toasts.length).toBe(0);
        });

        it('should not remove toast if clickHandler evaluates to false', () => {
            fixture.detectChanges();
            var container = fixture.debugElement.children[0].componentInstance;
            var toast: Toast = {
                type: 'success', clickHandler: (toast, isCloseButton) => { return false; }
            };

            fixture.componentInstance.toasterService.pop(toast);
            fixture.detectChanges();
            expect(container.toasts.length).toBe(1);

            var toastButton = fixture.nativeElement.querySelector('.toast-close-button');

            toastButton.click();
            fixture.detectChanges();
            expect(container.toasts.length).toBe(1);
        });

        it('should log error if clickHandler is not a function and not remove toast', () => {
            fixture.detectChanges();
            var container = fixture.debugElement.children[0].componentInstance;
            var toast = { type: 'success', clickHandler: {} };

            fixture.componentInstance.toasterService.pop(toast);
            fixture.detectChanges();
            expect(container.toasts.length).toBe(1);

            var toastButton = fixture.nativeElement.querySelector('.toast-close-button');
            var x = toastButton.click()

            fixture.detectChanges();
            expect(container.toasts.length).toBe(1);
        });

        it('addToast should render component if it exists', () => {
            fixture.detectChanges();
            var container = fixture.debugElement.children[0].componentInstance;
            var toast: Toast = {
                type: 'success',
                title: 'Yay',
                body: TestDynamicComponent,
                bodyOutputType: BodyOutputType.Component
            }

            fixture.componentInstance.toasterService.pop(toast);
            fixture.detectChanges();
            expect(container.toasts.length).toBe(1);

            setTimeout(() => {
                var renderedToast = fixture.nativeElement.querySelector('#componentBody');
                expect(renderedToast.innerHTML).toBe('<div>loaded via component</div>');
            }, 1);
        });
    });
}