var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var bodyOutputType_1 = require('./bodyOutputType');
var toaster_config_1 = require('./toaster-config');
var toaster_service_1 = require('./toaster.service');
var ToasterContainerComponent = (function () {
    function ToasterContainerComponent(toasterService, dcl, changeDetectorRef) {
        this.id = 0;
        this.toasts = [];
        this.bodyOutputType = bodyOutputType_1.BodyOutputType;
        this.toasterService = toasterService;
        this.dcl = dcl;
        this.changeDetectorRef = changeDetectorRef;
    }
    ToasterContainerComponent.prototype.ngOnInit = function () {
        this.registerSubscribers();
        if (this.toasterconfig === null || typeof this.toasterconfig === 'undefined') {
            this.toasterconfig = new toaster_config_1.ToasterConfig();
        }
    };
    // event handlers
    ToasterContainerComponent.prototype.click = function (toast, isCloseButton) {
        if (this.toasterconfig.tapToDismiss || (toast.showCloseButton && isCloseButton)) {
            var removeToast = true;
            if (toast.clickHandler) {
                if (typeof toast.clickHandler === "function") {
                    removeToast = toast.clickHandler(toast, isCloseButton);
                }
                else {
                    throw new Error("The toast click handler is not a callable function.");
                }
            }
            if (removeToast) {
                this.removeToast(toast);
            }
        }
    };
    ToasterContainerComponent.prototype.stopTimer = function (toast) {
        if (this.toasterconfig.mouseoverTimerStop) {
            if (toast.timeoutId) {
                window.clearTimeout(toast.timeoutId);
                toast.timeoutId = null;
            }
        }
    };
    ToasterContainerComponent.prototype.restartTimer = function (toast) {
        if (this.toasterconfig.mouseoverTimerStop) {
            if (toast.timeoutId) {
                this.configureTimer(toast);
            }
        }
        else if (toast.timeoutId === null) {
            this.removeToast(toast);
        }
    };
    // private functions
    ToasterContainerComponent.prototype.registerSubscribers = function () {
        var _this = this;
        this.addToastSubscriber = this.toasterService.addToast.subscribe(function (toast) {
            _this.addToast(toast);
        });
        this.clearToastsSubscriber = this.toasterService.clearToasts.subscribe(function (clearWrapper) {
            _this.clearToasts(clearWrapper);
        });
    };
    ToasterContainerComponent.prototype.addToast = function (toast) {
        var _this = this;
        toast.toasterConfig = this.toasterconfig;
        if (toast.toastContainerId && this.toasterconfig.toastContainerId
            && toast.toastContainerId !== this.toasterconfig.toastContainerId)
            return;
        if (!toast.type) {
            toast.type = this.toasterconfig.defaultTypeClass;
        }
        if (this.toasterconfig.preventDuplicates && this.toasts.length > 0) {
            if (toast.toastId && this.toasts.some(function (t) { return t.toastId === toast.toastId; })) {
                return;
            }
            else if (this.toasts.some(function (t) { return t.body === toast.body; })) {
                return;
            }
        }
        toast.toastId = ++this.id;
        if (toast.showCloseButton === null || typeof toast.showCloseButton === "undefined") {
            if (typeof this.toasterconfig.showCloseButton === "object") {
                toast.showCloseButton = this.toasterconfig.showCloseButton[toast.type];
            }
            else if (typeof this.toasterconfig.showCloseButton === "boolean") {
                toast.showCloseButton = this.toasterconfig.showCloseButton;
            }
        }
        if (toast.showCloseButton) {
            toast.closeHtml = toast.closeHtml || this.toasterconfig.closeHtml;
        }
        toast.bodyOutputType = toast.bodyOutputType || this.toasterconfig.bodyOutputType;
        if (toast.bodyOutputType === this.bodyOutputType.Component) {
            setTimeout(function () {
                _this.dcl.loadAsRoot(toast.body, '#componentBody', null);
                // TODO: Necessary per https://github.com/angular/angular/issues/6223
                // until loadAsRoot matches loadIntoLocation behavior
                _this.changeDetectorRef.detectChanges();
            }, 0);
        }
        this.configureTimer(toast);
        if (this.toasterconfig.newestOnTop) {
            this.toasts.unshift(toast);
            if (this.isLimitExceeded()) {
                this.toasts.pop();
            }
        }
        else {
            this.toasts.push(toast);
            if (this.isLimitExceeded()) {
                this.toasts.shift();
            }
        }
        if (toast.onShowCallback) {
            toast.onShowCallback(toast);
        }
    };
    ToasterContainerComponent.prototype.configureTimer = function (toast) {
        var _this = this;
        var timeout = toast.timeout || this.toasterconfig.timeout;
        if (typeof timeout === "object")
            timeout = timeout[toast.type];
        if (timeout > 0) {
            toast.timeoutId = window.setTimeout(function () {
                _this.removeToast(toast);
            }, timeout);
        }
    };
    ToasterContainerComponent.prototype.isLimitExceeded = function () {
        return this.toasterconfig.limit && this.toasts.length > this.toasterconfig.limit;
    };
    ToasterContainerComponent.prototype.removeToast = function (toast) {
        var index = this.toasts.indexOf(toast);
        if (index < 0)
            return;
        this.toasts.splice(index, 1);
        if (toast.timeoutId)
            window.clearTimeout(toast.timeoutId);
        if (toast.onHideCallback)
            toast.onHideCallback(toast);
    };
    ToasterContainerComponent.prototype.removeAllToasts = function () {
        for (var i = this.toasts.length - 1; i >= 0; i--) {
            this.removeToast(this.toasts[i]);
        }
    };
    ToasterContainerComponent.prototype.clearToasts = function (clearWrapper) {
        var toastId = clearWrapper.toastId;
        var toastContainerId = clearWrapper.toastContainerId;
        if (toastContainerId == null || typeof toastContainerId === 'undefined') {
            this.clearToastsAction(toastId);
        }
        else if (toastContainerId === this.toasterconfig.toastContainerId) {
            this.clearToastsAction(toastId);
        }
    };
    ToasterContainerComponent.prototype.clearToastsAction = function (toastId) {
        if (toastId) {
            this.removeToast(this.toasts.find(function (t) { return t.toastId === toastId; }));
        }
        else {
            this.removeAllToasts();
        }
    };
    ToasterContainerComponent.prototype.ngOnDestroy = function () {
        this.addToastSubscriber.dispose();
        this.clearToastsSubscriber.dispose();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', toaster_config_1.ToasterConfig)
    ], ToasterContainerComponent.prototype, "toasterconfig", void 0);
    ToasterContainerComponent = __decorate([
        core_1.Component({
            selector: 'toaster-container',
            template: "\n        <div id=\"toast-container\" [ngClass]=\"[toasterconfig.positionClass, toasterconfig.animationClass]\" class=\"ng-animate\">\n            <div *ngFor=\"#toast of toasts\" class=\"toast\" [ngClass]=\"toasterconfig.typeClasses[toast.type]\" (click)=\"click(toast)\" \n                (mouseover)=\"stopTimer(toast)\" (mouseout)=\"restartTimer\">\n                <div *ngIf=\"toast.showCloseButton\" (click)=\"click(toast, true)\" [innerHTML]=\"toast.closeHtml\"></div>\n                <i class=\"toaster-icon\" [ngClass]=\"toasterconfig.iconClasses[toast.type]\"></i>\n                <div [ngClass]=\"toast.toasterConfig.titleClass\">{{toast.title}}</div>\n                <div [ngClass]=\"toast.toasterConfig.messageClass\" [ngSwitch]=\"toast.bodyOutputType\">\n                    <div *ngSwitchWhen=\"bodyOutputType.Component\" id=\"componentBody\"></div> \n                    <div *ngSwitchWhen=\"bodyOutputType.TrustedHtml\" [innerHTML]=\"toast.html\"></div>\n                    <div *ngSwitchWhen=\"bodyOutputType.Default\">{{toast.body}}</div>\n                </div>\n            </div>\n        </div>\n        "
        }), 
        __metadata('design:paramtypes', [toaster_service_1.ToasterService, core_1.DynamicComponentLoader, core_1.ChangeDetectorRef])
    ], ToasterContainerComponent);
    return ToasterContainerComponent;
})();
exports.ToasterContainerComponent = ToasterContainerComponent;
//# sourceMappingURL=toaster-container.component.js.map