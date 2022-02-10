import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class UploadService {
  baseURL: string;
  apiURL = "api/upload/";

  constructor(
    private httpClient: HttpClient,
    @Inject("BASE_URL") baseURL: string,
    private router: Router
  ) {
    this.baseURL = baseURL;
  }
  upload(formData: FormData) {
    return this.httpClient.post<{ path: string }>(
      this.baseURL + this.apiURL,
      formData
    );
  }
   
}
