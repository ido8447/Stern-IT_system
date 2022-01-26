import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { UserService } from "./user.service";
import { MailRequest } from "../models/SendEmail";


@Injectable({
  providedIn: "root",
})
export class SendEmailService {
  baseURL: string;
  apiURL = "api/Email/";

  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    @Inject("BASE_URL") baseURL: string,
    private router: Router
  ) {
    this.baseURL = baseURL;
  }



  public SendEmail(mailreques: MailRequest ) {
    this.httpClient.post(this.baseURL + this.apiURL + "Send", mailreques).subscribe();
  }

}
