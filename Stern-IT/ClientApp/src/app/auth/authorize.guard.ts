import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "../user/services/user.service";

@Injectable({
  providedIn: "root",
})
export class AuthorizeGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}
  //
  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): boolean {
    if (localStorage.getItem("token") != null) {
      const allowedRoles = activatedRouteSnapshot.data[
        "allowedRoles"
      ] as Array<string>;
      if (allowedRoles) {
        if (this.userService.allowedRole(allowedRoles)) {
          return true;
        } else {
          this.router.navigate(["/user/login"]);
          return false;
        }
      }
      return true;
    } 
    else {
      this.router.navigate(["/user/login"]);
      return false;
    }
  }
}
