# 0.3.6-rc.4 (2016-07-07)
### Features
* **Angular: RC4:** The library has been updated to Angular RC4.

### Bug Fixes
* **toast.component.ts:** The ClickHandler was called twice when the close button checked the
ClickHandler function and the ClickHandler returned false.  This is
corrected by stopping the double event propagation.  Closes 
[#35](https://github.com/Stabzs/Angular2-Toaster/issues/35).


# 0.3.5-rc.3 (2016-06-23)
### Features
* **Angular: RC3:** The library has been updated to Angular RC3.


# 0.3.5-rc.2 (2016-06-17)
### Features
* **Angular RC2:**  The library has been updated to Angular RC2.
* **toaster-container.component.ts:** An explcit markForRef check has been added for timeouts. 
This allows toasts to be properly removed when their timeout expires, even if the rest of the 
consuming app is running as ChangeDectectionStrategy.OnPush.


# 0.3.4-rc.1 (2016-06-04)

### Bug Fixes
* **toaster.css:** The toast icons were covering the entire toast body due to their layout.  As 
a result, any component being rendered into the toast body could not have any interaction points 
(such as buttons) since it was beneath the icon.  The toast has been slightly restructured to 
accommodate this scenario.

### Documentation
* **README:** Documentation has been added for the `toasterService.clear()` function.  Added in 
[8e6404c](https://github.com/Stabzs/Angular2-Toaster/commit/8e6404cb474fb95b63c446458d681ccce51d89ec).
* **demo.systemjs:** An additional use case for rendering components with actions (buttons) in the 
toast body has been added to address [#27](https://github.com/Stabzs/Angular2-Toaster/issues/27). 


# 0.3.3-rc.1 (2016-05-31)

### Bug Fixes
* **toast.component.ts:** The `BodyOutputType.TrustedHtml` option was trying to improperly render 
the `toast.html` property of the toast.  This has been updated to render the body property as the 
inner html of the new toast instance and addresses [#24](https://github.com/Stabzs/Angular2-Toaster/issues/24).

### Documentation
* **README:** Body Output Type documentation added to the README.


# 0.3.2-rc.1 (2016-05-22

### Bug Fixes
* **toaster.container.component.ts:** If `toast.timeout` property is set to 0, the toast instance 
will correctly be "sticky". If the `toast.timeout` is undefined, the timeout property assignment 
will continue to correctly fallback to the `toasterconfig.timeout` property.
Closes [#23](https://github.com/Stabzs/Angular2-Toaster/issues/23).


# 0.3.1-rc.1 (2016-05-22)
The rc version has been bumped to match the currently targeted Angular 2 version.

### Bug Fixes
* **toaster.container.component.ts:** If the component has not been properly initialized but 
ngDestroy is triggered, an exception will no longer be thrown.
Fixed via [#20](https://github.com/Stabzs/Angular2-Toaster/issues/20).

### Documentation
* **toaster.service.ts:** JSDoc documentation added for public API methods of the toaster service.


# 0.3.0-rc.0 (2016-05-07)

This is the first release of Angular2-Toaster against the Angular2 Release Candidate. All Angular 2 
NPM packages have been updated to use the appropriate `@angular/*` import syntax.  As a result, the 
library is no longer backwards-compatible with Angular 2 Beta releases.  Please update to 
`"@angular/*": "2.0.0-rc.1"` at minimum going forward.


### Features
* **BodyOutputType.Component:** BodyOutputType.Component (the ability to render components as the 
body of the toast) has been updated to remove the soon to be deprecated `DynamicComponentLoader` in 
favor of the `ComponentResolver`.  This eliminated a nasty but necessary manual timeout and 
detectChanges pairing and resolved a long-standing TODO.
* **Toast.Component:** Toast rendering has been moved to its own component.  This allows for 
`BodyOutputType.Component` to properly load into the appropriate `TemplateRef` if multiple toasts 
are rendering components concurrently.
* **ToasterContainerComponent.Template:** The template has been updated to the new `*ngFor` syntax. 
Closes [#14](https://github.com/Stabzs/Angular2-Toaster/issues/14).


### Breaking Changes
* **Angular2-rc compatibility**



# 0.2.0-beta.0 (2016-04-11)

### Bug Fixes

* **toaster.css:** Fixed width issues for center aligned `toast-containers`.

### Features

* **toaster.service.ts:** EventEmitters removed and Observables added instead to handle events 
between service and containers.
* **toaster.service.ts:** `pop` function returns toast instance after the toast has been added.
* **toaster.service.ts:** `popAsync` function added to return `Observable<Toast>` to allow caller 
to subscribe to added toasts.
* **toaster.service.ts:** If a `toaster-container` is not created when a toast is popped, an 
error will be thrown.


### Breaking Changes

* **toastId:** `toastId` has been changed from a number that is incremented internally in each 
`toaster-container` to most-likely-random GUIDs that are generated in each `pop()` call. This 
allows for the toastId to always be known and prevents unwanted collisions when removing from 
multiple containers.

* **toaster.service.ts:** The `isAsync` parameter for the toasterService has been removed and 
a factory can no longer be passed in the `toaster-container` construction to specify async vs 
sync.