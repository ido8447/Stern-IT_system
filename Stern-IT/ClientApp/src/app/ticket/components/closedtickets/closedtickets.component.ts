import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Ticket } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/services/ticket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-closedtickets',
  templateUrl: './closedtickets.component.html',
  styleUrls: ['./closedtickets.component.css']
})
export class ClosedticketsComponent implements OnInit {
  columns: string[] = this.columnsFunc();
  dataSource = new MatTableDataSource<Ticket>();


  columnsFunc() {

    if (this.userService.allowedRole(['Moderator']) || this.userService.allowedRole(['Administrator'])) {
      return ["Email","Subject", "Status", "Priority", "Date", "details-delete"];
    }
    return ["Subject", "Status", "Priority", "Date", "details-delete"];
  }


  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private ticketService: TicketService, private userService: UserService) {
    this.dataSource.filterPredicate = (ticket: Ticket, filter: string) => {
      return (
        ticket.Subject.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.Status.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.Priority.toLowerCase().includes(filter.toLowerCase())||
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

  get() {
    this.ticketService.getTickets(this.userService.getAuthorizedUserEmail(),"Closed").subscribe((res) => {
      this.dataSource.data = res as Ticket[];
    });
  }

  public filter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }
  Refresh(){
    this.get();

  }

}
