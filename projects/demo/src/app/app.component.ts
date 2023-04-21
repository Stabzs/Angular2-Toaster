import { Component } from '@angular/core';
import { DefaultIconClasses, DefaultTypeClasses, IToasterConfig, ToasterConfig }
  from '../../../angular2-toaster/src/lib/toaster-config';
import { ToasterService } from '../../../angular2-toaster/src/lib/toaster.service';
import { Toast, ToastType } from '../../../angular2-toaster/src/lib/toast';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo';

  extendedTypeClasses = { ...DefaultTypeClasses, ...{ customtype: 'toast-success' }};
  extendedIconClasses = { ...DefaultIconClasses, ...{ customtype: 'icon-error' }};

  appConfig: IToasterConfig = new ToasterConfig({
    animation: 'fade', newestOnTop: true, positionClass: 'toast-bottom-right',
    toastContainerId: 1, timeout: 0, showCloseButton: true, // mouseoverTimerStop: true
    typeClasses: <ExtendedToastType>this.extendedTypeClasses,
    iconClasses: <ExtendedToastType>this.extendedIconClasses
  });

  testConfig: IToasterConfig = new ToasterConfig({
    animation: 'fade', newestOnTop: true, positionClass: 'toast-bottom-left',
    toastContainerId: 1, timeout: 0, showCloseButton: true, mouseoverTimerStop: true,
    typeClasses: <ExtendedToastType>{
      customtype: 'toast-success',
      error: 'toast-error',
      info: 'toast-info',
      wait: 'toast-wait',
      success: 'toast-success',
      warning: 'toast-warning'
    },
    iconClasses: <ExtendedToastType>{
      customtype: 'icon-error',
      error: 'icon-error',
      info: 'icon-info',
      wait: 'icon-wait',
      success: 'icon-success',
      warning: 'icon-warning'
    }
    // titleClass: 'title-1'
  });

  constructor (public toasterService: ToasterService) { }

  popToast() {
    let toast = this.toasterService.pop({
      type: 'success',
      title: 'Home Title',
      body: 'Home Body'
    });

    window.setTimeout(() => toast.title = 'Updated Home Title', 1000)
  }

  persistentToast() {
    this.toasterService.popAsync({
      type: <ExtendedToastType>'customtype',
      title: 'Click Me',
      body: 'I am sticky with a really long body let us see what happens',
      tapToDismiss: false,
      onClickCallback: (t) => console.log(t.toastId),
      showCloseButton: true
    }).subscribe(x => console.log(x));
  }

  ngAfterViewInit() {
    console.log('entering view init');
    const t = 'bad value';
    const toast: Toast = {
      type: <ExtendedToastType>t,
      body: 'I am init toast'
    };
    this.toasterService.pop(toast);
  }

  toto() {
    console.log('todo button clicked');
    const toast: Toast = {
      type: 'success',
      body: 'I am todo toast',
      timeout: 5000,
      progressBar: true
    };
    this.toasterService.pop(toast);
  }

  clear() {
    this.toasterService.clear();
  }
}

type ExtendedToastType = ('customtype' | 'bad value') & ToastType;
