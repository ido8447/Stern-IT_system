import { Inject, Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { registerLocaleData } from "@angular/common";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  baseURL: string;
  apiURL = "api/Users/";
  authorizedUser$: Subject<AuthorizedUser> = new Subject<AuthorizedUser>();

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    @Inject("BASE_URL") baseURL: string,
    private router: Router
  ) {
    this.baseURL = baseURL;
  }

  formRegisterModel = this.formBuilder.group({
    Email: ["", Validators.email],
    Passwords: this.formBuilder.group(
      {
        Password: ["", [Validators.required, Validators.minLength(4)]],
        ConfirmPassword: ["", Validators.required],
      },
      {
        validator: this.comparePasswords,
      }
    ),
  });
  //register function
  register() {
    const body = {
      Email: this.formRegisterModel.value.Email,
      Password: this.formRegisterModel.value.Passwords.Password,
    };
    return this.httpClient.post(this.baseURL + this.apiURL + "Register", body);
  }
  //login function
  login(user: any) {
    this.authorizedUser$.next({
      Email: "",
    });
    this.httpClient
      .post(this.baseURL + this.apiURL + "Login", user)
      .subscribe((res: any) => {
        this.authorizedUser$.next({
          Email: JSON.parse(window.atob(res.token.split(".")[1])).Email,
        });

        localStorage.setItem("token", res.token);
        this.router.navigateByUrl("/");
      });
  }
  //loguot function
  logout() {
    this.authorizedUser$.next(undefined);
    localStorage.removeItem("token");
    this.router.navigateByUrl("/");
  }
  authorizedUser() {
    return localStorage.getItem("token") != null;
  }

  getAuthorizedUserInfo() {
    // const token = new HttpHeaders({'Authorized': 'Bearer '+localStorage.getItem('token')});
    // return this.httpClient.get(this.baseURL+this.apiURL+'GetAuthorizedUserInfo',{headers: token});
    return this.httpClient.get(
      this.baseURL + this.apiURL + "GetAuthorizedUserInfo"
    );
  }

  getAuthorizedUserEmail() {
    if (localStorage.getItem("token")) {
      return JSON.parse(
        window.atob(localStorage.getItem("token".split(".")[1]))
      ).Email;
    } else {
      return "";
    }
  }
  //password mismatch function
  comparePasswords(formBuilder: FormGroup) {
    const confirmPassword = formBuilder.get("ConfirmPassword");
    if (
      confirmPassword.errors == null ||
      "passwordMismatch" in confirmPassword.errors
    ) {
      if (formBuilder.get("Password").value != confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
      } else {
        confirmPassword.setErrors(null);
      }
    }
  }
  allowedRole(allowedRole: string[]): boolean{
    let match = false;
    const role = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1])).role;
    if (typeof(role)=="string") {
      allowedRole.forEach(element => {
        if (role==element) {
          match=true;
          return false;
        }
      });
    }
    else if(Array.isArray(role)){
      if (allowedRole.filter(element=>role.includes(element)).length>0) {
        match=true;
      }
    }
    return match;
  }
}

export interface AuthorizedUser {
  Email: string;
}
