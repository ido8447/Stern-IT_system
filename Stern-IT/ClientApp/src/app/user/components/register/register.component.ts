import { Component, Input, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  constructor(public userService: UserService, private router: Router) {}
  
  
  ngOnInit(): void {
    this.userService.formRegisterModel.reset();
  }




  register() {
    this.userService.register().subscribe((res: any) => {
      if (res.Succeeded == true) {
        this.userService.formRegisterModel.reset();
        alert("New User Registered!");
        // this.userService.login(form.value);
        this.router.navigateByUrl('')
      } else {
        res.errors.forEach((error: any) => {
          console.log(error.description);
        });
      }
    });
  }
}
