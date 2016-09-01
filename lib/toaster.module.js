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
var platform_browser_1 = require('@angular/platform-browser');
var toast_component_1 = require('./toast.component');
var toaster_container_component_1 = require('./toaster-container.component');
var toaster_service_1 = require('./toaster.service');
var ToasterModule = (function () {
    function ToasterModule() {
    }
    ToasterModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule],
            declarations: [toast_component_1.ToastComponent, toaster_container_component_1.ToasterContainerComponent],
            providers: [toaster_service_1.ToasterService],
            exports: [toaster_container_component_1.ToasterContainerComponent, toast_component_1.ToastComponent],
        }), 
        __metadata('design:paramtypes', [])
    ], ToasterModule);
    return ToasterModule;
}());
exports.ToasterModule = ToasterModule;
//# sourceMappingURL=toaster.module.js.map