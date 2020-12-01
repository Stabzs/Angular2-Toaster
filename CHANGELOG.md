# 11.0.0
### FEATURES
* **angular2-toaster:** Full release of 11.0.0 functionality.  Pins the library to 11.0.0 of Angular.
* **toast:** A new `tapToDismiss?: boolean` property has been added to the toast object.  This allows for 
each individual toast to override the global `tapToDismiss` config.
Closes [#178](https://github.com/Stabzs/Angular2-Toaster/issues/178).
* **toast:** A progress bar has been added on a toast-by-toast basis with two progress directions:
decreasing and increasing.  By default, the progress bar is disabled.
* **toaster.css:** Styles have been rebuilt around flexbox and have removed IE and webkit-specific prefixes. 
This allows for more compact css and should make it easier for users to override styles.  It also fixes close 
button layout issues in Firefox, resolving [#192](https://github.com/Stabzs/Angular2-Toaster/issues/192).
Due to larger default viewports for standard mobile devices, the responsive layouts are no longer beneficial 
and they have been removed.  The standard toast width is now fixed at 300px.
Finally, the styles should be cleaner, more compact for large toasts, and more consistent across content size
changes.
* **animations:**  Animations have been rebuilt and enhanced to provide smoother transitions for all animation 
types.  Thanks to @fidian for the excellent suggestion and examples.
Closes [#196](https://github.com/Stabzs/Angular2-Toaster/issues/196).

### BREAKING CHANGES
* **toast:** Due to the complexity of the `clickHandler` functionality potentially blocking the `tapToDismiss`
setting based on the `clickHandler`'s boolean response, the `clickHandler` property has been replaced with an 
`onClickCallback?: OnActionCallback = (toast: Toast) => void;` property.  This property will always be called on 
toast click, even if `tapToDismiss` is true or if the click originated from the close button.
* **toaster-container.component:** The toaster-container element has changed from an id to a class. Since multiple 
containers can exist on the same page, using a class for controlling container styles is more semantically 
appropriate.
* **toaster.css:** IE support has been dropped and the styles have been ported to a much lighter-weight flexbox 
pattern.  This will most likely break any custom toast styles.
* **toaster.css:** The Toaster Container element and styles have been moved from an id to a class.  This allows for 
custom ids to be applied to individual containers and more semantically supports multiple containers on the same page.
* **toast, toaster.service, toaster-config:** the 'type' parameter has been constrained to the new `ToastType` type 
instead of string.  If the default types are being used, there will be no impact.  If custom types are being used, 
the custom types will need a new type that unions `ToastType`.  See the 'Toast Types' section of the README for 
additional details.  
    - To more clearly support this change, the `toaster-config.defaultTypeClass` property has been 
renamed to `defaultToastType` and is now constrained to `ToastType`.
    - The following toaster-config properties have been updated from type `string` to type `ToastType`:
        - showCloseButton
        - typeClasses
        - iconClasses
        - defaultToastType
        - timeout
* **toaster-container.component:** When providing a custom toast type, overrides must be added via `toaster-config` to 
both the `typeClasses` and `iconClasses` properties.  If mappings do not exist for both, the toast's type will fall back 
to `toaster-config.defaultToastType`.

### BUG FIXES
* **toaster-config:** The default for the `defaultTypeClass` property (now renamed to `defaultToastType`) has been 
correctly changed to `info` instead of `toast-info` for the fallback case.
* **toaster.css:** The close button positioning has been corrected.
Closes [#192](https://github.com/Stabzs/Angular2-Toaster/issues/192).
* **toast.component:** The `BodyOutputType.TrustedHtml` body content did not properly update on change. A pipe has been 
added at the suggestion of @rmeshksar to force re-rendering of the content if it changes.  Replaces 
[#185]](https://github.com/Stabzs/Angular2-Toaster/pull/185).


# 10.0.0
### FEATURES
* **angular2-toaster:** Full release of 10.0.0 functionality.  Pins the library to 10.0.0 of Angular.

### DOCUMENTATION
* **README:** Added documentation for toast types and toast type overrides.

# 8.0.0
### FEATURES
* **angular2-toaster:** Full release of 8.0.0 functionality.  Pins the library to 8.0.0 versions
of Angular. Closes [#188](https://github.com/Stabzs/Angular2-Toaster/issues/188).

# 7.0.0 (2018-11-17)
### FEATURES 
* **angular2-toaster:** Full release of 7.0.0 functionality.  Pins the library to 7.0.0 versions 
of Angular. Closes [#181](https://github.com/Stabzs/Angular2-Toaster/issues/181).


# 6.1.0 (2018-06-21)
### FEATURES
* **toaster-container.component:** Added bypassSecurityTrustHtml support for the body parameter 
for the `TrustedHtml` body output type.  Thanks to @TGNC for making the change.  

### DOCUMENTATION
* **readme:** Documented ErrorHandler cases.  Closes [#169](https://github.com/Stabzs/Angular2-Toaster/issues/169).


# 6.0.0 (2018-05-19)
### FEATURES 
* **angular2-toaster:** Full release of 6.0.0 functionality.  Pins the library to 6.0.0 versions 
of Angular and RxJS. Closes [#161](https://github.com/Stabzs/Angular2-Toaster/issues/161).


# 5.1.0 (2018-05-19)
### FEATURES
* **toaster.service:** If a toastId is provided, that toastId is used instead of auto-generating 
a toastId.  Thanks to @sherlock1982 for his work on 
[#158](https://github.com/Stabzs/Angular2-Toaster/pull/158).

### BUG FIXES
* **toaster-container.component:** Mouseover functionality would incorrectly remove a toast when
the toast's timeout was set to 0 and the container's configuration was set to a value other than 0.  
Closes [#164](https://github.com/Stabzs/Angular2-Toaster/issues/164).


# 5.0.1 (2018-03-16)
### BUG FIXES
* **toaster-container.component:** Typescript compilation was failing for implicit any conversions 
for object typings for the configuration of showCloseButton, timeout, iconClasses and typeClasses. 
The type arguments have been strengthened to make more rigid compilation happy.  This should not 
affect anyone who was not abusing the expected typed arguments.
Closes [#150](https://github.com/Stabzs/Angular2-Toaster/issues/150).
Closes [#148](https://github.com/Stabzs/Angular2-Toaster/issues/148).

### FEATURES
* **demos:** The webpack demo has been rebuilt against `angular2-toaster@5.0.0` and webpack 4.
Closes [#147](https://github.com/Stabzs/Angular2-Toaster/issues/147).


# 5.0.0 (2018-02-24)
* **angular2-toaster:** Full release of 5.x.x functionality.  See CHANGELOG below for details.
Closes #144, #129, #142, #139 and #128.


# 5.0.0-alpha.1 (2018-02-22)
### FEATURES
* **angular2-toaster:** The toaster.css is now generated via SCSS.  Thanks to @bastienmoulia for his 
hard (and patient) work on this feature!

* **demos:** `angular-cli` project updated to include better examples around multi-container 
instances.

### BUG FIXES
* **toaster-container.component:** The container's config is no longer copied onto the toast 
instance.  Instead, titleClass and messageClass have been moved to input properties so that 
individual containers can uniquely style these properties for the same toast instance being 
broadcasted to multiple containers.  The `toasterconfig` property has been removed from 
`Toast` as a result to clean up the intent of the `Toast` interface.  Closes 
[#144](https://github.com/Stabzs/Angular2-Toaster/issues/144).


# 5.0.0-alpha.1 (2018-02-04)
### BREAKING CHANGES
* **angular2-toaster:** The library's Angular dependencies have been pinned to a minimum version of 
5.0.0 for common, compiler, and core and RxJS has been pinned to a minimum of 5.4.2 due to defects 
in lower RxJS versions.

* **toaster.module:** `ToasterModule` now exposes both `forRoot` and `forChild` methods to ensure 
that `ToasterService` is always provided as a singleton instance.  `ToasterModule` should always be 
called with `forRoot` in the root of the application and subsequently called with `forChild` in 
additional "per component" container injections.  Closes 
[#129](https://github.com/Stabzs/Angular2-Toaster/issues/129).

### FEATURES
* **angular2-toaster:** A `toaster.min.css` file inclusion has been added.  Closes 
[#142](https://github.com/Stabzs/Angular2-Toaster/issues/142).

* **demos:** Rebuilt the `angular-cli` demo to pull from local pathing to allow for better local 
examples.

### BUG FIXES
* **toaster.css:** The close button is now properly responsive and no longer overflows its 
boundaries at collapsed resolutions.  Closes 
[#139](https://github.com/Stabzs/Angular2-Toaster/issues/139).

* **angular2-toaster:** Optimized builds now work as intended.  Closes
[#128](https://github.com/Stabzs/Angular2-Toaster/issues/128).

* **toaster-container.component:** If the same toast was broadcast to multiple containers, the 
removal of the timeout for a toast in one container would affect all other timeouts for all 
other containers for that toast instance.  Timeout Ids are now tracked internally in each container 
to ensure that each container's toast instance is tracked individually.


# 4.0.2 (2018-01-24)
### FEATURES
* **angular2-toaster:** Update Angular dependencies to support 5.x.x versions.  Thanks @isaacplmann!


# 4.0.1 (2017-7-16)
* **toaster-container.component:** The setTimeout call now runs outside of Angular and is patched on 
reentry with an `ngZone.run()` call.  This should provide better performance overall and should 
make protractor testing easier.  Closes 
[#120](https://github.com/Stabzs/Angular2-Toaster/issues/120).


# 4.0.0 (2017-5-25)
### BREAKING CHANGES
* **angular2-toaster:** Explicit animation configuration is now required for the library.

### FEATURES
* **angular2-toaster:** Animation support has been added.
Closes [#95](https://github.com/Stabzs/Angular2-Toaster/issues/95).

* **angular2-toaster:** `angular2-toaster` is now compiled with the `strictNullChecks` flag on by
default.

* **toast.ts:** A `data:any` property has been added to the toast instance.  This allows for data 
to be attached to a toast instance, accessible within an associated component.  Closes 
[#112](https://github.com/Stabzs/Angular2-Toaster/issues/112).

* **tslint:** Added tslint to support cleaning up the style of the library and added initial 
cleanup changes.

### BUG FIXES
* **toast.component.ts:** The elvis operator has been added to `titleClass` and `messageClass` 
toasterconfig property bindings in order to allow the library to be consumed by Ahead of Time 
compilation utilizing the `strictNullChecks: true` configuration.
Closes [#111](https://github.com/Stabzs/Angular2-Toaster/issues/111)

### DOCUMENTATION
* **README:**  The documentation has been expanded to support the new animation feature.

* **demos:** Cleaned up the `webpack` demo and added a simple `angular-cli` example.


# 3.0.0 (2017-3-30)
### BREAKING CHANGES
* **angular2-toaster:** The library's Angular dependencies have been pinned to a minimum version of 
4.0.0 for common, compiler, and core.

### Features
* **angular2-toaster:** The library has been recompiled against the 4.0.1 version of the Ahead of 
Time Angular compiler, resulting in smaller bundled UMD files.  This allows for faster downloading 
and bootstrapping of the library. 
Closes [#106](https://github.com/Stabzs/Angular2-Toaster/issues/106).

### Bug Fixes
* **toaster.css:** Center-positioned postionClasses now properly align in the middle of the page. 
Closes [#104](https://github.com/Stabzs/Angular2-Toaster/issues/104).


# 2.0.0 (2016-12-21)
### BREAKING CHANGES
* **angular2-toaster:** The library has been converted to a UMD Format to mirror @angular packages 
and properly expose the top-level module.  As a result, a number of changes have been implemented 
and require updates to your code.
    - You no longer need to (or can) import from `angular2-toaster/angular2-toaster`.  You can now 
    import directly from `angular2-toaster`.
    - There is no longer a `/lib` folder.  The `toaster.css` file has been moved to the root of the 
    package since this is a top-level file, just like `angular2-toaster`.
    - If you still need to deep-link to a specific file rather than consuming it via 
    `angular2-toaster`, the compiled files are now available under `/src` instead of `/lib`.
    - The default module style for the library is now `es2015` instead of `commonjs`.

### Features
* **angular2-toaster:** UMD files are now included under the `/bundles` folder of the package. The 
UMD files expect `@angular/core`, `@angular/common`, and `rxjs` to exist in the global namespaces 
if being consumed.

### Bug Fixes
* **angular2-toaster:** The peerDependency requirement for rxjs has been relaxed to 
`rxjs@^5.0.0-beta.11`.  This allows for flexibility all the way back to `@angular@2.0.0`. 
Closes [#87](https://github.com/Stabzs/Angular2-Toaster/issues/87).

* **angular2-toaster:** The `angular2-toaster` package entrance was never compiled via Ahead of 
Time compilation.  As a result, no `metadata.json` was available for the package entrance point 
and the library could not be consumed with AoT if trying to import directly from 
`angular2-toaster`. This has been corrected.

### Documentation
* **README:** The README documentation has been restructured to make it easier to find key 
information, such as how to get started.  All import examples have been updated to match the new 
package structure.


# 1.1.0 (2016-12-02)
### Features
* **toast.component:** When rendering BodyOutputType.Component, the toast instance itself is 
applied to the rendered component.  This allows the component to interact with the toast as 
needed, as well as expose access to the toast id.  
Addresses [#84](https://github.com/Stabzs/Angular2-Toaster/issues/84).

### Bug Fix
* **toaster-container.component:** ResetTimer on mouseout was not being properly called. It is 
now called appropriately when mouseoverTimerStop is set to true.  Thanks to @kb3eua.

### Documentation
* **README:** Documented the mouseoverTimerStop config option and documented the addition of the 
toast instance to components when using BodyOutputType.Component.  Closes 
[#83](https://github.com/Stabzs/Angular2-Toaster/issues/83).


# 1.0.2 (2016-10-12)
### Features
* **Angular 2.0.2 Support:** The library has been tested through to Angular 2.0.2.

### Bug Fixes
* **toast.component:** Dynamic template data would break `bodyOutputType.Component` rendering. 
A forced `detectChanges()` call has been added after the component is created and loaded to enable 
this functionality.  Additional test cases were added for the gap.  Closes 
[#71](https://github.com/Stabzs/Angular2-Toaster/issues/71).
* **angular2-toaster.js:** The library entrance attempts to load `Toast` from `./lib/toast`.  Since 
the `Toast` file is an interface-only file, there is nothing to load.  Closes 
[#70](https://github.com/Stabzs/Angular2-Toaster/issues/70).


# 1.0.1 (2016-09-16)
### Bug Fix
* **package.json:** The `typings install` step was incorrectly set in the `postinstall` hook when 
it should have been set in the `prebuild` hook.  This was causing typings to attempt to be 
installed whenever the package was installed, which was incorrect.  Closes 
[#67](https://github.com/Stabzs/Angular2-Toaster/issues/67).


# 1.0.0 (2016-09-15)
### Features
* **Angular: Final Version:** The library has been updated to Angular `2.0.0` and the version has 
been bumped to `1.0.0` as a result. Closes [#63](https://github.com/Stabzs/Angular2-Toaster/issues/63).
* **typings:** The library has been updated from tsd to typings.  Typings have been updated and 
wired into the build and are now re-installed on `npm install`. In addition, typings are no 
longer checked into source.  Closes [#60](https://github.com/Stabzs/Angular2-Toaster/issues/60).

### Bug Fixes
* **package.json:** The main entrance has been updated to `angular2-toaster.js`.  Addresses 
[#60](https://github.com/Stabzs/Angular2-Toaster/issues/60).
* **toast.component:** The `bodyOutputType` property is public to enable AoT compilation on the 
template. Closes [#62](https://github.com/Stabzs/Angular2-Toaster/issues/62).
* **toaster.container.spec:** The `TestComponent` module was improperly defined, causing errors in 
the corresponding `ngFactory` file.  This has been corrected, closing 
[#64](https://github.com/Stabzs/Angular2-Toaster/issues/64).


# 0.5.2-rc.7 (2016-09-14)
### Features
* **Angular: RC7:** The library has been updated to Angular RC7.
Closes [#59](https://github.com/Stabzs/Angular2-Toaster/issues/59).
* **toaster.service:** A `removeToast` observable has been added to toasterService. This allows the 
consumer to be notified when any toast is removed.  This was added in 
[#58](https://github.com/Stabzs/Angular2-Toaster/pull/58).


# 0.5.1-rc.6 (2016-09-06)
### Bug Fixes
* **toaster.module:** Toaster Module was improperly using `BrowserModule` when it should have been 
importing `CommonModule`.  Closes [#55](https://github.com/Stabzs/Angular2-Toaster/issues/55).
* **Test Build:** Corrected broken Travis-CI build.


# 0.5.0-rc.6 (2016-09-01)
### Features
* **Angular: RC6:** The library has been updated to Angular RC6.
Closes [#52](https://github.com/Stabzs/Angular2-Toaster/issues/52).
* **Documentation:** Updated to close 
[#51](https://github.com/Stabzs/Angular2-Toaster/issues/51).

### Breaking Changes
* **package dependencies:** @angular packages and the rxjs package have been removed from 
dependencies and added to peerDependencies to allow for more flexible consumption of alternative 
builds and configurations.  The consumer is now responsible to ensure that the correct version is 
used per the minimum requirements in 
[package.json](https://github.com/Stabzs/Angular2-Toaster/blob/master/package.json).
Closes [#50](https://github.com/Stabzs/Angular2-Toaster/issues/50).

* **toast.component:** Due to Angular2-RC5 deprecating `ComponentResolver` and Angular2-RC6 
removing `ComponentResolver`, dynamic component resolution has been moved to 
`Compiler.compileComponentAsync`.

* **toast.component:** Dynamic body rendering via component has been moved to the `ngAfterViewInit` 
lifecycle hook to ensure full module compilation is complete and metadata is attached before 
attempting to render the component.

* **toast.component:** RC6 requires that all dynamically rendered components be enclosed in a 
`NgModule`.  If a module is not used, an error will be thrown at runtime.


# 0.4.0-rc.5 (2016-08-24)
### Features
* **toast.module:** toast.module renamed to  **toaster.module** for greater consistency with other 
components representing top-level APIs.
* **demo:** A plunker demo has been created and added to the README to begin work on 
[#46](https://github.com/Stabzs/Angular2-Toaster/issues/46).

### Bug Fixes
* **toaster.module:** previous NPM build 0.3.6-rc.5 was improperly built with **toast.module** not 
being included. The module is now renamed and included appropriately.


# 0.3.6-rc.5 (2016-08-18)
### Features
* **Angular: RC5:** The library has been updated to Angular RC5.
* **Angular:** Toaster is now encapsulated in an ngModule **ToastModule** [#47](https://github.com/Stabzs/Angular2-Toaster/issues/47).


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