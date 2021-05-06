import { Injectable } from '@angular/core';
import { IToast } from "../models/IToast";

@Injectable({ providedIn: 'root' })

export class ToastService {
  toasts: IToast[] = [];

  show(textOrTpl: string, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast: IToast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
