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
var ToasterService = (function () {
    function ToasterService() {
        this.addToast = new core_1.EventEmitter();
        this.clearToasts = new core_1.EventEmitter();
    }
    ToasterService.prototype.pop = function (type, title, body) {
        var toast = typeof type === 'string' ? { type: type, title: title, body: body } : type;
        this.addToast.emit(toast);
        // TODO: Return toast id
    };
    ToasterService.prototype.clear = function (toastId, toastContainerId) {
        var clearWrapper = {
            toastId: toastId, toastContainerId: toastContainerId
        };
        this.clearToasts.emit(clearWrapper);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ToasterService.prototype, "addToast", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ToasterService.prototype, "clearToasts", void 0);
    ToasterService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ToasterService);
    return ToasterService;
})();
exports.ToasterService = ToasterService;
//# sourceMappingURL=toaster.service.js.map