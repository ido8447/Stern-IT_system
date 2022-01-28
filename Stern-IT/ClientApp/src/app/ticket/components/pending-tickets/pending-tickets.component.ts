import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Ticket, TicketModel } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/services/ticket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pending-tickets',
  templateUrl: './pending-tickets.component.html',
  styleUrls: ['./pending-tickets.component.css']
})
export class PendingTicketsComponent implements OnInit {
  columns: string[] = this.columnsFunc();
  dataSource = new MatTableDataSource<Ticket>();
  customerDict: any;


  columnsFunc() {

    if (this.userService.allowedRole(['Moderator']) || this.userService.allowedRole(['Administrator'])) {
      return ["Email", "Customer", "Subject", "Status", "Priority", "Date", "details-delete"];
    }
    return ["Subject", "Customer", "Status", "Priority", "Date", "details-delete"];
  }


  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private ticketService: TicketService, private userService: UserService) {
    this.dataSource.filterPredicate = (ticket: Ticket, filter: string) => {
      return (
        ticket.Subject.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.Status.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.Priority.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.Email.toLowerCase().includes(filter.toLowerCase())

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
    Status: "Pending",
    Email: this.userService.getAuthorizedUserEmail()
  };
   
  


  get() {
    this.ticketService.getTickets(this.model).subscribe((res) => {
      this.dataSource.data = res as Ticket[];
    });
  }

  public filter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }
  Refresh() {
    this.get();

  }
  deleteTicket(Id: any) {
    if (confirm("Are you sure to delete this ticket?")) {
      this.ticketService.DeleteTicket(Id).subscribe(
        () => {
          this.ticketService.getTicket();
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }
}
