import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { Customer } from "src/app/models/customer";
import { User } from "src/app/models/user.model";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-customer-detail",
  templateUrl: "./customer-detail.component.html",
  styleUrls: ["./customer-detail.component.css"],
})
export class CustomerDetailComponent implements OnInit {

  columns: string[] = ["Email","PhoneNumber", "details-edit-delete"];

  dataSource = new MatTableDataSource<User>();
  CustomerName: any;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
  public Customer;
  public Users =[];
  constructor(private activedRoute: ActivatedRoute,
    private userService: UserService) {
    this.dataSource.filterPredicate = (user: User, filter: string) => {
      return (
        user.Email.toLowerCase().includes(filter.toLowerCase()) ||
        user.Roles.join(",").toLowerCase().includes(filter.toLowerCase())
      );
  }
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.userService.GetCustomerById(parseInt(this.activedRoute.snapshot.paramMap.get("id"))).subscribe(res =>{
      this.CustomerName = res;
    })
    this.get();

    const id = this.activedRoute.snapshot.paramMap.get("id");
    this.userService.GetCustomerById(parseInt(id)).subscribe(res=>{
      this.Customer = res as Customer;
      
    })

   
  }
  get() {
    const id = this.activedRoute.snapshot.paramMap.get("id");
    this.userService.GetCustomerUsersById(parseInt(id)).subscribe((res) => {
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
