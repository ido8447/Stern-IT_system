import { Component, NgModule, OnInit } from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { MailRequest } from "src/app/models/SendEmail";
import { User } from "src/app/models/user.model";
import { FileService } from "src/app/services/file.service";
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
  fileSelected: any;


  constructor(
    private fileService: FileService,
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
    console.log(files.item(0));
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
  //
  // upload() {
  //   const formData: FormData = new FormData();
  //   formData.append('MyFile', this.fileSelected)
  //   this.fileService.postFile(formData);
  // }
  uploadFileToActivity() {
    this.fileService.postFile(this.fileToUpload)
  }
  //

  SendTicket(form: NgForm) {
    this.ticketService.SendTicket(form.value);
    this.uploadFileToActivity();
    var body =
      "<h4>" +
      form.value.Email +
      " send new Ticket</h4><p>Subject: " +
      form.value.Subject +
      "</p><p>Priority: " +
      form.value.Priority +
      "</p><p>Description: " +
      form.value.Description +
      "</p>";
    if (form.value.ToManagerName != "All") {
      this.SendEmail(form.value.toManagerName, body);
    } else {
      //add option to revice message
      this.SendEmail("ido@stern-it.com", body);
    }
  }
  SendEmail(toEmail: string, body: string) {
    this.mailrequest.Body = body;
    this.sendEmailService.SendEmail(this.mailrequest);
  }
  mailrequest: MailRequest = {
    ToEmail: "ido@stern-it.com",
    Subject: "New Ticket Has Opened!",
    Body: "",
  };
}
