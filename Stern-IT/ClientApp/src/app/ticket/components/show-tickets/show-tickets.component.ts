import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Ticket } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/services/ticket.service';


@Component({
  selector: 'app-show-tickets',
  templateUrl: './show-tickets.component.html',
  styleUrls: ['./show-tickets.component.css']
})
export class ShowTicketsComponent implements OnInit {

  columns: string[] = ["Subject"];
  dataSource = new MatTableDataSource<Ticket>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private ticketService: TicketService) {
    this.dataSource.filterPredicate = (ticket: Ticket, filter: string) => {
      return (
        ticket.Subject.toLowerCase().includes(filter.toLowerCase())
        // ||
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
 

}
