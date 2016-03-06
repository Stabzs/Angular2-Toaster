System.register(['angular2/core', 'angular2/platform/browser', 'angular2-toaster/angular2-toaster'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, browser_1, angular2_toaster_1;
    var TestComponent, Root;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (angular2_toaster_1_1) {
                angular2_toaster_1 = angular2_toaster_1_1;
            }],
        execute: function() {
            TestComponent = (function () {
                function TestComponent() {
                }
                TestComponent = __decorate([
                    core_1.Component({
                        selector: 'test-component',
                        template: "\n        <div>loaded via component</div>\n        "
                    }), 
                    __metadata('design:paramtypes', [])
                ], TestComponent);
                return TestComponent;
            }());
            Root = (function () {
                function Root(toasterService) {
                    this.toasterconfig = new angular2_toaster_1.ToasterConfig({ showCloseButton: true, tapToDismiss: false, timeout: 0 });
                    this.toasterService = toasterService;
                }
                Root.prototype.popToastFromObject = function () {
                    var toast = {
                        type: 'info',
                        title: 'Test Title',
                        body: 'Test Body',
                        onHideCallback: function () { return console.log(toast.title + ' was closed!'); }
                    };
                    var toast2 = {
                        type: 'success',
                        title: 'Yay',
                        body: TestComponent,
                        bodyOutputType: angular2_toaster_1.BodyOutputType.Component
                    };
                    var toast3 = {
                        type: 'success',
                        title: 'close button',
                        showCloseButton: true
                    };
                    this.toasterService.pop(toast);
                    this.toasterService.pop(toast2);
                    this.toasterService.pop(toast3);
                };
                Root.prototype.popToastFromArgs = function () {
                    this.toasterService.pop('success', 'Args Title', 'Args Body');
                    this.toasterService.pop('warning', 'Args Title', 'Args Body');
                    this.toasterService.pop('error', 'Args Title', 'Args Body');
                    this.toasterService.pop('wait', 'Args Title', 'Args Body');
                };
                Root.prototype.clearAll = function () {
                    this.toasterService.clear();
                };
                Root = __decorate([
                    core_1.Component({
                        selector: 'root',
                        directives: [angular2_toaster_1.ToasterContainerComponent],
                        providers: [angular2_toaster_1.ToasterService],
                        template: "\n        <toaster-container [toasterconfig]=\"toasterconfig\"></toaster-container>\n        <button (click)=\"popToastFromObject()\">pop toast from object</button><br/>\n        <button (click)=\"popToastFromArgs()\">pop toast from args</button><br/>\n        <button (click)=\"clearAll()\">Clear All</button><br/>\n        "
                    }), 
                    __metadata('design:paramtypes', [angular2_toaster_1.ToasterService])
                ], Root);
                return Root;
            }());
            exports_1("Root", Root);
            browser_1.bootstrap(Root);
        }
    }
});
//# sourceMappingURL=main.js.map