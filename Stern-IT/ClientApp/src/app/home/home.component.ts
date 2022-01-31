import { Component, OnInit } from '@angular/core';
import { arrayify } from 'tslint/lib/utils';
import { log } from 'util';
import { Ticket, TicketModel } from '../models/ticket.model';
import { TicketService } from '../services/ticket.service';
import { AuthorizedUser, UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent implements OnInit {
  isExpanded = false;
  authorizedUser: AuthorizedUser;
  Email = this.userService.getAuthorizedUserEmail();
  OpenTickets= new Array;
  ClosedTickets= new Array;
  PendingTickets= new Array;

  constructor(public userService: UserService,
    private ticketService: TicketService) { }


  ngOnInit(): void {
    this.userService.authorizedUser$.subscribe(
      (authorizedUser: AuthorizedUser) => {
        this.authorizedUser = authorizedUser;
      }
    );

    if (localStorage.getItem("token")) {
      this.authorizedUser = {
        Email: this.userService.getAuthorizedUserEmail(),
      };
    this.details();
    }
  }

  private model: TicketModel = {
    Status: "Open",
    Email: this.userService.getAuthorizedUserEmail()
  };

  details() {
    this.ticketService.getTickets(this.model).subscribe(res => {
      if (res == null) {
        this.OpenTickets = new Array;
      }
        this.OpenTickets = res as Ticket[];
    });

    this.model.Status = "Closed";
    this.ticketService.getTickets(this.model).subscribe(res => {
      if (res == null) {
        this.ClosedTickets = new Array;
      }
      this.ClosedTickets = res as Ticket[];
    });

    this.model.Status = "Pending";
    this.ticketService.getTickets(this.model).subscribe(res => {
      if (res == null) {
        this.PendingTickets = new Array;
      }
      this.PendingTickets = res as Ticket[];
    });
  }





}
