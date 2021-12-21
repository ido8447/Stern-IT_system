import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
  /**
   *
   */
  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private ticketService: TicketService
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
  }

  public cancel() {
    this.router.navigateByUrl("/tickets");
  }

  
}
