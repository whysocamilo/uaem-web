import { UsersService } from './../../../@core/services/users.service';
import { AuthService } from '@core/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  constructor(private usersApi: UsersService, private auth: AuthService) { }

  ngOnInit(): void {
  this.usersApi.getUsers(2, 1).subscribe( result => {
      // { { status message users: []}
    });
    /*this.auth.getMe().subscribe( result => {
      console.log(result); // { status message user: {}}
    });*/
  }
}
