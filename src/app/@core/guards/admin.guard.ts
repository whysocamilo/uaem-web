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
      console.log('Se ha iniciado sesión correctamente');
      const dataDecode = this.decodeToken();
      console.log(dataDecode);
      // comprobacion de la caducidad del token
      if (dataDecode.exp < new Date().getTime() / 1000) {
        console.log('Sesión caducada');
        return this.redirect();
      }
      // comprobacion del rol de administradir
      if (dataDecode.user.role === 'ADMIN') {
        console.log('Rol de Admin');
        return true;
      }
      console.log('No contamos con el rol de administrador');
    }
    console.log('Sesion invalida');
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
