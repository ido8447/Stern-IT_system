import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { Ticket, TicketModel } from "src/app/models/ticket.model";
import { UserService } from "src/app/services/user.service";
import { TicketService } from "src/app/services/ticket.service";
import { Customer } from "../../../models/customer";

@Component({
  selector: "app-team",
  templateUrl: "./team.component.html",
  styleUrls: ["./team.component.css"],
})
export class TeamComponent implements OnInit {
  columns: string[] = this.columnsFunc();
  dataSource = new MatTableDataSource<Ticket>();
  customerDict: any;
  customerName:string;

  columnsFunc() {
    return [
      "TicketId",
      "Email",
      "Subject",
      "Status",
      "Priority",
      "Date",
      "details-delete",
    ];
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private ticketService: TicketService,
    public userService: UserService
  ) {
    this.dataSource.filterPredicate = (ticket: Ticket, filter: string) => {
      return (
        ticket.CustomerName.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.Subject.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.Status.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.Priority.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.Email.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.TicketId.toString().includes(filter.toLowerCase())
      );
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.get();
  }

  private model: TicketModel = {
    Status: "Open",
    Email: this.userService.getAuthorizedUserEmail(),
  };

  get() {
    this.userService
      .GetMyCustomerByEmail(this.userService.getAuthorizedUserEmail())
      .subscribe((res: Customer) => {
        this.ticketService
          .getCustomerTickets(res.CustomerId)
          .subscribe((res) => {
            this.dataSource.data = res as Ticket[];
          }),
          this.customerName = res.CustomerName;
      });
  }

  public filter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }

  deleteTicket(Id: any) {
    if (confirm("Are you sure to delete this ticket?")) {
      this.ticketService.DeleteTicket(Id).subscribe(
        () => {
          this.ticketService.getTicket();
          this.get();
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }

  which(manager) {
    if (manager == "All") {
      return false;
    }
    return true;
  }
  fowardTicket(ticketId: any) {
    this.ticketService.ShareTicket(ticketId).subscribe((res) => this.get());
  }

  Refresh() {
    this.get();
  }
}
