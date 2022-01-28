import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { ResetPasswordComponent } from "../reset-password/reset-password.component";

@Component({
  selector: "app-reset-password-new-password",
  templateUrl: "./reset-password-new-password.component.html",
  styleUrls: ["./reset-password-new-password.component.css"],
})
export class ResetPasswordNewPasswordComponent implements OnInit {
  @Input() incoming_data: string = "";  
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
  }

  
  
  
  ChangePassword = {
    Email: '',
    Password: ''
  }
  Reset() {
    this.ChangePassword.Password = this.ResetPasswordModel.value.Passwords.Password;
    this.ChangePassword.Email = this.userService.Email;



    this.userService.ChangePassword(this.ChangePassword).subscribe(res => {
     alert("Password has changed!")
     this.router.navigateByUrl('/');
     
   });
    
    
  }
  ResetPasswordModel = this.formBuilder.group({
    Passwords: this.formBuilder.group(
      {
        Password: ["", [Validators.required, Validators.minLength(4)]],
        ConfirmPassword: ["", Validators.required],
      },
      {
        validator: this.userService.comparePasswords,
      }
    ),
  });

  
}
