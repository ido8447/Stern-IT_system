import { Component, NgModule, OnInit } from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "src/app/models/user.model";
import { TicketService } from "src/app/services/ticket.service";
import { UserService } from "src/app/services/user.service";



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

  constructor(private ticketService: TicketService, private userService: UserService, private router: Router) {}

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
  }
}
