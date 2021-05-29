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
      subject: 'Recibo de su pago a Uaem Store S.A. de C.V.',
      html: `
      Envió un pago Uaem Store S.A. de C.V.<strong>(info@uaemstore.mx)</strong><br>
      <br><strong>Puede tomar unos minutos que esta transacción aparezca en su cuenta.</strong><br>
      <br> Puedes consultarlo su recibo de compra: <a href="${charge.receiptUrl}" target="_blank">Aqui</a><br>
      <br> <strong>¿Tiene problemas con esta transacción?</strong> <br>
      <br> Dispone de 180 días desde la fecha de la transacción para presentar una controversia en el Centro de resoluciones.<br>
      <br>Gracias.
      <br>Equipo de cuentas UAEM.
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
        'Cliente no existe',
        'Necesitamos un cliente para realizar el pago'
      );
      const stripeName = `${this.meData.user.name} ${this.meData.user.lastname}`;
      loadData('Procesando la información', 'Creando el cliente...');
      this.customerService
        .add(stripeName, this.meData.user.email)
        .pipe(take(1))
        .subscribe(async (result: { status: boolean; message: string }) => {
          if (result.status) {
            await infoEventAlert(
              'Cliente añadido al usuario',
              'Reiniciar la sesión',
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
