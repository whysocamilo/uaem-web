import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import jwtDecode from 'jwt-decode';
// tslint:disable-next-line: variable-name
const jwt_decode = require('jwt-decode');
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // comprobacion de un inicio de sesion
    if (this.auth.getSession() !== null) {
      const dataDecode = this.decodeToken();

      // comprobacion de la caducidad del token
      if (dataDecode.exp < new Date().getTime() / 1000) {
        return this.redirect();
      }
      // comprobacion del rol de administradir
      if (dataDecode.user.role === 'ADMIN') {
        return true;
      }
    }

    return this.redirect();
  }
  redirect() {
    this.router.navigate(['/']);
    return false;
  }
  decodeToken() {
    return jwtDecode(this.auth.getSession().token);
    return jwt_decode(this.auth.getSession().token);
  }
}
