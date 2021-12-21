import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  formLoginModel = {
    Email: "",
    Password: "",
  };

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem("token") != null) {
      this.router.navigateByUrl("/");
    }
  }

  login(form: NgForm) {
    this.userService.login(form.value);
    
  }

  openWEB() {
    window.location.href = "http://www.stern-it.com";
  }
}
