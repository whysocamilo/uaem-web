import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { IResultLogin, ILoginForm} from '@core/interfaces/login.interface';
import { AuthService } from '@core/services/auth.service';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent{
  login: ILoginForm = {
    email: '',
    password: '',
  };
  constructor(private auth: AuthService, private router: Router) {}
  // guardar el inicio de sesion del usuario
  init() {
    this.auth
      .login(this.login.email, this.login.password)
      .subscribe((result: IResultLogin) => {
        if (result.status) {
          if (result.token !== null) {
            basicAlert(TYPE_ALERT.SUCCESS, result.message);
            this.auth.setSession(result.token);
            this.auth.updateSession(result);
            this.router.navigate(['/']);
            return;
          }
          basicAlert(TYPE_ALERT.WARNING, result.message);
          return;
        }
        basicAlert(TYPE_ALERT.INFO, result.message);
      });
  }
}
