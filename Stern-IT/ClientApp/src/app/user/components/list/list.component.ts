import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { Ticket } from "src/app/models/ticket.model";
import { User } from "src/app/models/user.model";
import { TicketService } from "src/app/services/ticket.service";
import { Customer } from "../../../models/customer";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
})
export class ListComponent implements OnInit, AfterViewInit {
  columns: string[] = [
    "Email",
    "Customer",
    "PhoneNumber",
    "Roles",
    "details-edit-delete",
  ];
  // columns: string[] = ["Email", "PhoneNumber", "Roles","Customer", "details-edit-delete"];

  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private ticketService: TicketService,
    private userService: UserService
  ) {
    this.dataSource.filterPredicate = (user: User, filter: string) => {
      return (
        user.Email.toLowerCase().includes(filter.toLowerCase()) ||
        user.Roles.join(",").toLowerCase().includes(filter.toLowerCase())
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
    this.userService.get().subscribe((res) => {
      this.dataSource.data = res as User[];
    });
  }

  public filter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }

  ticketModel = {
    Email: "",
    Status: "",
  };
  tickets: any;
  managers(email) {
    if (email == "ido@stern-it.com" || email == "eyal@stern-it.com") {
      return false;
    }
    return true;
  }
  delete(Id: any, email: string) {
    if (confirm("Are you sure to delete this record?")) {
      this.userService.delete(Id).subscribe(
        () => {
          this.get();
        },
        (err: any) => {
          if (
            confirm(
              "This user can not be deleted because he has tickets or comments Want to delete with all tickets?"
            )
          ) {
            //
            this.ticketService.DeleteTicketsByUser(email).subscribe((res) => {
              this.userService.delete(Id).subscribe(() => {
                this.get();
              });
            });

            //
          }
        }
      );
    }
  }
}
