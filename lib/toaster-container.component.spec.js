"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var test_bed_1 = require('@angular/core/testing/test_bed');
var toaster_service_1 = require('./toaster.service');
var toaster_config_1 = require('./toaster-config');
var bodyOutputType_1 = require('./bodyOutputType');
var toaster_module_1 = require('./toaster.module');
var platform_browser_1 = require('@angular/platform-browser');
// Mock component for bootstrapping <toaster-container></toaster-container>
var TestComponent = (function () {
    function TestComponent(toasterService) {
        this.toasterconfig = new toaster_config_1.ToasterConfig({ showCloseButton: true, tapToDismiss: false, timeout: 0, toastContainerId: 1 });
        this.toasterconfig2 = new toaster_config_1.ToasterConfig({ showCloseButton: true, tapToDismiss: false, timeout: 0, toastContainerId: 2 });
        this.toasterService = toasterService;
    }
    TestComponent = __decorate([
        core_1.Component({
            selector: 'test-component',
            template: '<toaster-container [toasterconfig]="toasterconfig"></toaster-container>',
        }), 
        __metadata('design:paramtypes', [toaster_service_1.ToasterService])
    ], TestComponent);
    return TestComponent;
}());
exports.TestComponent = TestComponent;
// Mock component for testing bodyOutputType Component rendering
var TestDynamicComponent = (function () {
    function TestDynamicComponent() {
    }
    TestDynamicComponent = __decorate([
        core_1.Component({
            selector: 'test-dynamic-component',
            template: "<div>loaded via component</div>"
        }), 
        __metadata('design:paramtypes', [])
    ], TestDynamicComponent);
    return TestDynamicComponent;
}());
describe('ToasterContainerComponent with sync ToasterService', function () {
    var toasterService, toasterContainer, fixture;
    beforeEach(function () {
        test_bed_1.TestBed.configureTestingModule({
            declarations: [TestComponent, TestDynamicComponent],
            imports: [toaster_module_1.ToasterModule, platform_browser_1.BrowserModule]
        });
        fixture = test_bed_1.TestBed.createComponent(TestComponent);
        toasterContainer = fixture.debugElement.children[0].componentInstance;
        toasterService = fixture.componentInstance.toasterService;
        return fixture;
    });
    it('should pop toast synchronously', function () {
        toasterContainer.ngOnInit();
        toasterService.pop('success', 'test', 'test');
        expect(toasterContainer.toasts.length).toBe(1);
    });
    it('should pop toast asynchronously', function () {
        toasterContainer.ngOnInit();
        toasterService.popAsync('success', 'test', 'test')
            .subscribe(function (toast) {
            expect(toast).toBeDefined();
            expect(toast.type).toBe('success');
            expect(toasterContainer.toasts.length).toBe(1);
            expect(toast.toastId).toBe(toasterContainer.toasts[0].toastId);
        });
    });
    it('should pop toast asynchronously multiple times', function () {
        toasterContainer.ngOnInit();
        toasterService.popAsync('success', 'test', 'test');
        toasterService.popAsync('success', 'test', 'test');
        toasterService.popAsync('success', 'test', 'test')
            .subscribe(function (toast) {
            expect(toast).toBeDefined();
            expect(toast.type).toBe('success');
            var locatedToast;
            for (var i = 0; i < toasterContainer.toasts.length; i++) {
                if (toasterContainer.toasts[i].toastId === toast.toastId) {
                    locatedToast = toasterContainer.toasts[i];
                    break;
                }
            }
            expect(locatedToast).toBeDefined();
        });
    });
    it('should retrieve toast instance from pop observer', function () {
        toasterContainer.ngOnInit();
        var toast = {
            type: 'success',
            title: 'observer toast'
        };
        expect(toasterContainer.toasts.length).toBe(0);
        var toast = toasterService.pop(toast);
        expect(toast).toBeDefined();
        expect(toast.type).toBe(toast.type);
        expect(toast.title).toBe(toast.title);
        expect(toast.toastId).toBe(toasterContainer.toasts[0].toastId);
    });
    it('should clear toast synchronously', function () {
        toasterContainer.ngOnInit();
        toasterService.pop('success', 'test', 'test');
        expect(toasterContainer.toasts.length).toBe(1);
        toasterService.clear();
        expect(toasterContainer.toasts.length).toBe(0);
    });
    it('should throw exception if toast is popped without any subscribers being registered', function () {
        var hasError = false;
        try {
            toasterService.pop('success', 'test', 'test');
        }
        catch (e) {
            hasError = true;
            expect(e.message).toBe('No Toaster Containers have been initialized to receive toasts.');
        }
        expect(toasterContainer.toasts.length).toBe(0);
        expect(hasError).toBe(true);
    });
    it('should remove subscribers when ngOnDestroy is called', function () {
        toasterContainer.ngOnInit();
        toasterService.pop('success', 'test', 'test');
        expect(toasterContainer.toasts.length).toBe(1);
        toasterContainer.ngOnDestroy();
        toasterService.pop('success', 'test 2', 'test 2');
        toasterService.clear();
        expect(toasterContainer.toasts.length).toBe(1);
    });
    it('will not attempt to remove subscribers when ngOnDestroy is called if ngOnInit is not called', function () {
        spyOn(toasterContainer, 'ngOnInit').and.callThrough();
        spyOn(toasterContainer, 'ngOnDestroy').and.callThrough();
        expect(toasterContainer.ngOnInit).not.toHaveBeenCalled();
        toasterContainer.ngOnDestroy();
        expect(toasterContainer.ngOnDestroy).toHaveBeenCalled();
    });
    it('stopTimer should clear timer if mouseOverTimerStop is true', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ mouseoverTimerStop: true, timeout: 100 });
        toasterContainer.ngOnInit();
        toasterService.pop('success', 'test', 'test');
        var toast = toasterContainer.toasts[0];
        expect(toasterContainer.toasterconfig.mouseoverTimerStop).toBe(true);
        expect(toast).toBeDefined();
        expect(toast.timeoutId).toBeDefined();
        toasterContainer.stopTimer(toast);
        expect(toast.timeoutId).toBeNull();
    });
    it('stopTimer should not clear timer if mouseOverTimerStop is false', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ timeout: 100 });
        toasterContainer.ngOnInit();
        toasterService.pop('success', 'test', 'test');
        var toast = toasterContainer.toasts[0];
        expect(toasterContainer.toasterconfig.mouseoverTimerStop).toBe(false);
        expect(toast).toBeDefined();
        expect(toast.timeoutId).toBeDefined();
        toasterContainer.stopTimer(toast);
        expect(toast.timeoutId).toBeDefined();
    });
    it('stopTimer should not clear timer if mouseOverTimerStop is true and timeout is 0', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ mouseoverTimerStop: true, timeout: 0 });
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
    it('restartTimer should restart timer if mouseOverTimerStop is true', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ mouseoverTimerStop: true, timeout: 100 });
        toasterContainer.ngOnInit();
        toasterService.pop('success', 'test', 'test');
        var toast = toasterContainer.toasts[0];
        expect(toasterContainer.toasterconfig.mouseoverTimerStop).toBe(true);
        expect(toast).toBeDefined();
        expect(toast.timeoutId).toBeDefined();
        toasterContainer.restartTimer(toast);
        expect(toast.timeoutId).toBeDefined();
    });
    it('restartTimer should not restart timer if mouseOverTimerStop is true and timeoutId is undefined', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ mouseoverTimerStop: true, timeout: 0 });
        toasterContainer.ngOnInit();
        toasterService.pop('success', 'test', 'test');
        var toast = toasterContainer.toasts[0];
        expect(toasterContainer.toasterconfig.mouseoverTimerStop).toBe(true);
        expect(toast).toBeDefined();
        expect(toast.timeoutId).toBeUndefined();
        toasterContainer.restartTimer(toast);
        expect(toast.timeoutId).toBeUndefined();
    });
    it('restartTimer should not restart timer if mouseOverTimerStop is false', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ timeout: 1 });
        toasterContainer.ngOnInit();
        toasterService.pop('success', 'test', 'test');
        var toast = toasterContainer.toasts[0];
        expect(toasterContainer.toasterconfig.mouseoverTimerStop).toBe(false);
        expect(toast).toBeDefined();
        expect(toast.timeoutId).toBeDefined();
        toasterContainer.restartTimer(toast);
        setTimeout(function () {
            expect(toast.timeoutId).toBeNull();
        }, 2);
    });
    it('restartTimer should remove toast if mouseOverTimerStop is false and timeoutId is null', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ timeout: 0 });
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
    it('addToast should not add toast if toasterContainerId is provided and it does not match', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ toastContainerId: 2 });
        var toast = { type: 'success', toastContainerId: 1 };
        toasterContainer.ngOnInit();
        toasterService.pop(toast);
        expect(toasterContainer.toasts.length).toBe(0);
    });
    it('addToast should use defaultTypeClass if type is empty string', function () {
        toasterContainer.ngOnInit();
        toasterService.pop('', '', '');
        expect(toasterContainer.toasterconfig.defaultTypeClass).toBe('toast-info');
        expect(toasterContainer.toasts.length).toBe(1);
        expect(toasterContainer.toasts[0].type).toBe('toast-info');
    });
    it('addToast should not add toast if preventDuplicates and the same toastId exists', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ preventDuplicates: true });
        toasterContainer.ngOnInit();
        var toast = { type: 'info' };
        toasterService.pop(toast);
        expect(toasterContainer.toasts.length).toBe(1);
        toasterService.pop(toast);
        expect(toasterContainer.toasts.length).toBe(1);
    });
    it('addToast should not add toast if preventDuplicates and toastId does not exist and the same body exists', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ preventDuplicates: true });
        toasterContainer.ngOnInit();
        var toast = { type: 'info', body: 'test' };
        var toast2 = { type: 'info', body: 'test2' };
        var toast3 = { type: 'info', body: 'test2' };
        toasterService.pop(toast);
        expect(toasterContainer.toasts.length).toBe(1);
        toasterService.pop(toast2);
        expect(toasterContainer.toasts.length).toBe(2);
        toasterService.pop(toast3);
        expect(toasterContainer.toasts.length).toBe(2);
    });
    it('addToast uses toast.showCloseButton if defined', function () {
        toasterContainer.ngOnInit();
        var toast = { type: 'info', showCloseButton: true };
        toasterService.pop(toast);
        expect(toasterContainer.toasts[0].showCloseButton).toBe(true);
    });
    it('addToast uses toasterconfig.showCloseButton object if defined and toast.showCloseButton is undefined', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ showCloseButton: { 'info': true } });
        toasterContainer.ngOnInit();
        var toast = { type: 'info' };
        var toast2 = { type: 'success' };
        toasterService.pop(toast);
        toasterService.pop(toast2);
        var infoToast = toasterContainer.toasts.filter(function (t) { return t.type === 'info'; })[0];
        var successToast = toasterContainer.toasts.filter(function (t) { return t.type === 'success'; })[0];
        expect(infoToast.showCloseButton).toBe(true);
        expect(successToast.showCloseButton).toBeUndefined();
    });
    it('addToast uses toast.showCloseButton if defined', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ showCloseButton: '' });
        toasterContainer.ngOnInit();
        var toast = { type: 'info' };
        toasterService.pop(toast);
        expect(toasterContainer.toasts[0].showCloseButton).toBeUndefined();
    });
    it('addToast removes toast from bottom if toasterconfig.newestOnTop and limit exceeded', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ limit: 2 });
        toasterContainer.ngOnInit();
        expect(toasterContainer.toasterconfig.newestOnTop).toBe(true);
        expect(toasterContainer.toasterconfig.limit).toBe(2);
        var toast1 = { type: 'info', title: '1', body: '1' };
        var toast2 = { type: 'info', title: '2', body: '2' };
        var toast3 = { type: 'info', title: '3', body: '3' };
        var toast4 = { type: 'info', title: '4', body: '4' };
        toasterService.pop(toast1);
        toasterService.pop(toast2);
        toasterService.pop(toast3);
        toasterService.pop(toast4);
        expect(toasterContainer.toasts.length).toBe(2);
        expect(toasterContainer.toasts[0].title).toBe('4');
        expect(toasterContainer.toasts[0]).toBe(toast4);
    });
    it('addToast will not populate safeCloseHtml if closeHtml is null', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig();
        toasterContainer.toasterconfig.closeHtml = null;
        toasterContainer.ngOnInit();
        var toast1 = { type: 'info', title: '1', body: '1', showCloseButton: true };
        toasterService.pop(toast1);
        fixture.detectChanges();
        var closeButtonEle = fixture.nativeElement.querySelector('.toast-close-button');
        expect(closeButtonEle.innerHTML).toBe("");
    });
    it('addToast will populate safeCloseHtml with default html', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig();
        toasterContainer.ngOnInit();
        var toast1 = { type: 'info', title: '1', body: '1', showCloseButton: true };
        toasterService.pop(toast1);
        fixture.detectChanges();
        var closeButtonEle = fixture.nativeElement.querySelector('.toast-close-button');
        expect(closeButtonEle.innerHTML).toBe('<button class="toast-close-button" type="button">×</button>');
    });
    it('addToast removes toast from top if !toasterconfig.newestOnTop and limit exceeded', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ newestOnTop: false, limit: 2 });
        toasterContainer.ngOnInit();
        expect(toasterContainer.toasterconfig.newestOnTop).toBe(false);
        expect(toasterContainer.toasterconfig.limit).toBe(2);
        var toast1 = { type: 'info', title: '1', body: '1' };
        var toast2 = { type: 'info', title: '2', body: '2' };
        var toast3 = { type: 'info', title: '3', body: '3' };
        var toast4 = { type: 'info', title: '4', body: '4' };
        toasterService.pop(toast1);
        toasterService.pop(toast2);
        toasterService.pop(toast3);
        toasterService.pop(toast4);
        expect(toasterContainer.toasts.length).toBe(2);
        expect(toasterContainer.toasts[0].title).toBe('3');
        expect(toasterContainer.toasts[0]).toBe(toast3);
    });
    it('addToast calls onShowCallback if it exists', function () {
        toasterContainer.ngOnInit();
        var toast = { type: 'info', title: 'default', onShowCallback: function (toaster) { return toaster.title = 'updated'; } };
        toasterService.pop(toast);
        expect(toasterContainer.toasts[0].title).toBe('updated');
    });
    it('addToast registers timeout callback if timeout is greater than 0', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ timeout: 1 });
        toasterContainer.ngOnInit();
        var toast = toasterService.pop('success');
        expect(toast.timeoutId).toBeDefined();
        expect(toasterContainer.toasts.length).toBe(1);
        setTimeout(function () {
            expect(toasterContainer.toasts.length).toBe(0);
            expect(toast.timeoutId).toBeNull();
        }, 2);
    });
    it('addToast will not register timeout callback if toast.timeout is 0', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ timeout: 1 });
        toasterContainer.ngOnInit();
        var toast = { type: 'success', timeout: 0 };
        var poppedToast = toasterService.pop(toast);
        expect(poppedToast.timeoutId).toBeUndefined();
    });
    it('addToast will fallback to toasterconfig timeout value if toast.timeout is undefined', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ timeout: 1 });
        toasterContainer.ngOnInit();
        var toast = { type: 'success' };
        var poppedToast = toasterService.pop(toast);
        expect(poppedToast.timeoutId).toBeDefined();
        expect((poppedToast.timeoutId).data.delay).toBe(1);
    });
    it('addToast will not register timeout if toast.timeout is undefined and toasterconfig.timeout is 0', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ timeout: 0 });
        toasterContainer.ngOnInit();
        var toast = { type: 'success' };
        var poppedToast = toasterService.pop(toast);
        expect(poppedToast.timeoutId).toBeUndefined();
    });
    it('addToast uses toasterconfig.timeout object if defined and type exists', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ timeout: { 'info': 10 } });
        toasterContainer.ngOnInit();
        var toast = { type: 'info' };
        var toast2 = { type: 'success' };
        toasterService.pop(toast);
        toasterService.pop(toast2);
        var infoToast = toasterContainer.toasts.filter(function (t) { return t.type === 'info'; })[0];
        var successToast = toasterContainer.toasts.filter(function (t) { return t.type === 'success'; })[0];
        expect(infoToast.timeoutId).toBeDefined();
        expect(successToast.timeoutId).toBeUndefined();
    });
    it('removeToast will not remove the toast if it is not found in the toasters array', function () {
        toasterContainer.ngOnInit();
        var toast = { type: 'info' };
        toasterService.pop(toast);
        expect(toasterContainer.toasts.length).toBe(1);
        toasterService.clear('faketoastid');
        expect(toasterContainer.toasts.length).toBe(1);
    });
    it('removeToast calls onHideCallback if it exists', function () {
        toasterContainer.ngOnInit();
        var status = 'not updated';
        var toast = { type: 'info', title: 'default', onHideCallback: function (toast) { return status = 'updated'; } };
        toasterService.pop(toast);
        toasterService.clear(toast.toastId);
        expect(status).toBe('updated');
    });
    it('clearToasts will clear toasts from all containers if toastContainerId is undefined', function () {
        toasterContainer.ngOnInit();
        var toast = { type: 'info' };
        toasterService.pop(toast);
        expect(toasterContainer.toasts.length).toBe(1);
        toasterService.clear(null, undefined);
        expect(toasterContainer.toasts.length).toBe(0);
    });
    it('clearToasts will clear toasts from specified container if toastContainerId is number', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ toastContainerId: 1 });
        toasterContainer.ngOnInit();
        var toast = { type: 'info', toastContainerId: 1 };
        toasterService.pop(toast);
        expect(toasterContainer.toasts.length).toBe(1);
        toasterService.clear(null, 1);
        expect(toasterContainer.toasts.length).toBe(0);
    });
    it('clearToasts will not clear toasts from specified container if toastContainerId does not match', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ toastContainerId: 1 });
        toasterContainer.ngOnInit();
        var toast = { type: 'info', toastContainerId: 1 };
        toasterService.pop(toast);
        expect(toasterContainer.toasts.length).toBe(1);
        toasterService.clear(null, 2);
        expect(toasterContainer.toasts.length).toBe(1);
    });
    it('createGuid should create unique Guids', function () {
        toasterContainer.toasterconfig = new toaster_config_1.ToasterConfig({ toastContainerId: 1 });
        toasterContainer.ngOnInit();
        var toastIds = [];
        for (var i = 0; i < 10000; i++) {
            var toast = toasterService.pop('success', 'toast');
            toastIds.push(toast.toastId);
            toasterService.clear();
        }
        var valuesSoFar = Object.create(null);
        var dupFound = false;
        for (var i = 0; i < toastIds.length; ++i) {
            var value = toastIds[i];
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
});
describe('ToasterContainerComponent when included as a component', function () {
    var fixture;
    beforeEach(function () {
        test_bed_1.TestBed.configureTestingModule({
            declarations: [TestComponent, TestDynamicComponent],
            imports: [toaster_module_1.ToasterModule]
        });
        fixture = test_bed_1.TestBed.createComponent(TestComponent);
    });
    it('should use the bound toasterconfig object if provided', function () {
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeDefined();
        var container = fixture.debugElement.children[0].componentInstance;
        expect(container).toBeDefined();
        expect(container.toasterconfig).toBeDefined();
        expect(container.toasterconfig.showCloseButton).toBe(true);
        expect(container.toasterconfig.tapToDismiss).toBe(false);
        expect(container.toasterconfig.timeout).toBe(0);
    });
    it('should invoke the click event when a toast is clicked but not remove toast if !tapToDismiss', function () {
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
    it('should invoke the click event when a toast is clicked and remove toast if tapToDismiss', function () {
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
    it('should invoke the click event when the close button is clicked even if !tapToDismiss', function () {
        fixture.detectChanges();
        var container = fixture.debugElement.children[0].componentInstance;
        expect(container.toasterconfig.tapToDismiss).toBe(false);
        fixture.componentInstance.toasterService.pop('success', 'test', 'test');
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);
        var toastButton = fixture.nativeElement.querySelector('.toast-close-button');
        toastButton.click();
        fixture.detectChanges();
        setTimeout(function () {
            expect(container.toasts.length).toBe(0);
        }, 0);
    });
    it('should remove toast if clickHandler evaluates to true', function () {
        fixture.detectChanges();
        var container = fixture.debugElement.children[0].componentInstance;
        var toast = {
            type: 'success', clickHandler: function () {
                return true;
            }
        };
        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);
        var toastButton = fixture.nativeElement.querySelector('.toast-close-button');
        toastButton.click();
        fixture.detectChanges();
        setTimeout(function () {
            expect(container.toasts.length).toBe(0);
        }, 0);
    });
    it('should not remove toast if clickHandler evaluates to false', function () {
        fixture.detectChanges();
        var container = fixture.debugElement.children[0].componentInstance;
        var toast = {
            type: 'success', clickHandler: function () {
                return false;
            }
        };
        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);
        var toastButton = fixture.nativeElement.querySelector('.toast-close-button');
        toastButton.click();
        fixture.detectChanges();
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);
    });
    it('should log error if clickHandler is not a function and not remove toast', function () {
        fixture.detectChanges();
        var container = fixture.debugElement.children[0].componentInstance;
        var clickHandler = {};
        var toast = { type: 'success', clickHandler: clickHandler };
        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);
        var toastButton = fixture.nativeElement.querySelector('.toast-close-button');
        toastButton.click();
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);
    });
    it('addToast should render component if it exists', function () {
        fixture.detectChanges();
        var container = fixture.debugElement.children[0].componentInstance;
        var toast = {
            type: 'success',
            title: 'Yay',
            body: TestDynamicComponent,
            bodyOutputType: bodyOutputType_1.BodyOutputType.Component
        };
        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);
        setTimeout(function () {
            var renderedToast = fixture.nativeElement.querySelector('test-dynamic-component');
            expect(renderedToast.innerHTML).toBe('<div>loaded via component</div>');
        }, 1);
    });
    it('addToast should render html passed in toast.body if bodyOutputType is TrustedHtml', function () {
        var textContent = 'here is test text';
        var htmlContent = '<h4>' + textContent + '</h4>';
        fixture.detectChanges();
        var container = fixture.debugElement.children[0].componentInstance;
        var toast = {
            type: 'success',
            title: 'Yay',
            body: htmlContent,
            bodyOutputType: bodyOutputType_1.BodyOutputType.TrustedHtml
        };
        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);
        var renderedToast = fixture.nativeElement.querySelector('.toast-message');
        var innerBody = renderedToast.querySelector('div');
        expect(innerBody.innerHTML).toBe(htmlContent);
        expect(innerBody.textContent).toBe(textContent);
        expect(innerBody.innerHTML).not.toBe(innerBody.textContent);
    });
    it('addToast will not render html if bodyOutputType is TrustedHtml and body is null', function () {
        fixture.detectChanges();
        var container = fixture.debugElement.children[0].componentInstance;
        var toast = {
            type: 'success',
            title: 'Yay',
            body: null,
            bodyOutputType: bodyOutputType_1.BodyOutputType.TrustedHtml
        };
        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);
        var renderedToast = fixture.nativeElement.querySelector('.toast-message');
        var innerBody = renderedToast.querySelector('div');
        expect(innerBody.innerHTML).toBe('');
    });
    it('addToast will render encoded text instead of html if bodyOutputType is Default', function () {
        var textContent = 'here is test text';
        var htmlContent = '<h4>' + textContent + '</h4>';
        var encodedString = '&lt;h4&gt;here is test text&lt;/h4&gt;';
        fixture.detectChanges();
        var container = fixture.debugElement.children[0].componentInstance;
        var toast = {
            type: 'success',
            title: 'Yay',
            body: htmlContent,
            bodyOutputType: bodyOutputType_1.BodyOutputType.Default
        };
        fixture.componentInstance.toasterService.pop(toast);
        fixture.detectChanges();
        expect(container.toasts.length).toBe(1);
        var renderedToast = fixture.nativeElement.querySelector('.toast-message');
        var innerBody = renderedToast.querySelector('div');
        expect(innerBody.innerHTML).toBe(encodedString);
        expect(innerBody.textContent).toBe(htmlContent);
    });
});
describe('Multiple ToasterContainerComponent components', function () {
    var fixture;
    beforeEach(function () {
        test_bed_1.TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [toaster_module_1.ToasterModule]
        });
        test_bed_1.TestBed.overrideComponent(TestComponent, {
            set: {
                template: "<toaster-container [toasterconfig]=\"toasterconfig\"></toaster-container>\n                    <toaster-container [toasterconfig]=\"toasterconfig2\"></toaster-container>"
            }
        });
        fixture = test_bed_1.TestBed.createComponent(TestComponent);
    });
    it('should create multiple container instances', function () {
        fixture.componentInstance.toasterconfig.toastContainerId = 1;
        fixture.componentInstance.toasterconfig2.toastContainerId = 2;
        fixture.detectChanges();
        expect(fixture).toBeDefined();
        expect(fixture.componentInstance.toasterconfig).toBeDefined();
        expect(fixture.componentInstance.toasterconfig2).toBeDefined();
    });
    it('should only receive toasts targeted for that container', function () {
        fixture.componentInstance.toasterconfig.toastContainerId = 1;
        fixture.componentInstance.toasterconfig2.toastContainerId = 2;
        fixture.detectChanges();
        var toast1 = {
            type: 'success',
            title: 'fixture 1',
            toastContainerId: 1
        };
        var toast2 = {
            type: 'success',
            title: 'fixture 2',
            toastContainerId: 2
        };
        fixture.componentInstance.toasterService.pop(toast1);
        fixture.componentInstance.toasterService.pop(toast2);
        fixture.detectChanges();
        var container1 = fixture.debugElement.children[0].componentInstance;
        var container2 = fixture.debugElement.children[1].componentInstance;
        expect(container1.toasts.length).toBe(1);
        expect(container2.toasts.length).toBe(1);
        expect(container1.toasts[0].title).toBe('fixture 1');
        expect(container2.toasts[0].title).toBe('fixture 2');
    });
});
//# sourceMappingURL=toaster-container.component.spec.js.map