import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { User } from "src/app/models/user.model";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
})
export class ListComponent implements OnInit, AfterViewInit {
  columns: string[] = ["Email", "PhoneNumber", "Roles", "details-edit-delete"];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private userService: UserService) {
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
  
  delete(Id: any) {
    if (confirm("Are you sure to delete this record?")) {
      this.userService.delete(Id).subscribe(
        () => {
          this.get();
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }
}
