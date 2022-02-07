import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { toInteger } from "lodash";
import { Log } from "oidc-client";
import { Customer } from "src/app/models/customer";
import { Role, UserInfo } from "src/app/models/user.model";
import { log } from "util";
import { Location } from "@angular/common";
import { UserService } from "../../../services/user.service";

@Component({
  templateUrl: "edit.component.html",
  styleUrls: ["./edit.component.css"],
})
export class UserEditComponent implements OnInit {
  public userForm: FormGroup;
  public allRoles;
  public selectedRoles = [];
  public CurrentCustomer;

  customers: Array<Customer>;

  /**
   *
   */
  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private service: UserService,
    private formBuilder: FormBuilder,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.service.GetCustomer().subscribe((res) => {
      this.customers = res as Customer[];
    });

    const id = this.activateRoute.snapshot.paramMap.get("id");
    // GetCustomerById
    this.service.get(id).subscribe((res) => {
      this.CurrentCustomer = res as Customer;

    });
    this.service.GetRoles().subscribe((res) => {
      this.allRoles = res as Role;
      this.allRoles.forEach((role) => {
        this.selectedRoles.push({ Name: role.Name, Selected: false });
      });
    });
    this.userForm = this.formBuilder.group({
      Id: new FormControl(),
      Email: [{ value: "", disabled: true }],
      PhoneNumber: [{ value: "", disabled: true }],
      Roles: [],
      RolesSelected: [],
      CustomerSelected: [{ value: "", disabled: false }],
    });

    this.service.get(id).subscribe(
      (res) => {
        this.userForm.patchValue(res as UserInfo);
        this.selectedRoles.forEach((role, index, array) => {
          if (this.userForm.controls["Roles"].value.includes(role.Name)) {
            array[index].Selected = true;
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public error(control: string, error: string) {
    return this.userForm.controls[control].hasError(error);
  }
  public cancel() {
    this._location.back();
  }
  public save(userFormValue) {
    var customer = userFormValue.CustomerSelected;
    if (customer == "") {
      customer = 0;
    }
    if (this.userForm.valid) {
      const user: UserInfo = {
        Id: userFormValue.Id,
        Email: userFormValue.Email,
        Roles: userFormValue.RolesSelected,
        CustomerId: customer.toString(),
      };
      this.service.put(user).subscribe(
        () => {
          this.cancel();
        },
        (error) => {
          console.log(error);
        }
      );

      //put customer
    }
  }
}
