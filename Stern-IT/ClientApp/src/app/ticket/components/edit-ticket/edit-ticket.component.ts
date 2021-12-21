import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TicketInfo } from "src/app/models/ticket.model";
import { TicketService } from "src/app/services/ticket.service";

@Component({
  selector: "app-edit-ticket",
  templateUrl: "./edit-ticket.component.html",
  styleUrls: ["./edit-ticket.component.css"],
})
export class EditTicketComponent implements OnInit {
  public ticketForm: FormGroup;

  /**
   *
   */
  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private service: TicketService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.ticketForm = this.formBuilder.group({
      TicketId: new FormControl(),
      Email: [{ value: "", disabled: true }],
      Status: [{ value: "", disabled: true }],
      Subject: [{ value: "", disabled: true }],
      Priority: [{ value: "", disabled: true }],
      Description: [{ value: "", disabled: true }],
    });

    const id = this.activateRoute.snapshot.paramMap.get("id");
    this.service.getTicket(parseInt(id)).subscribe((res) => {
      this.ticketForm.patchValue(res as TicketInfo);
    }),
      (error: any) => {
        console.log(error);
      };
  }

  public error(control: string, error: string) {
    return this.ticketForm.controls[control].hasError(error);
  }
  public cancel() {
    this.router.navigateByUrl("/users");
  }
  public save(ticketFormValue) {
    if (this.ticketForm.valid) {
      const user: TicketInfo = {
        TicketId: ticketFormValue.Id,
        Email: ticketFormValue.Email,
        Status: ticketFormValue.Status,
        Subject: ticketFormValue.Sucject,
        Priority: ticketFormValue.Priority,
        Description: ticketFormValue.Description,
      };
      this.service.PutTicket(user).subscribe(
        () => {
          this.router.navigateByUrl("/tickets");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
