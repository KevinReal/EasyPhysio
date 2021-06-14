import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseAuthService } from "../services/firebase-auth.service";

@Injectable({
  providedIn: 'root'
})

export class AuthNotLoggedGuard implements CanActivate {

  constructor(private firebaseAuth: FirebaseAuthService,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.firebaseAuth.isLoggedIn()) {
      return true;
    }
    return this.router.parseUrl('/agenda');
  }

}
