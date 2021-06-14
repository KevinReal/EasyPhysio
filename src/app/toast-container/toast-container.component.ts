import { Component, TemplateRef } from '@angular/core';

import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  "host": {'[class.ngb-toasts]': 'true'}
})

export class ToastContainerComponent {

  hide = true;

  constructor(public toastService: ToastService) {}

  isTemplate(toast: any): boolean { return toast.textOrTpl instanceof TemplateRef; }

  close(toast: any): void {
    toast.delay = 0;
    this.hide = true;
  }
}
