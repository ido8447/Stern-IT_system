import { Inject, Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { registerLocaleData } from "@angular/common";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { UserService } from "./user.service";
import { convertActionBinding } from "@angular/compiler/src/compiler_util/expression_converter";
import { each } from "lodash";
import { stat } from "fs";
import { TicketModel } from "src/app/models/ticket.model"

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

  public getTicket(Id?: number, Status?: string) {
    if (Id != null) {
      return this.httpClient.get(this.baseURL + this.apiURL + Id);
    } else if (Id == null && Status == "Closed") {
      return this.httpClient.get(this.baseURL + this.apiURL + "closedtickets");
    } else {
      return this.httpClient.get(this.baseURL + this.apiURL);
    }
    //closedtickets
  }

  public getTickets(model: TicketModel) {
    return this.httpClient.get(this.baseURL + this.apiURL + "tickets/" + model.Email+"/"+model.Status);
  }

  DeleteTicket(Id: string) {
    return this.httpClient.delete(this.baseURL + this.apiURL + parseInt(Id));
  }

  //Get User (from userController)
  //Go to the URL => this.baseURL + this.apiURL + user.Id, user
  //and return this url with PUT
  //Action the function on UserController
  PutTicket(ticket: any) {
    return this.httpClient.put(this.baseURL + this.apiURL + ticket.Id, ticket);
  }

  SendAnswer(answer: any) {
    return this.httpClient.post(
      this.baseURL + this.apiURL + "answer/post",
      answer
    );
  }
  GetAnswer(Id: string) {
    return this.httpClient.get(this.baseURL + this.apiURL + "answer/" + Id);
  }

  CloseTicket(TicketID: number) {
    return this.httpClient
      .post(this.baseURL + this.apiURL + "ChangeStatus/" + TicketID, TicketID)
      .subscribe((arg) => console.log(arg));
  }
  GetTicketStatus(TicketID: number) {
    return this.httpClient.get(
      this.baseURL + this.apiURL + "status/" + TicketID
    );
  }

  getCustomerTickets(CustomerID: string) {
    return this.httpClient.get(
      this.baseURL + this.apiURL + "customersTicket/" + CustomerID
    );
  }

  DeleteTicketsByUser(email:string){
    return this.httpClient.delete(
      this.baseURL + this.apiURL + "DeleteTicketsByUser/" + email
    );
  }

  ShareTicket(ticketId:string){
    return this.httpClient.post(
      this.baseURL + this.apiURL + "shareTicket/"+ticketId,
      ticketId
    );
  }
}
