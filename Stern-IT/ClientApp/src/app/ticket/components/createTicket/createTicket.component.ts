import { Component, NgModule, OnInit } from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { MailRequest } from "src/app/models/SendEmail";
import { User } from "src/app/models/user.model";
import { FileService } from "src/app/services/file.service";
import { SendEmailService } from "src/app/services/sendEmail.service";
import { TicketService } from "src/app/services/ticket.service";
import { UploadService } from "src/app/services/upload.service";
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
    ToManager: "All",
    FileURL:""
  };


  srcResault: any;
  fileName: any;
  managers: Array<User>;
  fileSelected: any;
    URL: any;

  constructor(
    private fileService: FileService,
    private uploadService: UploadService,

    private ticketService: TicketService,
    private userService: UserService,
    private router: Router,
    private sendEmailService: SendEmailService
  ) {}

  ngOnInit() {
    this.userService.GetManagers().subscribe((res) => {
      this.managers = res as User[];
    });
  }

  fileToUpload: File | null = null;

  onFileSelected(files: FileList) {
    this.fileToUpload = files.item(0);
    const InputNode: any = document.querySelector("#file");
    if (typeof FileReader !== "undefined") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.srcResault = e.target.result;
      };
      this.fileName = InputNode.files[0].name;
      this.fileSelected = InputNode.files[0];
    }
  }


  
 
  SendTicket(form: NgForm) {

    const formData = new FormData();
    const InputNode: any = document.querySelector("#file");

    if (InputNode.files[0]) {
      formData.append(InputNode.files[0].name, InputNode.files[0]);

      this.uploadService
        .upload(formData)
        .subscribe(({ path }) => this.ticketService.SendTicket(form.value, path));
    }
    else {
      this.ticketService.SendTicket(form.value, "");
    }
 

    let url = "https://stern-it-hr-service.azurewebsites.net/tickets";
    var body =
     "<h4>" +
     form.value.Email +
     " send new Ticket</h4><p>Subject: " +
     form.value.Subject +
     "</p><p>Priority: " +
     form.value.Priority +
     "</p><p>Description: " +
     form.value.Description +
     "</p>" +
     "<p>Ticktes:" +
     url +
     "  </p>";
    let managerName = form.value.ToManager;
    if (managerName != "All") {
     this.userService
       .GetManager(managerName)
       .subscribe((res: any) => this.SendEmail(res.Email, body));
    } else {
     this.userService
       .GetManagers()
       .subscribe((res) => this.sendToManeger(res, body));
    }
    var body2 =
     "<h4>New Ticket has Created!</h4>" +
     "<p>" +
     "<p>Ticket received for you ,</p><p> we will get back to you as soon as possible</p>" +
     "<p>In order to follow the ticket you can log in to Stern_IT (https://stern-it-hr-service.azurewebsites.net)</p>" +
     "<p>Please do not replay to this email.</p>" +
     "<p>Best Regard ,</p>" +
     "<p>Stern-IT support</p>";
    this.SendEmail(this.userService.getAuthorizedUserEmail(), body2);
  }
  sendToManeger(managers, body) {
    for (var i = 0; i < managers.length; i++) {
      this.SendEmail(managers[i].Email, body);
    }
  }
  SendEmail(toEmail: string, body: string) {
    this.mailrequest.Body = body;
    this.mailrequest.ToEmail = toEmail;
    this.sendEmailService.SendEmail(this.mailrequest);
  }
  mailrequest: MailRequest = {
    ToEmail: "eyal@stern-it.com",
    Subject: "New Ticket Has Opened!",
    Body: "",
  };
}
