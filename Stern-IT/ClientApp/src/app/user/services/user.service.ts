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

  //the model of the register page, with
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
  //save token and login to the system
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
  //remove the token and navigate to default form
  logout() {
    this.authorizedUser$.next(undefined);
    localStorage.removeItem("token");
    this.router.navigateByUrl("/");
  }

  //get token from local storage
  //reurn true\false if token exist
  //if exist, there is a connect user
  authorizedUser() {
    return localStorage.getItem("token") != null;
  }

  //todo check if it workes
  //show info of user
  getAuthorizedUserInfo() {
    return this.httpClient.get(
      this.baseURL + this.apiURL + "GetAuthorizedUserInfo"
    );
  }

  //if there is a token (user connect)
  //it return the email of this user by read the token with atob and json parse
  //atob: return information of some token
  //json parse: change mode to json
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
  //check if 2 passwords have a match or not
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

  //get some role
  //return true\false if this user has this role from input
  allowedRole(rolesArray: string[]): boolean {
    let match = false;
    //read the token by window.atob
    //export role information from it
    const role = JSON.parse(
      window.atob(localStorage.getItem("token").split(".")[1])
    ).role;
    //if it has 1 role
    //the type will be string
    //find from all roles if there is a match
    if (typeof role == "string") {
      rolesArray.forEach((element) => {
        if (role == element) {
          match = true;
          return false;
        }
      });
    }
    //if it has 2 and up roles
    //the type will be array
    //find from all roles if there is a match
    else if (Array.isArray(role)) {
      if (rolesArray.filter((element) => role.includes(element)).length > 0) {
        match = true;
      }
    }
    return match;
  }
}

export interface AuthorizedUser {
  Email: string;
}
