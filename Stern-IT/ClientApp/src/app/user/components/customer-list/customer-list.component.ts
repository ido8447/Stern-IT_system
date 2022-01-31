import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { Dictionary, forEach } from "lodash";
import { Customer } from "src/app/models/customer";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-customer-list",
  templateUrl: "./customer-list.component.html",
  styleUrls: ["./customer-list.component.css"],
})
export class CustomerListComponent implements OnInit {
  // public OpenTicketByCustomer: any;

 

  constructor(public userService: UserService) {}

  //@ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  AddCustomer(name: string) {
    this.userService.AddCustomer(name).subscribe((res) => {
      if (res == false) {
        alert("this customer already exist");
      } else {
        alert("New group has added!"), this.get();
      }
    });
  }
  // columns: string[] = ["Name", "details-edit-delete"];
  columns: string[] = ["Name", "Users","Tickets","Delete"];
  dataSource = new MatTableDataSource<Customer>();

  ngAfterViewInit(): void {
    //this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.get();
    // this.TicketsByCustomer();
  }
  get() {
    this.userService.GetCustomer().subscribe((res) => {
      this.dataSource.data = res as Customer[];
      
      
    });
  }

  public filter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }
  //GetOpenTickets(name: string) {
  //  var arr = this.OpenTicketByCustomer;
  //  const keys = Object.keys(arr);
  //  for (var i = 0; i < keys.length; i++) {
  //    if (name == keys[i]) {
  //      return arr[i];
  //    }
  //  }
  //}


  // TicketsByCustomer(){
  //   this.userService.GetOpenTicketsByCustomer().subscribe(res=>{
  //      this.OpenTicketByCustomer =  res;
       
  //   })
  // }


  delete(Id: any) {
    if (confirm("Are you sure to delete this record?")) {
      this.userService.deleteCustomer(Id).subscribe(
        () => {
          this.get();
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
    // console.log(Id);
  }
}
