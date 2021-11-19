import { Inject, Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { registerLocaleData } from "@angular/common";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class UserService {
  baseURL: string;
  apiURL = "api/Users/";

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

  register() {
    const body = {
      Email: this.formRegisterModel.value.Email,
      Password: this.formRegisterModel.value.Passwords.Password,
    };
    return this.httpClient.post(this.baseURL + this.apiURL + "Register", body);
  }
  //
  login(user: any) {
    this.httpClient.post(this.baseURL + this.apiURL + 'Login',user).subscribe(
      (res:any)=>{
        localStorage.setItem('token',res.token);
        this.router.navigateByUrl('/');
      }
    );
  }
  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/');
  }
autuorizedUser(){
  return localStorage.getItem('token') != null;
}

  //
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
}
