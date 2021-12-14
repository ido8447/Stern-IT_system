import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "src/app/models/user.model";
import { UserService } from "../../../services/user.service";

@Component({
  templateUrl: "details.component.html",
})
export class UserDetailsComponent implements OnInit {
  public user: User;
  /**
   *
   */
  constructor(
    private router: Router,
    private activedRoute: ActivatedRoute,
    private service: UserService
  ) {}
  ngOnInit() {
    const id = this.activedRoute.snapshot.paramMap.get("id");
    this.service.get(id).subscribe(
      (res) => {
        this.user = res as User;
      },
      (error) => {
        console.log(error);
      }
    );
  }

public cancel(){
    this.router.navigateByUrl('/users');
}

}
