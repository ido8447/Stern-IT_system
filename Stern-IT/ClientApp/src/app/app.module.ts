import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
//
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { MatRadioModule } from "@angular/material/radio";



import "hammerjs";
//
import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { HomeComponent } from "./home/home.component";
import { UserService } from "./services/user.service";
import { RegisterComponent } from "./user/components/register/register.component";
import { LoginComponent } from "./user/components/login/login.component";
import { AuthorizeInterceptor } from "./auth/authorize.interceptor";
import { AdministrationComponent } from "./admin/administration.component";
import { AuthorizeGuard } from "./auth/authorize.guard";
import { IndexComponent } from "./user/components/Index/index.component";
import { ListComponent } from "./user/components/list/list.component";
import { UserDetailsComponent } from "./user/components/details/details.component";
import { UserEditComponent } from "./user/components/edit/edit.component";
import { SidenavComponent } from "./sidenav/sidenav.component";

import { CreateTicketComponent } from "./ticket/components/createTicket/createTicket.component";
import { ShowTicketsComponent } from "./ticket/components/show-tickets/show-tickets.component";
import { TicketsComponent } from "./ticket/components/ticket/tickets.component";
import { TicketService } from "./services/ticket.service";
import { DetailsOfTicketComponent } from "./ticket/components/details-of-ticket/details-of-ticket.component";
import { ClosedticketsComponent } from './ticket/components/closedtickets/closedtickets.component';
import { EditTicketComponent } from './ticket/components/edit-ticket/edit-ticket.component';
import { CustomerListComponent } from './user/components/customer-list/customer-list.component';
import { CustomerDetailComponent } from './user/components/customer-detail/customer-detail.component';
import { CustomerTicketsComponent } from './ticket/components/customer-tickets/customer-tickets.component';
import { SendEmailService } from "./services/sendEmail.service";
import { PendingTicketsComponent } from './ticket/components/pending-tickets/pending-tickets.component';
import { ResetPasswordComponent } from './user/components/ResetPassword/reset-password/reset-password.component';
import { ResetPasswordCodeComponent } from './user/components/ResetPassword/reset-password-code/reset-password-code.component';
import { ResetPasswordNewPasswordComponent } from './user/components/ResetPassword/reset-password-new-password/reset-password-new-password.component';
import { FileService } from "./services/file.service";

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    IndexComponent,
    ListComponent,
    UserDetailsComponent,
    UserEditComponent,
    AdministrationComponent,
    SidenavComponent,
    TicketsComponent,
    CreateTicketComponent,
    ShowTicketsComponent,
    DetailsOfTicketComponent,
    ClosedticketsComponent,
    EditTicketComponent,
    CustomerListComponent,
    CustomerDetailComponent,
    CustomerTicketsComponent,
    PendingTicketsComponent,
    ResetPasswordComponent,
    ResetPasswordCodeComponent,
    ResetPasswordNewPasswordComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    FormsModule,

    //the app router file with guards
    RouterModule.forRoot([
      { path: "", component: HomeComponent, pathMatch: "full" },
      { path: "users/register", component: RegisterComponent },
      {
        path: "tickets",
        component: TicketsComponent,
        canActivate: [AuthorizeGuard],
      },
      {
        path: "create-ticket",
        component: CreateTicketComponent,
        canActivate: [AuthorizeGuard],
      },
      {
        path: "closed-ticket",
        component: ClosedticketsComponent,
        canActivate: [AuthorizeGuard],
      },
      {
        path: "tickets/:id",
        component: DetailsOfTicketComponent,
        canActivate: [AuthorizeGuard],
        // 
      },
      {
        path: "tickets/edit/:id",
        component: EditTicketComponent,
        canActivate: [AuthorizeGuard],
      },
      { path: "users/login", component: LoginComponent },
      { path: "users/ResetPassword", component: ResetPasswordComponent },
      { path: "users/ResetPasswordCode", component: ResetPasswordCodeComponent },
      { path: "users/NewPassword", component: ResetPasswordNewPasswordComponent },


      {
        path: "customer/:id",
        component: CustomerDetailComponent,
        canActivate: [AuthorizeGuard],
        data: { allowedRoles: ["Administrator", "Moderator"] },
      },
      {
        path: "customer-tickets/:id",
        component: CustomerTicketsComponent,
        canActivate: [AuthorizeGuard],
      },
      {
        path: "PendingTickets",
        component: PendingTicketsComponent,
        canActivate: [AuthorizeGuard],
      },
      {
        path: "users/:id",
        component: UserDetailsComponent,
        canActivate: [AuthorizeGuard],
        data: { allowedRoles: ["Administrator"] },
      },
      {
        path: "customers",
        component: CustomerListComponent,
        canActivate: [AuthorizeGuard],
        data: { allowedRoles: ["Administrator", "Moderator"] },
      },
      {
        path: "users/edit/:id",
        component: UserEditComponent,
        canActivate: [AuthorizeGuard],
        data: { allowedRoles: ["Administrator"] },
      },
      {
        path: "users",
        component: IndexComponent,
        canActivate: [AuthorizeGuard],
        data: { allowedRoles: ["Administrator"] },
      },
      {
        path: "administration",
        component: AdministrationComponent,
        canActivate: [AuthorizeGuard],
        data: { allowedRoles: ["Administrator"] },
      },

    ]),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatRadioModule,

  ],
  providers: [
    UserService,
    TicketService,
    SendEmailService,
    FileService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizeInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
