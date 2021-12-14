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
import { ShowTicketsAllUsersComponent } from "./ticket/components/show-tickets-all-users/show-tickets-all-users.component";
import { ShowTicketsComponent } from "./ticket/components/show-tickets/show-tickets.component";
import { TicketsComponent } from "./ticket/components/ticket/tickets.component";
import { TicketService } from "./services/ticket.service";
import { DetailsOfTicketComponent } from "./ticket/components/details-of-ticket/details-of-ticket.component";

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
    ShowTicketsAllUsersComponent,
    DetailsOfTicketComponent,
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
        path: "tickets/:id",
        component: DetailsOfTicketComponent,
        canActivate: [AuthorizeGuard],
        data: { allowedRoles: ["Administrator", "Moderator"] },
      },
      { path: "users/login", component: LoginComponent },
      {
        path: "users/:id",
        component: UserDetailsComponent,
        canActivate: [AuthorizeGuard],
        data: { allowedRoles: ["Administrator"] },
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
  ],
  providers: [
    UserService,
    TicketService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizeInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
