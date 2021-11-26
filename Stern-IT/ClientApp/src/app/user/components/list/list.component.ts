import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { User } from "src/app/models/user.model";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
})
export class ListComponent implements OnInit, AfterViewInit {
  columns: string[] = ["ID", "Email", "Password" , "Roles"];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private userService: UserService) {
    this.dataSource.filterPredicate = (user: User, filter: string) => {
      return (
        user.ID.toLowerCase().includes(filter.toLowerCase()) ||
        user.Email.toLowerCase().includes(filter.toLowerCase()) ||
        user.Password.toLowerCase().includes(filter.toLowerCase()) ||
        user.Roles.join(', ').toLowerCase().includes(filter.toLowerCase())
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
    this.userService.get().subscribe(res => {
      this.dataSource.data = res as User[];
    });
  }

  public filter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }
}