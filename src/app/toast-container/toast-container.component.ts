import { Component, TemplateRef } from '@angular/core';

import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {'[class.ngb-toasts]': 'true'}
})

export class ToastContainerComponent {

  hide = true;

  constructor(public toastService: ToastService) {}

  isTemplate(toast: any) { return toast.textOrTpl instanceof TemplateRef; }

  close(toast: any) {
    toast.delay = 0;
    this.hide = true;
  }
}
