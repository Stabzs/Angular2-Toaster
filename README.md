# Angular2-Toaster

**angular2-toaster** is an asynchronous, non-blocking Angular2 Toaster Notification library 
largely based off of [AngularJS-Toaster](https://github.com/jirikavi/AngularJS-Toaster).

[![Build Status](https://travis-ci.org/Stabzs/Angular2-Toaster.svg?branch=master)](https://travis-ci.org/Stabzs/Angular2-Toaster)
[![Coverage Status](https://coveralls.io/repos/github/Stabzs/Angular2-Toaster/badge.svg?branch=master&busted=0.3.6-rc.4)](https://coveralls.io/github/Stabzs/Angular2-Toaster?branch=master)

### Current Version 0.3.6-rc.4

## Installation:

```bash
npm install angular2-toaster
```

## Link CSS
```html
<link rel="stylesheet" type="text/css" href="/node_modules/angular2-toaster/lib/toaster.css" />
```

## Building the Source
In order to build Angular2-Toaster, you will need to have Git and Node.js installed.

Clone a copy of the repo:

```bash
git clone https://github.com/stabzs/Angular2-Toaster.git
```

In the cloned directory, run:
```bash
npm install
```

Start Typescript compiler with watch:
```bash
npm run watch
```

Start Karma test instance with watch:
```bash
npm run test
```

Generate test coverage report:
```bash
npm run coverage
```


## Getting Started with Default Configuration:

```typescript
import {Component} from '@angular/core';
import {ToasterContainerComponent, ToasterService} from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'root',
    directives: [ToasterContainerComponent],
    providers: [ToasterService],
    template: `
        <toaster-container></toaster-container>
        <button (click)="popToast()">pop toast</button>`
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
import {Component} from '@angular/core';
import {ToasterContainerComponent, ToasterService, ToasterConfig} from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'root',
    directives: [ToasterContainerComponent],
    providers: [ToasterService],
    template: `
        <toaster-container [toasterconfig]="toasterconfig">
        </toaster-container>
        <button (click)="popToast()">pop toast</button>`
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

## Asynchronous vs Synchronous ToasterService
`ToasterService` exposes both a synchronous and asynchronous pop method in the form of `pop()` and 
`popAsync()` respectively.  

`pop()` returns a concrete `Toast` instance after the toastId property has been hydrated and the 
toast has been added to all receiving containers.

`popAsync()` returns a hot `Observable<Toast>` that may be subscribed to to receive multiple toast 
updates.


## Customize Toast arguments in pop
```typescript

var toast: Toast = {
    type: 'success',
    title: 'close button',
    showCloseButton: true
};

this.toasterService.pop(toast);

```

## Clear Existing Toast
`ToasterService` exposes a `clear` function that accepts two optional parameters: `toastId` and 
`toastContainerId`.

These parameters can be used to clear toasts by specific id, by container id, 
by both, or by neither.  If both parameters are omitted, all toasts in all containers will be 
removed.

```typescript
var toast = this.toasterService.pop('success', 'title', 'body');
this.toasterService.clear(toast.toastId, toast.toastContainerId);
```


## Configurable Options

### Limit
Limit is defaulted to null, meaning that there is no maximum number of toasts that are defined 
before the toast container begins removing toasts when a new toast is added.

To change this behavior, pass a "limit" option to the config:

```typescript
template: 
    `<toaster-container [toasterconfig]="toasterconfig"></toaster-container>`

public toasterconfig : ToasterConfig = 
    new ToasterConfig({limit: 5});
```

### Tap to Dismiss
By default, the `tapToDismiss` option is set to true, meaning that if a toast is clicked anywhere 
on the toast body, the toast will be dismissed.  This behavior can be overriden in the config so 
that if set to false, the toast will only be dismissed if the close button is defined and clicked:

```typescript
template: 
    `<toaster-container [toasterconfig]="toasterconfig"></toaster-container>`

public toasterconfig : ToasterConfig = 
    new ToasterConfig({tapToDismiss: false});
```

### Close Button

The Close Button's visibility can be configured at three different levels:

* Globally in the config for all toast types:

    ```typescript
    template: 
        `<toaster-container [toasterconfig]="toasterconfig"></toaster-container>`

    public toasterconfig : ToasterConfig = 
        new ToasterConfig({showCloseButton: true});
    ```

* Per info-class type:
By passing the close-button configuration as an object instead of a boolean, you can specify the global behavior an info-class type should have.

    ```typescript
    template: 
        `<toaster-container [toasterconfig]="toasterconfig"></toaster-container>`

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
        `<toaster-container [toasterconfig]="toasterconfig"></toaster-container>`

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

### Newest Toasts on Top
The `newestOnTop` option is defaulted to true, adding new toasts on top of other existing toasts. 
If changed to false via the config, toasts will be added to the bottom of other existing toasts.

```typescript
template: 
    `<toaster-container [toasterconfig]="toasterconfig"></toaster-container>`

public toasterconfig : ToasterConfig = 
    new ToasterConfig({newestOnTop: false});
```

### Timeout
By default, toasts have a timeout setting of 5000, meaning that they are removed after 5000 
milliseconds.  

If the timeout is set to anything other than a number greater than 0, the toast will be considered
 "sticky" and will not automatically dismiss.

The timeout can be configured at three different levels:

* Globally in the config for all toast types:
  ```typescript
  template: 
    `<toaster-container [toasterconfig]="toasterconfig"></toaster-container>`

  public toasterconfig : ToasterConfig = 
        new ToasterConfig({timeout: 2000});
  ```

* Per info-class type:
By passing the timeout config option as an object instead of a number, you can specify the global 
behavior an info-class type should have.

  ```typescript
  template: 
    `<toaster-container [toasterconfig]="toasterconfig"></toaster-container>`

  public toasterconfig : ToasterConfig = 
      new ToasterConfig({timeout: {error:1000});
  ```
If a type is not defined and specified, a timeout will not be applied, making the toast "sticky".

* Per toast constructed via toaster.pop('success', "title", "text"):
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

### Body Output Type
There are three different types of body renderings that can be passed via the 
`toast.bodyOutputType` argument: 'Default', 'TrustedHtml', and 'Component'. If a `bodyOutputType` 
is not provided, it will be defaulted to 'Default'.

* Default: The `body` argument will be directly interpolated as text content.  If html is passed 
 in the `body` argument, it will be encoded and rendered as text.
 
* TrustedHtml: The `body` argument will be parsed and rendered as html content.
  ```typescript
  import {BodyOutputType} from 'angular2-toaster/angular2-toaster';
  var toast : Toast = {
      type: 'error',
      title: 'Title text',
      body: '<h4>Body text</h4>',
      bodyOutputType: BodyOutputType.TrustedHtml
  };
            
  this.toasterService.pop(toast);
  ```

* Component: The `body` argument is the name of the component class to be rendered as the content 
of the toast.
  ```typescript
  import {BodyOutputType} from 'angular2-toaster/angular2-toaster';
  
  @Component({
    selector: 'dynamic-component',
    template: `<div>loaded via component</div>`
  })
  class DynamicComponent { }
  
  var toast : Toast = {
      type: 'error',
      title: 'Title text',
      body: DynamicComponent,
      bodyOutputType: BodyOutputType.Component
  };
            
  this.toasterService.pop(toast);
  ```


### On Show Callback
An onShow callback function can be attached to each toast instance.  The callback will be invoked upon toast add.

```typescript
var toast: Toast = {
  type: 'success',
  title: 'parent',
  onShowCallback: (toast) => this.toasterService.pop('success', 'invoked from ' + toast.title + ' onShow callback')  
};

this.toasterService.pop(toast);
```

### On Hide Callback
An onHide callback function can be attached to each toast instance.  The callback will be invoked upon toast removal.

```typescript
var toast: Toast = {
  type: 'success',
  title: 'parent',
  onHideCallback: (toast) => this.toasterService.pop('success', 'invoked from ' + toast.title + ' onHide callback')  
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