import { Inject, Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { registerLocaleData } from "@angular/common";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { ChangePassword, User } from "../models/user.model";
import { error } from "console";

@Injectable({
  providedIn: "root",
})
export class UserService {
  baseURL: string;
  apiURL = "api/Users/";
  authorizedUser$: Subject<AuthorizedUser> = new Subject<AuthorizedUser>();
  formTicketModel: any;
  userEmail: FormGroup;

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
    FirstName: ["", Validators.required],
    LastName: ["", Validators.required],
    Email: ["", Validators.email],
    PhoneNumber: ["", Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")],
    Passwords: this.formBuilder.group(
      {
        Password: ["", [Validators.required, Validators.minLength(5)]],
        ConfirmPassword: ["", Validators.required],
      },
      {
        validator: this.comparePasswords,
      }
    ),
  });
  //register function
  register() {
    var body = null;
    var PhoneNumber = this.formRegisterModel.value.PhoneNumber;
    if (PhoneNumber != "") {
      body = {
        FirstName: this.formRegisterModel.value.FirstName,
        LastName: this.formRegisterModel.value.LastName,
        Email: this.formRegisterModel.value.Email,
        Password: this.formRegisterModel.value.Passwords.Password,
        PhoneNumber: this.formRegisterModel.value.PhoneNumber,
      };
    } else {
      body = {
        FirstName: this.formRegisterModel.value.FirstName,
        LastName: this.formRegisterModel.value.LastName,
        Email: this.formRegisterModel.value.Email,
        Password: this.formRegisterModel.value.Passwords.Password,
      };
    }

    return this.httpClient.post(this.baseURL + this.apiURL + "Register", body);
  }
  //login function
  //save token and login to the system
  login(user: any) {
    this.authorizedUser$.next({
      Email: "",
    });
    this.httpClient.post(this.baseURL + this.apiURL + "Login", user).subscribe(
      (res: any) => {
        this.authorizedUser$.next({
          Email: JSON.parse(window.atob(res.token.split(".")[1])).Email,
        });
        this.userEmail = user.Email;
        localStorage.setItem("token", res.token);
        if (
          this.authorizedUser() &&
          !this.allowedRole(["Administrator"]) &&
          !this.allowedRole(["Operator"])
        ) {
          this.router.navigateByUrl("tickets").then(() => {
            window.location.reload();
          });
        } else {
          this.router.navigateByUrl("/").then(() => {
            window.location.reload();
          });;
        }
      },
      (error) => alert("Wrong Password")
    );
  }

  //loguot function
  //remove the token and navigate to default form
  logout() {
    this.authorizedUser$.next(undefined);
    localStorage.removeItem("token");
    this.router.navigateByUrl("/");
  }

  public get(Id?: string) {
    if (Id) {
      return this.httpClient.get(this.baseURL + this.apiURL + Id);
    } else {
      return this.httpClient.get(this.baseURL + this.apiURL);
    }
  }

  //get token from local storage
  //reurn true\false if token exist
  //if exist, there is a connect user
  authorizedUser() {
    return localStorage.getItem("token") != null;
  }

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
        window.atob(localStorage.getItem("token").split(".")[1])
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

  //Get ID (from userController)
  //Go to the URL => this.baseURL + this.apiURL + Id
  //and return this url with DELETE
  //Action the function on UserController
  delete(Id: string) {
    return this.httpClient.delete(this.baseURL + this.apiURL + Id);
  }

  //Get User (from userController)
  //Go to the URL => this.baseURL + this.apiURL + user.Id, user
  //and return this url with PUT
  //Action the function on UserController
  put(user: any) {
    return this.httpClient.put(this.baseURL + this.apiURL + user.Id, user);
  }

  //Get nothing (from userController)
  //Go to the URL => this.baseURL + this.apiURL + "GetRoles"
  //and return this url with GET
  //Action the function on UserController
  // public GetUserRoles(Email: string) {
  //   return this.httpClient.get(this.baseURL + this.apiURL + "GetUserRoles/" + Email);
  // }
  public GetRoles() {
    return this.httpClient.get(this.baseURL + this.apiURL + "GetRoles");
  }

  public GetManagers(): any {
    return this.httpClient.get(this.baseURL + this.apiURL + "ManagersList");
  }

  public AddCustomer(customerName: string) {
    return this.httpClient.post(
      this.baseURL + this.apiURL + "addCustomer/" + customerName,
      customerName
    );
  }

  public GetCustomer() {
    return this.httpClient.get(this.baseURL + this.apiURL + "getCustomer");
  }

  //getCustomerById/{id}

  public GetCustomerById(id: number) {
    return this.httpClient.get(
      this.baseURL + this.apiURL + "getCustomerById/" + id
    );
  }

  public deleteCustomer(customerId) {
    return this.httpClient.delete(
      this.baseURL + this.apiURL + "DeleteCustomer/" + customerId
    );
  }

  //getCustomerUsersById/{id}
  public GetCustomerUsersById(id: number) {
    return this.httpClient.get(
      this.baseURL + this.apiURL + "getCustomerUsersById/" + id
    );
  }

  public GetOpenTicketsByCustomer() {
    return this.httpClient.get(
      this.baseURL + this.apiURL + "OpenTicketsByCustomer"
    );
  }

  //GetMyCustomerByEmail
  public GetMyCustomerByEmail(Email: string) {
    return this.httpClient.get(
      this.baseURL + this.apiURL + "GetMyCustomerByEmail/" + Email
    );
  }

  public ChangePassword(ChangePasswordModel: ChangePassword) {
    return this.httpClient.post(
      this.baseURL + this.apiURL + "ChangePassword",
      ChangePasswordModel
    );
  }

  public GetManager(name: string) {
    return this.httpClient.get(
      this.baseURL + this.apiURL + "GetManager/" + name
    );
  }

  public Email: string;
}

export interface AuthorizedUser {
  Email: string;
}

export interface UserCustomer {
  Customer: string;
}
