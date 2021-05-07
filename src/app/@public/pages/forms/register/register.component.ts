import { Router } from '@angular/router';
import { UsersService } from '@core/services/users.service';
import {IRegisterForm, IResultRegister } from '@core/interfaces/register.interface';
import { Component, OnInit } from '@angular/core';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  register: IRegisterForm = {
    name: '',
    lastname: '',
    email: '',
    password: '',
    birthday: '',
  };
  constructor(private api: UsersService, private router: Router) {}
  ngOnInit(): void {
    const data = new Date();
    data.setFullYear(data.getFullYear() - 5);
    this.register.birthday = data.toISOString().substring(0, 10);
    console.log(this.register);
  }
  // date
  private formatNumbers(num: number | string) {
    return +num < 10 ? `0${num}` : num;
  }
  // format date
  dataAsign($event) {
    console.log('registro con datos', $event);
    const fecha = `${$event.year}-${this.formatNumbers(
      $event.month
    )}-${this.formatNumbers($event.day)}`;
    this.register.birthday = fecha;
  }
  // register
  add() {
    console.log('Enviando datos', this.register);
    this.api.register(this.register).subscribe((result: IResultRegister) => {
      console.log('Result', result);
      if (!result.status) {
        basicAlert(TYPE_ALERT.WARNING, result.message);
        return;
      }
      basicAlert(TYPE_ALERT.SUCCESS, result.message);
      this.router.navigate(['/login']);
    });
  }
}