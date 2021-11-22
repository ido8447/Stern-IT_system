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

  //if there is no token: return false and navigate to login page
  //if there is a token: and has a role:  return true
  //if there is a token: and has not a role:  return false and navigate to login page
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
    } else {
      this.router.navigate(["/user/login"]);
      return false;
    }
  }

  ///not working!!///
  // canActivate(): boolean {
  //   if (localStorage.getItem("token") != null) {
  //     const role = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1])).role
  //     if (Array.isArray(role)) {
  //       if (this.userService.allowedRole(role)) {
  //         return true;
  //       }
  //       else if(typeof(role)=="string"){
  //         if (this.userService.allowedRole([role])) {
  //           return true;
  //         }
  //       } else {
  //         this.router.navigate(["/user/login"]);
  //         return false;
  //       }
  //     }
  //     return true;
  //   }
  //   else {
  //     this.router.navigate(["/user/login"]);
  //     return false;
  //   }
  // }
}
