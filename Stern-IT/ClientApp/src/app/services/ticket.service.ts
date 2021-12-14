import { Inject, Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { registerLocaleData } from "@angular/common";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { UserService } from "./user.service";
import { convertActionBinding } from "@angular/compiler/src/compiler_util/expression_converter";

@Injectable({
  providedIn: "root",
})
export class TicketService {
  baseURL: string;
  apiURL = "api/tickets/";
  formTicketModel: any;

  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    @Inject("BASE_URL") baseURL: string,
    private router: Router
  ) {
    this.baseURL = baseURL;
  }

  //send request of ticket
  public SendTicket(ticket: any) {
    return this.httpClient
      .post(this.baseURL + this.apiURL + "create-ticket", ticket)
      .subscribe((res: any) => {
        alert("Request has send!");
        this.router.navigateByUrl("/");
      });
  }

  public getTicket(Id?: string) {
    if (Id) {
      return this.httpClient.get(this.baseURL + this.apiURL + parseInt(Id));
    } else {
      return this.httpClient.get(this.baseURL + this.apiURL);
    }
  }

  
  
  DeleteTicket(Id: string) {
    return this.httpClient.delete(this.baseURL + this.apiURL + parseInt(Id));
  }





}
