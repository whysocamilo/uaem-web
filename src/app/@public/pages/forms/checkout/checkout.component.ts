import { IMeData } from '@core/interfaces/session.interface';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { StripePaymentService } from '@mugan86/stripe-payment-form';
import { take } from 'rxjs/internal/operators/take';

import { CURRENCY_CODE } from '@core/constants/config';
import { infoEventAlert, loadData } from '@shared/alerts/alerts';

import { TYPE_ALERT } from '@shared/alerts/values.config';

import { IPayment } from '@core/interfaces/stripe/payment.interface';

import { ICharge } from '@core/interfaces/stripe/charge.interface';
import { IMail } from '@core/interfaces/mail.interface';
import { MailService } from '@core/services/mail.service';
import { CartService } from '@client/core/services/cart.service.ts.service';
import { ChargeService } from '@client/core/services/stripe/charge.service';
import { CustomerService } from '@client/core/services/stripe/customer.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  meData: IMeData;
  key = environment.stripePublicKey;
  address = '';
  available = false;
  block = false;
  constructor(
    private auth: AuthService,
    private router: Router,
    private stripePayment: StripePaymentService,
    private cartService: CartService,
    private customerService: CustomerService,
    private chargeService: ChargeService,
    private mailService: MailService
  ) {
    this.auth.accessVar$.subscribe((data: IMeData) => {
      if (!data.status) {
        // Ir a login
        this.router.navigate(['/login']);
        return;
      }
      this.meData = data;
    });

    this.cartService.itemsVar$.pipe(take(1)).subscribe(() => {
      if (this.cartService.cart.total === 0 && this.available === false) {
        this.available = false;
        this.notAvailableProducts();
      }
    });

    this.stripePayment.cardTokenVar$
      .pipe(take(1))
      .subscribe((token: string) => {
        if (
          token.indexOf('tok_') > -1 &&
          this.meData.status &&
          this.address !== ''
        ) {
          if (this.cartService.cart.total === 0) {
            this.available = false;
            this.notAvailableProducts();
          }
          // Almacenar la información para enviar
          const payment: IPayment = {
            token,
            amount: this.cartService.cart.total.toString(),
            description: this.cartService.orderDescription(),
            customer: this.meData.user.stripeCustomer,
            currency: CURRENCY_CODE,
          };
          this.block = true;
          // Enviar la información y procesar el pago
          this.chargeService
            .pay(payment)
            .pipe(take(1))
            .subscribe(
              async (result: {
                status: boolean;
                message: string;
                charge: ICharge;
              }) => {
                if (result.status) {
                  console.log('OK');
                  console.log(result.charge);
                  await infoEventAlert(
                    'Pedido realizado',
                    'Revisa tu correo para obtener mas detalles.',
                    TYPE_ALERT.SUCCESS
                  );
                  this.sendEmail(result.charge);
                  this.router.navigate(['/']);
                  this.cartService.clear();
                  return;
                } else {
                  console.log(result.message);
                  await infoEventAlert(
                    'Pedido Rechazado',
                    'El pedido no se ha completado.',
                    TYPE_ALERT.SUCCESS
                  );
                }
                this.block = false;
              }
            );
        }
      });
  }
  sendEmail(charge: ICharge) {
    const mail: IMail = {
      to: charge.receiptEmail,
      subject: 'Factura emitida ',
      html: ` 
      <div class="">
      <div class="aHl"></div>
      <div id=":cm" tabindex="-1"></div>
      <div id=":e6" class="ii gt">
        <div id=":e5" class="a3s aiL">
          <u></u>
          <div>
            <table
              width="100%"
              border="0"
              cellspacing="0"
              cellpadding="0"
              bgcolor="#ffffff"
            >
              <tbody>
                <tr>
                  <td style="font-size: 0">&nbsp;</td>
                  <td
                    align="center"
                    valign="middle"
                    width="600"
                    height="300"
                    bgcolor="#ffffff"
                  >
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background-color: #ffffff;
                        border: solid 1px #dddddd;
                        margin-top: 16px;
                        border-radius: 8px 8px 0px 0px;
                      "
                    >
                      <tbody>
                        <tr></tr>
                        <tr></tr>
                        <tr>
                          <td
                            style="
                              text-align: left;
                              height: 64px;
                              padding: 12px 0px 4px 16px;
                            "
                          >
                            <a>
                              <h2
                                style="
                                  margin-top: 0px;
                                  margin-bottom: 8px;
                                  color: #1b5ab9;
                                "
                              >
                                UAEM STORE
                              </h2>
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background-color: #ffffff;
                        border-bottom: solid 1px #dddddd;
                        border-right: solid 1px #dddddd;
                        border-left: solid 1px #dddddd;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              text-align: left;
                              line-height: 24px;
                              vertical-align: middle;
                              font-size: 16px;
                              padding: 16px;
                            "
                          >
                            <h2
                              style="
                                margin-top: 0px;
                                margin-bottom: 8px;
                                color: #1b5ab9;
                              "
                            >
                              Factura emitida
                            </h2>
                            <p style="margin: 0px; color: #666666">
                              Hemos anexado la factura de su compra a este correo
                              para su comodidad. Puede tomar unos minutos para que la
                              transacción aparezca en su cuenta.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background-color: #ffffff;
                        border-bottom: solid 1px #dddddd;
                        border-right: solid 1px #dddddd;
                        border-left: solid 1px #dddddd;
                      "
                    >
                      <!--Link de la factura-->
                      <tbody>
                        <tr>
                          <td
                            style="
                              text-align: center;
                              line-height: 24px;
                              vertical-align: middle;
                              font-size: 16px;
                              padding: 32px;
                            "
                          >
                            <a
                              href = '${charge.receiptUrl}'
                              style="
                                text-decoration: none;
                                padding: 16px;
                                border-radius: 4px;
                                background-color: #06b;
                                font-size: 16px;
                                font-weight: bold;
                                color: white;
                              "
                              target="_blank"
                            >
                              Obtener factura
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background-color: #ffffff;
                        border-bottom: solid 1px #dddddd;
                        border-right: solid 1px #dddddd;
                        border-left: solid 1px #dddddd;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              text-align: left;
                              line-height: 24px;
                              vertical-align: middle;
                              font-size: 16px;
                              padding: 16px;
                            "
                          >
                            <h4
                              style="
                                margin-top: 0px;
                                margin-bottom: 8px;
                                color: #1b5ab9;
                              "
                            >
                              ¿Tiene problemas con esta transacción?
                            </h4>
                            <p
                              style="
                                margin: 0px;
                                padding: 4px;
                                border-radius: 4px;
                                background-color: #f6f6f6;
                                font-size: 14px;
                                color: #666666;
                                line-height: 16px;
                              "
                            >
                              <span style="font-weight: bold">Importante:</span>
                              Dispone de
                              <span style="font-weight: bold"
                                >7 días desde la fecha de la transacción</span
                              >
                              para presentar una controversia en el Centro de
                              resoluciones UAEM.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background-color: #2870c2;
                        border-bottom: solid 1px #dddddd;
                        border-right: solid 1px #dddddd;
                        border-left: solid 1px #dddddd;
                        margin-bottom: 16px;
                        border-radius: 0px 0px 8px 8px;
                      "
                    >
                      <tbody>
                        <tr valign="top">
                          <td
                            style="
                              text-align: center;
                              padding: 4px;
                              line-height: 14px;
                              color: #dddddd;
                              font-size: 12px;
                            "
                          >
                            Av. Universidad No. 1001, Col Chamilpa, Cuernavaca,
                            Morelos, México. C.P. 62209
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td style="font-size: 0">&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="yj6qo"></div>
          <div class="adL"></div>
        </div>
      </div>
      <div id=":yp" class="ii gt" style="display: none">
        <div id=":yq" class="a3s aiL"></div>
      </div>
      <div class="hi"></div>
    </div>
      `,
    };
    this.mailService.send(mail).pipe(take(1)).subscribe();
  }

  async notAvailableProducts() {
    this.cartService.close();
    this.available = false;
    await infoEventAlert(
      'Acción no disponible',
      'No puedes realizar el pago sin productos en el carrito de la compra'
    );
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.auth.start();
    if (localStorage.getItem('address')) {
      this.address = localStorage.getItem('address');
      localStorage.removeItem('address');
    }
    this.cartService.initialize();
    localStorage.removeItem('route_after_login');
    this.block = false;
    if (this.cartService.cart.total === 0) {
      this.available = false;
      this.notAvailableProducts();
    } else {
      this.available = true;
    }
  }

  async sendData() {
    if (this.meData.user.stripeCustomer === null) {
      // Alerta para mostrar info
      await infoEventAlert(
        'Verificacion de pago',
        'Necesitamos verificar tu trasaccion para realizar el pago'
      );
      const stripeName = `${this.meData.user.name} ${this.meData.user.lastname}`;
      loadData('Procesando la información', '...');
      this.customerService
        .add(stripeName, this.meData.user.email)
        .pipe(take(1))
        .subscribe(async (result: { status: boolean; message: string }) => {
          if (result.status) {
            await infoEventAlert(
              'Metodo de pago verificado',
              'Reiniciando la sesión',
              TYPE_ALERT.SUCCESS
            );
            localStorage.setItem('address', this.address);
            localStorage.setItem('route_after_login', this.router.url);
            this.auth.resetSession();
          } else {
            await infoEventAlert(
              'Cliente no añadido',
              result.message,
              TYPE_ALERT.WARNING
            );
          }
        });
      return;
    }
    this.stripePayment.takeCardToken(true);
  }
}
