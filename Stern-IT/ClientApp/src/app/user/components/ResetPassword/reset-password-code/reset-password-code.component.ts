import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@Component({
  selector: 'app-reset-password-code',
  templateUrl: './reset-password-code.component.html',
  styleUrls: ['./reset-password-code.component.css']
})
export class ResetPasswordCodeComponent implements OnInit {
  private UserMagicNumber : string = ResetPasswordComponent.MagicNumber;
  constructor(private formBuilder: FormBuilder, private router : Router) { }
  Code:string = '';
  ngOnInit() {
  }

//   ResetPasswordCodeModel = this.formBuilder.group({
//     Code: ["", Validators.length == 5]

// });

Apply(){

  if (this.Code == this.UserMagicNumber) {
    
    this.router.navigateByUrl('users/NewPassword');
  }
  else{
    alert('Wrong Code')
  }
}

}
