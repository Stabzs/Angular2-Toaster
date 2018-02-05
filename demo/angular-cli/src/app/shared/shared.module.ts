import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterModule } from '@angular2-toaster/angular2-toaster';
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    //ToasterModule.forChild()
  ],
  providers: [
  ],
  entryComponents: [
  ],
  declarations: [
  ],
  exports: [
    CommonModule,
    RouterModule,
    ToasterModule,
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}
