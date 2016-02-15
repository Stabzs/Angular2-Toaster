# Angular2-Toaster

**angular2-toaster** is an asynchronous, non-blocking Angular2 Toaster Notification library largely based off of [AngularJS-Toaster](https://github.com/jirikavi/AngularJS-Toaster).

### Current Version 0.0.1-alpha.2

## Installation:

```bash
npm install angular2-toaster
```

## Getting Started with Default Configuration:

```typescript
import {Component} from 'angular2/core';
import {ToasterContainerComponent, ToasterService} from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'root',
    directives: [ToasterContainerComponent],
    providers: [ToasterService],
    template: `
        <toaster-container></toaster-container>
        <button (click)="popToast()">pop toast</button>
        `
})

class Root {
    private toasterService: ToasterService;
    
    constructor(toasterService: ToasterService) {
        this.toasterService = toasterService;    
    }
    
    popToast() {
        this.toasterService.pop('success', 'Args Title', 'Args Body');
    }
}

bootstrap(Root);
```

## Getting Started with Configuration Override:

```typescript
import {Component} from 'angular2/core';
import {ToasterContainerComponent, ToasterService, ToasterConfig, Toaster} from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'root',
    directives: [ToasterContainerComponent],
    providers: [ToasterService],
    template: `
        <toaster-container [toasterconfig]="toasterconfig">
        </toaster-container>
        <button (click)="popToast()">pop toast</button>
        `
})

class Root {
    private toasterService: ToasterService;
    
    constructor(toasterService: ToasterService) {
        this.toasterService = toasterService;    
    }
    
    public toasterconfig : ToasterConfig = 
        new ToasterConfig({
            showCloseButton: true, 
            tapToDismiss: false, 
            timeout: 0
        });
    
    popToast() {
        this.toasterService.pop('success', 'Args Title', 'Args Body');
    }
}

bootstrap(Root);
```

## Customize Toast arguments in pop
```typescript

var toast: Toast = {
    type: 'success',
    title: 'close button',
    showCloseButton: true
};

this.toasterService.pop(toast);

```

## Configurable Options

### Close Button

The Close Button's visibility can be configured at three different levels:

* Globally in the config for all toast types:

    ```typescript
    template: 
        `<toaster-container [toasterconfig]="toasterconfig">
        </toaster-container>`

    public toasterconfig : ToasterConfig = 
        new ToasterConfig({
            showCloseButton: true
        });
    ```

* Per info-class type:
By passing the close-button configuration as an object instead of a boolean, you can specify the global behavior an info-class type should have.

    ```typescript
    template: 
        `<toaster-container [toasterconfig]="toasterconfig">
        </toaster-container>`

    public toasterconfig : ToasterConfig = 
        new ToasterConfig({
            showCloseButton: { 'warning': true, 'error': false }
        });
    ```
    
    If a type is not defined and specified, the default behavior for that type is false.

* Per toast constructed via Toast object creation:

    ```typescript
    var toast : Toast = {
        type: 'error',
        title: 'Title text',
        body: 'Body text',
        showCloseButton: true
    };
    
    this.toasterService.pop(toast);
    
    ```
    
    This option is given the most weight and will override the global configurations for that toast.  However, it will not persist to other toasts of that type and does not alter or pollute the global configuration.


### Close Html

The close button html can be overridden either globally or per toast call.

 - Globally:

    ```typescript
    template: 
        `<toaster-container [toasterconfig]="toasterconfig">
        </toaster-container>`

    public toasterconfig : ToasterConfig = 
        new ToasterConfig({
            closeHtml: '<button>Close</button>'
        });
    ```

 - Per toast:

    ```typescript
    var toast : Toast = {
        type: 'error',
        title: 'Title text',
        body: 'Body text',
        showCloseButton: true,
        closeHtml: '<button>Close</button>'
    };
    
    this.toasterService.pop(toast);
    ```


## Animations
Animations are currently not released in Angular 2 beta and are not yet included in angular2-toaster.

## Author
[Stabzs](stabzssoftware@gmail.com)

## Credits
Rewritten from https://github.com/jirikavi/AngularJS-Toaster

Inspired by http://codeseven.github.io/toastr/demo.html.

## Copyright
Copyright © 2016 Stabzs.


## Licence

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.