import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Answer } from "src/app/models/Answer";
import { TicketInfo, TicketStatusInfo } from "src/app/models/ticket.model";
import { TicketService } from "src/app/services/ticket.service";
import { UserService } from "src/app/services/user.service";
import { User } from "../../../models/user.model";
import {Location} from '@angular/common';

@Component({
  selector: "app-edit-ticket",
  templateUrl: "./edit-ticket.component.html",
  styleUrls: ["./edit-ticket.component.css"],
})
export class EditTicketComponent implements OnInit {
  public ticketForm: FormGroup;
  modelList: Array<Answer>;

  /**
   *
   */
  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private service: TicketService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activedRoute: ActivatedRoute,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.ticketForm = this.formBuilder.group({
      TicketId: new FormControl(),
      Email: [{ value: "", disabled: true }],
      Status: [{ value: "", disabled: false }],
      Subject: [{ value: "", disabled: true }],
      Priority: [{ value: "", disabled: false }],
      Description: [{ value: "", disabled: true }],
    });

    const id = this.activateRoute.snapshot.paramMap.get("id");
    this.service.getTicket(parseInt(id)).subscribe((res) => {
      this.ticketForm.patchValue(res as TicketInfo);
    }),
      (error: any) => {
        console.log(error);
      };

    this.GetAnswer(id);
  }

  public error(control: string, error: string) {
    return this.ticketForm.controls[control].hasError(error);
  }
  
  public save(ticketFormValue) {
    if (this.ticketForm.valid) {
      const ticket: TicketStatusInfo = {
        Id: this.activedRoute.snapshot.paramMap.get("id"),
        Status: ticketFormValue.Status,
        Priority: ticketFormValue.Priority,
      };
      this.service.PutTicket(ticket).subscribe(
        () => {
         this.cancel();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  GetAnswer(ID: string) {
    this.service
      .GetAnswer(ID)
      .subscribe((arg) => (this.modelList = arg as Answer[]));
  }

  SendAnswer(form: NgForm) {
    if (form.value.Answer.length != 0) {
      this.service.SendAnswer(form.value).subscribe(() => {
        alert("Send Ansewer"), form.reset();
      });
    }
    this.cancel();
  }

  isManager() {
    if (
      this.userService.allowedRole(["Moderator"]) ||
      this.userService.allowedRole(["Administrator"])
    ) {
      return true;
    }
    return false;
  }
  formTicketModel = {
    Email: this.userService.getAuthorizedUserEmail(),
    Answer: "",
    IsManager: this.isManager(),
    TicketId: parseInt(this.activedRoute.snapshot.paramMap.get("id")),
  };

  /**
   * ShowAnswers
   */
  Showed: boolean = this.ShowAnswers();
  public text: string = "Show Answers";
  public arrowClass: string = "arrow_drop_down";
  public ShowAnswers() {
    if (this.Showed == null) {
      this.text = "Show Answers";
      this.arrowClass = "arrow_drop_down";

      return (this.Showed = false);
    } else if (this.Showed) {
      this.arrowClass = "arrow_drop_down";
      this.text = "Show Answers";

      return (this.Showed = false);
    }
    this.arrowClass = "arrow_drop_up";
    this.text = "Hide";
    return (this.Showed = true);
  }

  /**
   * ShowSendAnswers
   */
  AddAnswerShow: boolean = this.AddAnswer();
  public textb: string = "Add Answer";
  public barrowClass: string = "arrow_drop_down";

  public AddAnswer() {
    if (this.AddAnswerShow == null) {
      this.textb = "Add Answer";
      this.barrowClass = "arrow_drop_down";
      return (this.AddAnswerShow = false);
    } else if (this.AddAnswerShow) {
      this.textb = "Add Answer";
      this.barrowClass = "arrow_drop_down";
      return (this.AddAnswerShow = false);
    }
    this.textb = "Hide";
    this.barrowClass = "arrow_drop_up";

    return (this.AddAnswerShow = true);
  }
   cancel() {
    this._location.back()

  }
  CloseTicket() {
    this.service.CloseTicket(
      parseInt(this.activedRoute.snapshot.paramMap.get("id"))
    );
   this.cancel();
  }
}
