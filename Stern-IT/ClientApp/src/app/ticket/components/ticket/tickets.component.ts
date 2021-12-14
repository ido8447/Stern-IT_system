import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthorizedUser, UserService } from "src/app/services/user.service";

@Component({
  selector: "app-tickets",
  templateUrl: "./tickets.component.html",
  styleUrls: ["./tickets.component.css"],
})
export class TicketsComponent implements OnInit {
  authorizedUser: AuthorizedUser;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.authorizedUser$.subscribe(
      (authorizedUser: AuthorizedUser) => {
        this.authorizedUser = authorizedUser;
      }
    );

    if (localStorage.getItem("token")) {
      this.authorizedUser = {
        Email: this.userService.getAuthorizedUserEmail(),
      };
    }
  }

  
}
