import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, NgForm, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { MailRequest } from "src/app/models/SendEmail";
import { SendEmailService } from "src/app/services/sendEmail.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private sendEmailService: SendEmailService,
    private userServie: UserService
  ) {}
  public static MagicNumber: string = (
    Math.floor(Math.random() * 90000) + 10000
  ).toString();
  private Number: string;
  ngOnInit() {
    this.Number = ResetPasswordComponent.MagicNumber;
  }

  mailrequest: MailRequest = {
    ToEmail: "",
    Subject: "Reset Password",
    Body: "",
  };

  ResetPassword(form: NgForm) {
    this.userServie.Email = form.value.Email;

    this.mailrequest.Body =
      "<h1>Reset Password</h1><p>Please Enter this number</p>";
    this.mailrequest.Body += this.Number;

    this.mailrequest.ToEmail = form.value.Email;
    this.sendEmailService.SendEmail(this.mailrequest);
    this.router.navigateByUrl("users/ResetPasswordCode");
  }

  ResetPasswordModel = this.formBuilder.group({
    Email: ["", Validators.email],
  });
}
