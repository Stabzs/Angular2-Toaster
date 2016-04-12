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