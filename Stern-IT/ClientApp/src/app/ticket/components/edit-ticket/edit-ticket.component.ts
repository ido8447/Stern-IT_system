import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Answer } from "src/app/models/Answer ";
import {
  Ticket,
  TicketInfo,
  TicketStatusInfo,
} from "src/app/models/ticket.model";
import { TicketService } from "src/app/services/ticket.service";
import { UserService } from "src/app/services/user.service";
import { User } from "../../../models/user.model";
import { Location } from "@angular/common";
import { SendEmailService } from "src/app/services/sendEmail.service";
import { MailRequest } from "src/app/models/SendEmail";

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
    public userService: UserService,
    private emailService: SendEmailService,
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

    this.GetComment(id);
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
          if (ticketFormValue.Status == "Closed") {
            this.service
              .getTicket(
                parseInt(this.activedRoute.snapshot.paramMap.get("id"))
              )
              .subscribe((res: Ticket) =>
                this.SendEmail(res.Email, this.mailrequest.Body)
              );
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  GetComment(ID: string) {
    this.service
      .GetAnswer(ID)
      .subscribe((arg) => (this.modelList = arg as Answer[]));
  }

  SendComment(form: NgForm) {
    if (form.value.Answer.length != 0) {
      this.service.SendAnswer(form.value).subscribe(() => {
        // this.SendEmail(this.WhoToSend(), form.value);
        alert("Send Comment"), window.location.reload();
      });
    }
  }

  SendEmail(toEmail: string, body: string) {
    this.mailrequest.Body = body;
    this.mailrequest.ToEmail = toEmail;
    this.emailService.SendEmail(this.mailrequest);
  }
  mailrequest: MailRequest = {
    ToEmail: "________",
    Subject: "Your ticket has been closed",
    Body:
      "<p>" +
      "<p>Ticket has been closed for you - If the problem persists, you are welcome to re-open the ticket by login to (stern-it-hr-service.azurewebsites.net)</p>" +
      "<p>Please do not replay to this email.</p>" +
      "<p>Best Regard ,</p>" +
      "<p>Stern-IT support</p>" +
      "</p>",
  };

  isManager() {
    if (
      this.userService.allowedRole(["Operator"]) ||
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
  Showed: boolean = this.ShowComments();
  public text: string = "Show Comments";
  public arrowClass: string = "arrow_drop_down";
  public ShowComments() {
    if (this.Showed == null) {
      this.text = "Show Comments";
      this.arrowClass = "arrow_drop_down";

      return (this.Showed = false);
    } else if (this.Showed) {
      this.arrowClass = "arrow_drop_down";
      this.text = "Show Comments";

      return (this.Showed = false);
    }
    this.arrowClass = "arrow_drop_up";
    this.text = "Hide";
    return (this.Showed = true);
  }

  /**
   * ShowSendAnswers
   */
  AddAnswerShow: boolean = this.AddComment();
  public textb: string = "Add Comment";
  public barrowClass: string = "arrow_drop_down";

  public AddComment() {
    if (this.AddAnswerShow == null) {
      this.textb = "Add Comment";
      this.barrowClass = "arrow_drop_down";
      return (this.AddAnswerShow = false);
    } else if (this.AddAnswerShow) {
      this.textb = "Add Comment";
      this.barrowClass = "arrow_drop_down";
      return (this.AddAnswerShow = false);
    }
    this.textb = "Hide";
    this.barrowClass = "arrow_drop_up";

    return (this.AddAnswerShow = true);
  }
  cancel() {
    this._location.back();
  }
  CloseTicket() {
    this.service.CloseTicket(
      parseInt(this.activedRoute.snapshot.paramMap.get("id"))
    );
    this.cancel();
  }
}
