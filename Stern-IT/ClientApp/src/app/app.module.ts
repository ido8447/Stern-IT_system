import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { HomeComponent } from "./home/home.component";
import { CounterComponent } from "./counter/counter.component";
import { FetchDataComponent } from "./fetch-data/fetch-data.component";
import { UserService } from "./user/services/user.service";
import { RegisterComponent } from "./user/components/register/register.component";
import { LoginComponent } from "./user/components/login/login.component";
import { AuthorizeInterceptor } from "./auth/authorize.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    RegisterComponent,
    LoginComponent,
    
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    FormsModule,

    //the app router file
    RouterModule.forRoot([
      { path: "", component: HomeComponent, pathMatch: "full" },
      { path: "counter", component: CounterComponent },
      { path: "fetch-data", component: FetchDataComponent },
      { path: "users/register", component: RegisterComponent },
      { path: "users/login", component: LoginComponent },
    ]),
    ReactiveFormsModule,
  ],
  providers: [UserService,{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthorizeInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
