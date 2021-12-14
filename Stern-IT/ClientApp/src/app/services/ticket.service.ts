import { Inject, Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { registerLocaleData } from "@angular/common";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class TicketService {
  baseURL: string;
  apiURL = "api/Tickets/";
  formTicketModel: any;

  constructor(
    private httpClient: HttpClient,
    @Inject("BASE_URL") baseURL: string,
    private router: Router
  ) {
    this.baseURL = baseURL;
  }

 


  //send request of ticket
  public SendTicket(ticket: any) {
    return this.httpClient
      .post(this.baseURL + this.apiURL + "create-ticket", ticket).subscribe((res: any) => {
        alert("Request has send!");
        this.router.navigateByUrl('/')
      });
      
  }


  public getTicket(Id?: string) {
    if (Id) {
      return this.httpClient.get(this.baseURL + this.apiURL + Id);
    } else {
      return this.httpClient.get(this.baseURL + this.apiURL);
    }
  }
}


