import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Ticket } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/services/ticket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-closed-alltickets',
  templateUrl: './closed-alltickets.component.html',
  styleUrls: ['./closed-alltickets.component.css']
})
export class ClosedAllticketsComponent implements OnInit {

  columns: string[] = ["Email","Status", "Subject", "Priority", "Date" ,"details-delete"];
  dataSource = new MatTableDataSource<Ticket>();

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
    this.ticketService.getTicket(this.userService.getAuthorizedUserEmail(),"Closed").subscribe((res) => {
      this.dataSource.data = res as Ticket[];
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
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }

  refresh(){
    this.get();
  }

}
