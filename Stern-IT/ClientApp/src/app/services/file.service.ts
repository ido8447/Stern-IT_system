import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { UserService } from "./user.service";
import { MailRequest } from "../models/SendEmail";

@Injectable({
  providedIn: "root",
})
export class FileService {
  baseURL: string;
  apiURL = "api/File/";

  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    @Inject("BASE_URL") baseURL: string,
    private router: Router
  ) {
    this.baseURL = baseURL;
  }

  postFile(file) {
    this.httpClient
      .post(this.baseURL + this.apiURL + "UploadFile", file)
      .subscribe((res) => {
      });
  }
}
