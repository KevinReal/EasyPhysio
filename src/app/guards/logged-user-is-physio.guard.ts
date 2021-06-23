import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseAuthService } from "../services/firebase-auth.service";
import { ToastService } from "../services/toast.service";

@Injectable({
  providedIn: 'root'
})

export class LoggedUserIsPhysioGuard implements CanActivate {

  constructor(private firebaseAuth: FirebaseAuthService,
              private toastService: ToastService,
              private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.firebaseAuth.getPhysioDNI()) {
      return true;
    }
    this.toastService.show('Para acceder a informes debe ser un fisioterapeuta.',
                    {classname: 'toast-warn',
                            delay: 10000});
    return this.router.parseUrl('/login');
  }

}
