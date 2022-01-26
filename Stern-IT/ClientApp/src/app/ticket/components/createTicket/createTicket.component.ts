import { Component, NgModule, OnInit } from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { MailRequest } from "src/app/models/SendEmail";
import { User } from "src/app/models/user.model";
import { SendEmailService } from "src/app/services/sendEmail.service";
import { TicketService } from "src/app/services/ticket.service";
import { UserService } from "src/app/services/user.service";
import { Ticket } from "../../../models/ticket.model";



@Component({
  selector: "app-createTicket",
  templateUrl: "./createTicket.component.html",
  styleUrls: ["./createTicket.component.css"],
})
export class CreateTicketComponent implements OnInit {
  formTicketModel = {
    Email: this.userService.getAuthorizedUserEmail(),
    Status: "Open",
    Priority: "",
    Subject: "",
    Description: "",
    ToManagerName: "All",
  };
  srcResault: any;
  fileName: any;
  managers: Array<User>;

  constructor(private ticketService: TicketService, private userService: UserService, private router: Router, private sendEmailService: SendEmailService) {}

  ngOnInit() {
    this.userService.GetManagers().subscribe(res => {
      this.managers = res as User[]
    });

  }

  onFileSelected() {
    const InputNode: any = document.querySelector("#file");
    if (typeof FileReader !== "undefined") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.srcResault = e.target.result;
      };
      this.fileName = InputNode.files[0].name;
      reader.readAsArrayBuffer(InputNode.files[0]);
    }
  }
  SendTicket(form: NgForm) {
    this.ticketService.SendTicket(form.value);
    if (form.value.ToManagerName != "All") {
      this.SendEmail(form.value.toManagerName, form.value.Email + " send new Ticket: \n" + "Subject" + form.value.Subject + "\n" + "Priority" + form.value.Priority + "\n" + "Description: " + form.value.Description + "\n");
    }
    else {
      this.SendEmail("ido@stern-it.com", form.value.Email + " send new Ticket: \n" + "[Subject: " + form.value.Subject + "]\n" + "[Priority: " + form.value.Priority + "]\n" + "[Description: " + form.value.Description + "]\n");
    }
  }
  SendEmail(toEmail: string, body: string){
    this.mailrequest.Body = body
    this.sendEmailService.SendEmail(this.mailrequest)
  }
  mailrequest:MailRequest = {
    ToEmail: "ido@stern-it.com",
    Subject: "New Ticket Has Opened!",
    Body: ""
  }
}
