import { Component, NgModule, OnInit } from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-createreport",
  templateUrl: "./createreport.component.html",
  styleUrls: ["./createreport.component.css"],
})
export class CreatereportComponent implements OnInit {
  formReportModel = {
    Email: this.userService.getAuthorizedUserEmail(),
    Name: "",
    Priority: "",
    Subject: "",
    Description: "",
  };
  srcResault: any;
  fileName: any;
  constructor(private userService: UserService) {}

  ngOnInit() {}

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
  SendReport(form: NgForm) {
    this.userService.SendReport(form.value)
  }
}
