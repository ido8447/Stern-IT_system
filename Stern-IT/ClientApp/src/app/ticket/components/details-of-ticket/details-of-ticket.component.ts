import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Answer } from "src/app/models/Answer";
import { Ticket } from "src/app/models/ticket.model";
import { TicketService } from "src/app/services/ticket.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-details-of-ticket",
  templateUrl: "./details-of-ticket.component.html",
  styleUrls: ["./details-of-ticket.component.css"],
})
export class DetailsOfTicketComponent implements OnInit {
  public ticket: Ticket;
  public ticketStatusIsOpen: boolean;
  modelList: Array<Answer>;

  /**
   *
   */
  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private ticketService: TicketService,
    private userService: UserService
  ) {}
  ngOnInit() {
    const id = parseInt(this.activedRoute.snapshot.paramMap.get("id"));
    this.ticketService.getTicket(id).subscribe(
      (res) => {
        this.ticket = res as Ticket;
      },
      (error) => {
        console.log(error);
      }
    );
    this.GetStatusTicket();
    this.GetAnswer(id.toString());

  }

  //! NOT WORK throw error
  //todo fix this
  // this function return the value of ticket status
  // i want to show button of close ticket only if the status is closed 
  GetStatusTicket() {
    this.ticketService
      .GetTicketStatus(parseInt(this.activedRoute.snapshot.paramMap.get("id")))
      .subscribe((arg) => {
          console.log(arg);
        if (arg=="Open") {
          this.ticketStatusIsOpen = true;
        } else {
          this.ticketStatusIsOpen = false;
          
        }
      });
  }

  public cancel() {
    this.router.navigateByUrl("/tickets");
  }

  GetAnswer(ID: string) {
    this.ticketService
      .GetAnswer(ID)
      .subscribe((arg) => (this.modelList = arg as Answer[]));
  }

  formTicketModel = {
    Email: this.userService.getAuthorizedUserEmail(),
    Answer: "",
    TicketId: parseInt(this.activedRoute.snapshot.paramMap.get("id")),
  };

  // CloseTicket() {
  //   this.ticketService.CloseTicket(
  //     parseInt(this.activedRoute.snapshot.paramMap.get("id"))
  //   );
  //   this.router.navigateByUrl("closed-ticket");
  // }
}
