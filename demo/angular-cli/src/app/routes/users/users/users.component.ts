import { Component, OnInit } from '@angular/core';
import {ToasterService, IToasterConfig, ToasterConfig } from "@angular2-toaster/angular2-toaster";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(public toasterService: ToasterService) {}

  config: IToasterConfig = new ToasterConfig({
    animation: 'fade', 
    newestOnTop: false, 
    positionClass: 'toast-top-center', 
    toastContainerId: 3, 
    titleClass: 'title-2',
    timeout: 0
  });

  popToast() {
    // randomly target just the layout container
    let rand = Math.floor((Math.random() * Math.floor(2)));
    let toastContainerId = rand === 1 ? rand : null;

    let toast = this.toasterService.pop({
      type: 'success', 
      title: 'Args Title', 
      body: 'Args Body',
      //toastContainerId: toastContainerId
    });

    window.setTimeout(() => toast.title = 'Updated Title', 1000)
  }

  ngOnInit() {}
}
