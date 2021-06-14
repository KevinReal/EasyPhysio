import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulerComponent } from "./scheduler/scheduler.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AuthLoggedGuard } from "./guards/authLogged.guard";
import { AuthNotLoggedGuard } from "./guards/auth-not-logged.guard";

const routes: Routes = [
  { path: 'agenda', component: SchedulerComponent, canActivate: [AuthLoggedGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthNotLoggedGuard]},
  { path: 'signup', component: SignupComponent, canActivate: [AuthNotLoggedGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: SchedulerComponent, canActivate: [AuthLoggedGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
