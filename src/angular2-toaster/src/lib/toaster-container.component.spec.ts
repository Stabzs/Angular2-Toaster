import { Component, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { Toast, ToastType } from './toast';
import { ToasterService } from './toaster.service';
import { ToasterContainerComponent } from './toaster-container.component';
import { ToasterConfig } from './toaster-config';
import { BodyOutputType } from './bodyOutputType';
import { ToasterModule } from './toaster.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

type ExtendedToastType = ('customtype' | '') & ToastType;

// Mock component for bootstrapping <toaster-container></toaster-container>
@Component({
    selector: 'test-component',
    template: '<toaster-container [toasterconfig]="toasterconfig"></toaster-container>',
})
export class TestComponent {
    toasterService: ToasterService;

    public toasterconfig: ToasterConfig =
        new ToasterConfig({ showCloseButton: true, tapToDismiss: false, timeout: 0, toastContainerId: 1 });
    public toasterconfig2: ToasterConfig =
        new ToasterConfig({ showCloseButton: true, tapToDismiss: false, timeout: 0, toastContainerId: 2 });

    constructor(toasterService: ToasterService) {
        this.toasterService = toasterService;
    }
}
@NgModule({
    imports: [ToasterModule.forRoot(), BrowserAnimationsModule],
    declarations: [TestComponent]
})
export class TestComponentModule { }


// Mock component for testing bodyOutputType Component rendering
@Component({
    selector: 'test-dynamic-component',
    template: `<div>loaded via component</div>`
})
export class TestDynamicComponent { }
@NgModule({
    imports: [ToasterModule.forChild()],
    bootstrap: [TestDynamicComponent],
    declarations: [TestDynamicComponent]
})
export class TestDynamicComponentModule { }

@Component({
    selector: 'bound-dynamic-component',
    template: '<div>{{someValue}} loaded via component<button (click)="clickHandler()" id="click"></button></div>'
})
export class TestBoundDynamicComponent {
    someValue = 'Some value';
    public toast: Toast = null;

    clickHandler() {
        this.toast.title = 'updated title';
    }
}
@NgModule({
    bootstrap: [TestBoundDynamicComponent],
    declarations: [TestBoundDynamicComponent]
})
export class TestBoundDynamicComponentModule { }


describe('ToasterContainerComponent with sync ToasterService', () => {
    let toasterService: ToasterService,
        toasterContainer: ToasterContainerComponent,
        fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [ToasterModule.forRoot(), BrowserModule, BrowserAnimationsModule]
        }).compileComponents();

        fixture = TestBed.createComponent<TestComponent>(TestComponent);
        toasterContainer = fixture.debugElement.children[0].componentInstance;
        toasterService = fixture.componentInstance.toasterService;
        return fixture;
    });


    it('should pop toast synchronously', () => {
        toasterContainer.ngOnInit();
        toasterService.pop('success', 'test', 'test');

        expect(toasterContainer.toasts.length).toBe(1);
    });

    it('should pop toast asynchronously', async (done) => {
        // create test-specific fixture to protect against
        // container being overwritten by other tests since this
        // test now executes fully asynchronously
        const fixtureInstance = TestBed.createComponent<TestComponent>(TestComponent);
        const toasterContainerInstance = fixtureInstance.debugElement.children[0].componentInstance;
        const toasterServiceInstance = fixtureInstance.componentInstance.toasterService;

        fixtureInstance.detectChanges();

        // this will initialize the component.
        // a call to ngOnInit is redundant.
        await fixtureInstance.whenStable();

        toasterServiceInstance.popAsync('success', 'test', 'test')
            .subscribe(toast => {
                expect(toast).toBeDefined();
                expect(toast.type).toBe('success');
                expect(toasterContainerInstance.toasts.length).toBe(1);
                expect(toast.toastId).toBe(toasterContainerInstance.toasts[0].toastId);
                done()
            });
    });

    it('should pop toast asynchronously multiple times', async (done) => {
        // create test-specific fixture to protect against
        // container being overwritten by other tests since this
        // test now executes fully asynchronously
        const fixtureInstance = TestBed.createComponent<TestComponent>(TestComponent);
        const toasterContainerInstance = fixtureInstance.debugElement.children[0].componentInstance;
        const toasterServiceInstance = fixtureInstance.componentInstance.toasterService;

        fixtureInstance.detectChanges();

        // this will initialize the component.
        // a call to ngOnInit is redundant.
        await fixtureInstance.whenStable();

        toasterServiceInstance.popAsync('success', 'test', 'test');
        toasterServiceInstance.popAsync('success', 'test', 'test');
        toasterServiceInstance.popAsync('success', 'test', 'test')
            .subscribe(toast => {
                expect(toast).toBeDefined();
                expect(toast.type).toBe('success');

                let locatedToast;
                for (let i = 0; i < toasterContainerInstance.toasts.length; i++) {
                    if (toasterContainerInstance.toasts[i].toastId === toast.toastId) {
                        locatedToast = toasterContainerInstance.toasts[i];
                        break;
                    }
                }

                expect(locatedToast).toBeDefined();

                done();
            });
    });

    it('should retrieve toast instance from pop observer', () => {
        toasterContainer.ngOnInit();
        let toast: Toast = {
            type: 'success',
            title: 'observer toast'
        };

        expect(toasterContainer.toasts.length).toBe(0);

        toast = toasterService.pop(toast);

        expect(toast).toBeDefined();
        expect(toast.type).toBe(toast.type);
        expect(toast.title).toBe(toast.title);
        expect(toast.toastId).toBe(toasterContainer.toasts[0].toastId);
    });

    it('should clear toast synchronously', () => {
        toasterContainer.ngOnInit();

        toasterService.pop('success', 'test', 'test');
        expect(toasterContainer.toasts.length).toBe(1);

        toasterService.clear();
        expect(toasterContainer.toasts.length).toBe(0);
    });

    it('should throw exception if toast is popped without any subscribers being registered', () => {
        let hasError = false;

        try {
            toasterService.pop('success', 'test', 'test');
        } catch (e) {
            hasError = true;
            expect(e.message).toBe('No Toaster Containers have been initialized to receive toasts.');
        }

        expect(toasterContainer.toasts.length).toBe(0);
        expect(hasError).toBe(true);
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

    it('will not attempt to remove subscribers when ngOnDestroy is called if ngOnInit is not called', () => {
        spyOn(toasterContainer, 'ngOnInit').and.callThrough();
        spyOn(toasterContainer, 'ngOnDestroy').and.callThrough();
        expect(toasterContainer.ngOnInit).not.toHaveBeenCalled();

        toasterContainer.ngOnDestroy();

        expect(toasterContainer.ngOnDestroy).toHaveBeenCalled();
    });

    it('addToast should not add toast if toasterContainerId is provided and it does not match', () => {
        toasterContainer.toasterconfig = new ToasterConfig({ toastContainerId: 2 })
        const toast: Toast = { type: 'success', toastContainerId: 1 };
        toasterContainer.ngOnInit();

        toasterService.pop(toast);

        expect(toasterContainer.toasts.length).toBe(0);
    });

    it('addToast should use defaultTypeClass if type is empty string', () => {
        toasterContainer.ngOnInit();

        toasterService.pop(<ExtendedToastType>'', '', '');

        expect(toasterContainer.toasterconfig.defaultToastType).toBe('info');
        expect(toasterContainer.toasts.length).toBe(1);
        expect(toasterContainer.toasts[0].type).toBe('info');
    });

    it('addToast should not add toast if preventDuplicates and the same toastId exists', () => {
        toasterContainer.toasterconfig = new ToasterConfig({ preventDuplicates: true, toastContainerId: 30 });
        toasterContainer.ngOnInit();
        const toast: Toast = { type: 'info', toastContainerId: 30 };
        toasterService.pop(toast);

        expect(toasterContainer.toasts.length).toBe(1);
        toasterService.pop(toast);
        expect(toasterContainer.toasts.length).toBe(1);
    });

    it('addToast should not add toast if preventDuplicates and toastId does not exist and the same body exists', () => {
        toasterContainer.toasterconfig = new ToasterConfig({ preventDuplicates: true });
        toasterContainer.ngOnInit();
        const toast: Toast = { type: 'info', body: 'test' };
        const toast2: Toast = { type: 'info', body: 'test2' };
        const toast3: Toast = { type: 'info', body: 'test2' };
        toasterService.pop(toast);

        expect(toasterContainer.toasts.length).toBe(1);
        toasterService.pop(toast2);
        expect(toasterContainer.toasts.length).toBe(2);
        toasterService.pop(toast3);
        expect(toasterContainer.toasts.length).toBe(2);
    });

    it('addToast uses toast.showCloseButton if defined', () => {
        toasterContainer.ngOnInit();
        const toast: Toast = { type: 'info', showCloseButton: true };

        toasterService.pop(toast);

        fixture.detectChanges();

        expect(toasterContainer.toasts[0].showCloseButton).toBe(true);
    });

    it('addToast uses toasterconfig.showCloseButton object if defined and toast.showCloseButton is undefined', () => {
        toasterContainer.toasterconfig = new ToasterConfig({ showCloseButton: { 'info': true } });

        toasterContainer.ngOnInit();
        const toast: Toast = { type: 'info' };
        const toast2: Toast = { type: 'success' };

        toasterService.pop(toast);
        toasterService.pop(toast2);

        const infoToast = toasterContainer.toasts.filter(t => t.type === 'info')[0];
        const successToast = toasterContainer.toasts.filter(t => t.type === 'success')[0];

        expect(infoToast.showCloseButton).toBe(true);
        expect(successToast.showCloseButton).toBeUndefined();
    });

    it('addToast uses toast.showCloseButton if defined as an empty string', () => {
        toasterContainer.toasterconfig = new ToasterConfig({ showCloseButton: false });
        (<any>toasterContainer.toasterconfig.showCloseButton) = '';
        toasterContainer.ngOnInit();
        const toast: Toast = { type: 'info' };

        toasterService.pop(toast);
        expect(toasterContainer.toasts[0].showCloseButton).toBeUndefined();
    });

    it('addToast removes toast from bottom if toasterconfig.newestOnTop and limit exceeded', () => {
        toasterContainer.toasterconfig = new ToasterConfig({ limit: 2 });
        toasterContainer.ngOnInit();

        expect(toasterContainer.toasterconfig.newestOnTop).toBe(true);
        expect(toasterContainer.toasterconfig.limit).toBe(2);

        const toast1: Toast = { type: 'info', title: '1', body: '1' };
        const toast2: Toast = { type: 'info', title: '2', body: '2' };
        const toast3: Toast = { type: 'info', title: '3', body: '3' };
        const toast4: Toast = { type: 'info', title: '4', body: '4' };

        toasterService.pop(toast1);
        toasterService.pop(toast2);
        toasterService.pop(toast3);
        toasterService.pop(toast4);
        expect(toasterContainer.toasts.length).toBe(2);
        expect(toasterContainer.toasts[0].title).toBe('4');
        expect(toasterContainer.toasts[0]).toBe(toast4);
    });

    it('addToast will not populate body with TrustedHtml if body is null', () => {
        toasterContainer.toasterconfig = new ToasterConfig();
        toasterContainer.ngOnInit();
        const testSvg = '<svg width="400" height="110"><rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)"></rect></svg>';

        const toast1: Toast = {
            type: 'info',
            title: '1',
            body: testSvg,
            bodyOutputType: BodyOutputType.TrustedHtml
        };

        toasterService.pop(toast1);
        fixture.detectChanges();

        const closeButtonEle = fixture.nativeElement.querySelector('.toast-message');
        expect(closeButtonEle.innerHTML).toContain(testSvg);
    });

    it('addToast will not populate safeCloseHtml if closeHtml is null', () => {
        toasterContainer.toasterconfig = new ToasterConfig();
        toasterContainer.toasterconfig.closeHtml = null;
        toasterContainer.ngOnInit();

        const toast1: Toast = { type: 'info', title: '1', body: '1', showCloseButton: true };

        toasterService.pop(toast1);
        fixture.detectChanges();

        const closeButtonEle = fixture.nativeElement.querySelector('.toast-close-button');
        expect(closeButtonEle.innerHTML).toBe('');
    });

    it('addToast will populate safeCloseHtml with default html', () => {
        toasterContainer.toasterconfig = new ToasterConfig();
        toasterContainer.ngOnInit();

        const toast1: Toast = { type: 'info', title: '1', body: '1', showCloseButton: true };
        toasterService.pop(toast1);

        fixture.detectChanges();

        const closeButtonEle = fixture.nativeElement.querySelector('.toast-close-button');
        expect(closeButtonEle.innerHTML).toBe('<span>×</span>');
    });

    it('addToast removes toast from top if !toasterconfig.newestOnTop and limit exceeded', () => {
        toasterContainer.toasterconfig = new ToasterConfig({ newestOnTop: false, limit: 2 });
        toasterContainer.ngOnInit();

        expect(toasterContainer.toasterconfig.newestOnTop).toBe(false);
        expect(toasterContainer.toasterconfig.limit).toBe(2);

        const toast1: Toast = { type: 'info', title: '1', body: '1' };
        const toast2: Toast = { type: 'info', title: '2', body: '2' };
        const toast3: Toast = { type: 'info', title: '3', body: '3' };
        const toast4: Toast = { type: 'info', title: '4', body: '4' };

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

        const toast: Toast = { type: 'info', title: 'default', onShowCallback: (toaster) => toaster.title = 'updated' };
        toasterService.pop(toast);

        expect(toasterContainer.toasts[0].title).toBe('updated');
    });

    it('removeToast will not remove the toast if it is not found in the toasters array', () => {
        toasterContainer.ngOnInit();
        const toast: Toast = { type: 'info' };

        toasterService.pop(toast);

        expect(toasterContainer.toasts.length).toBe(1);

        toasterService.clear('faketoastid');
        expect(toasterContainer.toasts.length).toBe(1);
    });

    it('removeToast calls onHideCallback if it exists', () => {
        toasterContainer.ngOnInit();

        let status = 'not updated';
        const toast: Toast = { type: 'info', title: 'default', onHideCallback: (toastInstance) => status = 'updated' };
        toasterService.pop(toast);
        toasterService.clear(toast.toastId);

        expect(status).toBe('updated');
    });

    it('removeToast notifies the removeToast subscribers', (done) => {
        toasterContainer.ngOnInit();

        const toast: Toast = { type: 'info', title: 'default' };
        toasterService.pop(toast);

        toasterService.removeToast.subscribe(t => {
            expect(t.toastId).toEqual(toast.toastId);
            expect(t.toastContainerId).toEqual(toast.toastContainerId);
            done();
        });

        toasterService.clear(toast.toastId);
    });

    it('clearToasts will clear toasts from all containers if toastContainerId is undefined', () => {
        toasterContainer.ngOnInit();

        const toast: Toast = { type: 'info' };
        toasterService.pop(toast);

        expect(toasterContainer.toasts.length).toBe(1);

        toasterService.clear(null, undefined);
        expect(toasterContainer.toasts.length).toBe(0);
    });

    it('clearToasts will clear toasts from specified container if toastContainerId is number', () => {
        toasterContainer.toasterconfig = new ToasterConfig({ toastContainerId: 1 });
        toasterContainer.ngOnInit();

        const toast: Toast = { type: 'info', toastContainerId: 1 };
        toasterService.pop(toast);

        expect(toasterContainer.toasts.length).toBe(1);

        toasterService.clear(null, 1);
        expect(toasterContainer.toasts.length).toBe(0);
    });

    it('createGuid should create unique Guids', () => {
        toasterContainer.toasterconfig = new ToasterConfig({ toastContainerId: 1 });
        toasterContainer.ngOnInit();

        let toastIds = [];

        for (let i = 0; i < 10000; i++) {
            const toast = toasterService.pop('success', 'toast');
            toastIds.push(toast.toastId);
            toasterService.clear();
        }

        let valuesSoFar = Object.create(null);
        let dupFound = false;
        for (let i = 0; i < toastIds.length; ++i) {
            const value = toastIds[i];
            if (value in valuesSoFar) {
                dupFound = true;
                break;
            }
            valuesSoFar[value] = true;
        }

        expect(dupFound).toBe(false);

        toastIds = null;
        valuesSoFar = null;
    });

    it('toastIdOrDefault should return empty string if toast.toastId is null', () => {
        let toast: Toast = { type: 'info', toastId: null };
        const toastId = toasterContainer['toastIdOrDefault'](toast);

        expect(toastId).toBe('');
    });

    it('toastIdOrDefault should return empty string if toast.toastId is undefined', () => {
        let toast: Toast = { type: 'info', toastId: undefined };
        const toastId = toasterContainer['toastIdOrDefault'](toast);

        expect(toastId).toBe('');
    });

    it('toastIdOrDefault should return empty string if toast.toastId is empty string', () => {
        let toast: Toast = { type: 'info', toastId: '' };
        const toastId = toasterContainer['toastIdOrDefault'](toast);

        expect(toastId).toBe('');
    });

    it('should use toast.toastId parameter if passed', () => {
        toasterContainer.ngOnInit();

        let toast: Toast = { type: 'success', title: '', body: '', toastId: '12345' };
        toasterService.pop(toast);

        expect(toasterContainer.toasts.length).toBe(1);
        expect(toasterContainer.toasts[0].toastId).toBe('12345');
    });
});


describe('ToasterContainerComponent with sync ToasterService', () => {
    let toasterService: ToasterService,
        toasterContainer: ToasterContainerComponent,
        fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [ToasterModule.forRoot(), BrowserModule, BrowserAnimationsModule]
        });

        fixture = TestBed.createComponent<TestComponent>(TestComponent);
        toasterContainer = fixture.debugElement.children[0].componentInstance;
        toasterService = fixture.componentInstance.toasterService;
        return fixture;
    });

    it('addToast does not populate data if not not defined', () => {
        toasterContainer.toasterconfig = new ToasterConfig();
        toasterContainer.ngOnInit();
        const toast: Toast = { type: 'info' };

        toasterService.pop(toast);
        expect(toasterContainer.toasts[0].data).toBeUndefined();
    });

    it('addToast sets data if type number', () => {
        toasterContainer.toasterconfig = new ToasterConfig();
        toasterContainer.ngOnInit();
        const toast: Toast = { type: 'info', data: 1 };

        toasterService.pop(toast);
        expect(toasterContainer.toasts[0].data).toBe(1);
    });

    it('clearToasts will not clear toasts from specified container if toastContainerId does not match', () => {
        toasterContainer.toasterconfig = new ToasterConfig({ toastContainerId: 1 });
        toasterContainer.ngOnInit();

        const toast: Toast = { type: 'info', toastContainerId: 1 };

        toasterService.pop(toast);

        expect(toasterContainer.toasts.length).toBe(1);

        toasterService.clear(null, 2);
        expect(toasterContainer.toasts.length).toBe(1);
    });
});

describe('ToasterContainerComponent when included as a component', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [ToasterModule.forRoot(), TestDynamicComponentModule, BrowserAnimationsModule]
        });

        fixture = TestBed.createComponent<TestComponent>(TestComponent);
    });

    it('should use the bound toasterconfig object if provided', () => {
        fixture.detectChanges();

        expect(fixture.componentInstance).toBeDefined();

        const container = fixture.debugElement.children[0].componentInstance;

        expect(container).toBeDefined();
        expect(container.toasterconfig).toBeDefined();
        expect(container.toasterconfig.showCloseButton).toBe(true);
        expect(container.toasterconfig.tapToDismiss).toBe(false);
        expect(container.toasterconfig.timeout).toBe(0);
    });

    it('should invoke the click event when a toast is clicked but not remove toast if !tapToDismiss', () => {
        fixture.detectChanges();
        const container = fixture.debugElement.children[0].componentInstance;
        expect(container.toasterconfig.tapToDismiss).toBe(false);

        fixture.componentInstance.toasterService.pop('success', 'test', 'test');
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);

        const toast = fixture.nativeElement.querySelector('div.toast');

        toast.click();
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);
    });

    it('should invoke the click event when a toast is clicked and remove toast if tapToDismiss', () => {
        fixture.componentInstance.toasterconfig.tapToDismiss = true;
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeDefined();
        const container = fixture.debugElement.children[0].componentInstance;

        expect(container.toasterconfig.tapToDismiss).toBe(true);

        fixture.componentInstance.toasterService.pop('success', 'test', 'test');

        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);

        const toast = fixture.nativeElement.querySelector('div.toast');

        toast.click();
        fixture.detectChanges();
        expect(container.toasts.length).toBe(0);
    });

    it('should invoke the click event when the close button is clicked even if !tapToDismiss', () => {
        fixture.detectChanges();
        const container = fixture.debugElement.children[0].componentInstance;

        expect(container.toasterconfig.tapToDismiss).toBe(false);

        fixture.componentInstance.toasterService.pop('success', 'test', 'test');

        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);

        const toastButton = fixture.nativeElement.querySelector('.toast-close-button');

        toastButton.click();
        fixture.detectChanges();

        expect(container.toasts.length).toBe(0);
    });

    it('should call onClickHandler if it exists on toast', () => {
        fixture.detectChanges();
        const container = fixture.debugElement.children[0].componentInstance;
        const toast: Toast = {
            type: 'success', 
            onClickCallback: () => {
                return true;
            },
            tapToDismiss: false
        };

        spyOn(toast, 'onClickCallback');

        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);

        const toastButton = fixture.nativeElement.querySelector('.toast');

        toastButton.click();
        fixture.detectChanges();

        expect(container.toasts.length).toBe(1);
        expect(toast.onClickCallback).toHaveBeenCalled();
    });

    it('should call onClickHandler if it exists on toast before closing toast', () => {
        fixture.detectChanges();
        const container = fixture.debugElement.children[0].componentInstance;
        const toast: Toast = {
            type: 'success', 
            onClickCallback: () => {
                return true;
            },
            tapToDismiss: false
        };

        spyOn(toast, 'onClickCallback');

        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);

        const toastButton = fixture.nativeElement.querySelector('.toast-close-button');

        toastButton.click();
        fixture.detectChanges();

        expect(container.toasts.length).toBe(0);
        expect(toast.onClickCallback).toHaveBeenCalled();
    });

    it('should not call onClickHandler if it does not exist on toast', () => {
        fixture.detectChanges();
        const container = fixture.debugElement.children[0].componentInstance;
        const toast: Toast = {
            type: 'success',
            tapToDismiss: false
        };

        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);

        const toastButton = fixture.nativeElement.querySelector('.toast');

        toastButton.click();
        fixture.detectChanges();
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);
        expect(toast.onClickCallback).not.toBeNull();
    });

    it('addToast should render component if it exists', () => {
        fixture.detectChanges();
        const container = fixture.debugElement.children[0].componentInstance;
        const toast: Toast = {
            type: 'success',
            title: 'Yay',
            body: TestDynamicComponent,
            bodyOutputType: BodyOutputType.Component
        };

        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();

        expect(container.toasts.length).toBe(1);

        const renderedToast = fixture.nativeElement.querySelector('test-dynamic-component');
        expect(renderedToast.innerHTML).toBe('<div>loaded via component</div>');
    });


    it('addToast should render module if it exists', () => {
        fixture.detectChanges();
        const container = fixture.debugElement.children[0].componentInstance;
        const toast: Toast = {
            type: 'success',
            title: 'Yay',
            body: TestDynamicComponent,
            bodyOutputType: BodyOutputType.Component
        };

        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);

        const renderedToast = fixture.nativeElement.querySelector('test-dynamic-component');
        expect(renderedToast.innerHTML).toBe('<div>loaded via component</div>');
    });

    it('addToast should render html passed in toast.body if bodyOutputType is TrustedHtml', () => {
        const textContent = 'here is test text';
        const htmlContent = '<h4>' + textContent + '</h4>';

        fixture.detectChanges();
        const container = fixture.debugElement.children[0].componentInstance;
        const toast: Toast = {
            type: 'success',
            title: 'Yay',
            body: htmlContent,
            bodyOutputType: BodyOutputType.TrustedHtml
        };

        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);

        const renderedToast = fixture.nativeElement.querySelector('.toast-message');
        const innerBody = renderedToast.querySelector('div');
        expect(innerBody.innerHTML).toBe(htmlContent);
        expect(innerBody.textContent).toBe(textContent);
        expect(innerBody.innerHTML).not.toBe(innerBody.textContent);
    });

    it('addToast will not render html if bodyOutputType is TrustedHtml and body is null', () => {
        fixture.detectChanges();
        const container = fixture.debugElement.children[0].componentInstance;
        const toast: Toast = {
            type: 'success',
            title: 'Yay',
            body: null,
            bodyOutputType: BodyOutputType.TrustedHtml
        };

        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);

        const renderedToast = fixture.nativeElement.querySelector('.toast-message');
        const innerBody = renderedToast.querySelector('div');
        expect(innerBody.innerHTML).toBe('');
    });

    it('addToast will render encoded text instead of html if bodyOutputType is Default', () => {
        const textContent = 'here is test text';
        const htmlContent = '<h4>' + textContent + '</h4>';
        const encodedString = '&lt;h4&gt;here is test text&lt;/h4&gt;';

        fixture.detectChanges();
        const container = fixture.debugElement.children[0].componentInstance;
        const toast: Toast = {
            type: 'success',
            title: 'Yay',
            body: htmlContent,
            bodyOutputType: BodyOutputType.Default
        };

        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);

        const renderedToast = fixture.nativeElement.querySelector('.toast-message');
        const innerBody = renderedToast.querySelector('div');
        expect(innerBody.innerHTML).toBe(encodedString);
        expect(innerBody.textContent).toBe(htmlContent);
    });
});

describe('Multiple ToasterContainerComponent components', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [ToasterModule.forRoot(), TestDynamicComponentModule, BrowserAnimationsModule]
        });
        TestBed.overrideComponent(TestComponent,
            {
                set: {
                    template: `<toaster-container [toasterconfig]="toasterconfig"></toaster-container>
                    <toaster-container [toasterconfig]="toasterconfig2"></toaster-container>`
                }
            }
        );

        fixture = TestBed.createComponent<TestComponent>(TestComponent);
    });

    it('should create multiple container instances', () => {
        fixture.componentInstance.toasterconfig.toastContainerId = 1;
        fixture.componentInstance.toasterconfig2.toastContainerId = 2;
        fixture.detectChanges();

        expect(fixture).toBeDefined();
        expect(fixture.componentInstance.toasterconfig).toBeDefined();
        expect(fixture.componentInstance.toasterconfig2).toBeDefined();
    });

    it('should only receive toasts targeted for that container', () => {
        fixture.componentInstance.toasterconfig.toastContainerId = 1;
        fixture.componentInstance.toasterconfig2.toastContainerId = 2;
        fixture.detectChanges();

        const toast1: Toast = {
            type: 'success',
            title: 'fixture 1',
            toastContainerId: 1
        };

        const toast2: Toast = {
            type: 'success',
            title: 'fixture 2',
            toastContainerId: 2
        };

        fixture.componentInstance.toasterService.pop(toast1);
        fixture.componentInstance.toasterService.pop(toast2);

        fixture.detectChanges();

        const container1 = fixture.debugElement.children[0].componentInstance;
        const container2 = fixture.debugElement.children[1].componentInstance;

        expect(container1.toasts.length).toBe(1);
        expect(container2.toasts.length).toBe(1);
        expect(container1.toasts[0].title).toBe('fixture 1');
        expect(container2.toasts[0].title).toBe('fixture 2');
    });
});

describe('ToasterContainerComponent when included as a component with bindings', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [ToasterModule.forRoot(), TestBoundDynamicComponentModule, BrowserAnimationsModule]
        });

        fixture = TestBed.createComponent<TestComponent>(TestComponent);
    });

    it('should use the bound toasterconfig object if provided', () => {
        fixture.detectChanges();

        expect(fixture.componentInstance).toBeDefined();

        const container = fixture.debugElement.children[0].componentInstance;

        expect(container).toBeDefined();
        expect(container.toasterconfig).toBeDefined();
        expect(container.toasterconfig.showCloseButton).toBe(true);
        expect(container.toasterconfig.tapToDismiss).toBe(false);
        expect(container.toasterconfig.timeout).toBe(0);
    });


    it('should render the dynamic bound content', () => {
        fixture.detectChanges();
        const container = fixture.debugElement.children[0].componentInstance;
        const toast: Toast = {
            type: 'success',
            title: 'Yay',
            body: TestBoundDynamicComponent,
            bodyOutputType: BodyOutputType.Component
        };

        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);

        const renderedToast = fixture.nativeElement.querySelector('bound-dynamic-component');
        expect(renderedToast.innerHTML).toBe('<div>Some value loaded via component<button id="click"></button></div>');
    });

    it('should propagate the toast instance to the component', () => {
        fixture.detectChanges();
        const container = fixture.debugElement.children[0].componentInstance;
        const toast: Toast = {
            type: 'success',
            title: 'test',
            body: TestBoundDynamicComponent,
            bodyOutputType: BodyOutputType.Component
        };

        const toastInstance = fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();

        expect(container.toasts.length).toBe(1);
        expect(toastInstance.title).toBe('test');

        const clickButton = fixture.nativeElement.querySelector('#click');
        clickButton.click();

        fixture.detectChanges();

        expect(toastInstance.title).toBe('updated title');
    });
});
