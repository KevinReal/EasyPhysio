import { Component } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FirebaseAuthService } from "./services/firebase-auth.service";
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import { faChartPie } from '@fortawesome/free-solid-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent{
  title = 'EasyPhysio';

  faCog = faCog;
  faSignOutAlt = faSignOutAlt;
  faChartPie = faChartPie;
  faShoppingCart = faShoppingCart;
  faInfoCircle = faInfoCircle;
  faUserCircle = faUserCircle;
  faHistory = faHistory;
  faCalendarAlt = faCalendarAlt;

  constructor(public firebaseAuth: FirebaseAuthService) { }

  logout(): void {
    this.firebaseAuth.logout();
  }
}
