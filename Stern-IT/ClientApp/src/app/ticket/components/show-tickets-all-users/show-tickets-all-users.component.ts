import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { Ticket } from "src/app/models/ticket.model";
import { TicketService } from "src/app/services/ticket.service";

@Component({
  selector: "app-show-tickets-all-users",
  templateUrl: "./show-tickets-all-users.component.html",
  styleUrls: ["./show-tickets-all-users.component.css"],
})
export class ShowTicketsAllUsersComponent implements OnInit {
  columns: string[] = ["Email","Name", "Subject", "Priority", "details-edit-delete"];
  dataSource = new MatTableDataSource<Ticket>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private ticketService: TicketService) {
    this.dataSource.filterPredicate = (ticket: Ticket, filter: string) => {
      return (
        ticket.Subject.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.Name.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.Priority.toLowerCase().includes(filter.toLowerCase())
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
    this.ticketService.getTicket().subscribe((res) => {
      this.dataSource.data = res as Ticket[];
    });
  }

  public filter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }

  // delete(Id: any) {
  //   if (confirm("Are you sure to delete this record?")) {
  //     this.userService.delete(Id).subscribe(
  //       () => {
  //         this.get();
  //       },
  //       (err: any) => {
  //         console.log(err);
  //       }
  //     );
  //   }
  // }
}
