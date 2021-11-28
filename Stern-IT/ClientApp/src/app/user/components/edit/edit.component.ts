import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Role, UserInfo } from "src/app/models/user.model";
import { UserService } from "../../services/user.service";

@Component({
    templateUrl: "edit.component.html"
})

export class UserEditComponent implements OnInit{
    public userForm: FormGroup;
    public allRoles;
    public selectedRoles =[];

    /**
     *
     */
    constructor(private router: Router,
        private activateRoute: ActivatedRoute,
        private service: UserService,
        private formBuilder: FormBuilder) {
        
    }
    
    ngOnInit(): void {
        this.service.GetRoles().subscribe(res=>{
            this.allRoles = res as Role;
            this.allRoles.forEach(role => {
                this.selectedRoles.push({'Name': role.Name, 'Selected': false})
            });
        });
        this.userForm = this.formBuilder.group({
            Id: new FormControl(),
            Email: [{ value: '',disabled: true}],
            PhoneNumber: [{ value: '',disabled: true}],
            Roles: [],
            RolesSelected: []
        });

        const id = this.activateRoute.snapshot.paramMap.get('id');
        this.service.get(id).subscribe(res=>{
            this.userForm.patchValue(res as UserInfo);
            this.selectedRoles.forEach((role,index,array)=>{
                if(this.userForm.controls['Roles'].value.includes(role.Name)){
                    array[index].Selected = true;
                }
            })
        }, error=>{
            console.log(error);
            
        })

    }

    public error(control:string, error: string){
        return this.userForm.controls[control].hasError(error);
    }
    public cancel(){
        this.router.navigateByUrl('/users')
    }
    public save(userFormValue){
        if (this.userForm.valid) {
            const user: UserInfo = {
                Id: userFormValue.Id,
                Email: userFormValue.Email,
                Roles: userFormValue.RolesSelected
            };
            this.service.put(user).subscribe(()=>{
                this.router.navigateByUrl('/users')
            },
            error=>{
                console.log(error);
            })
        }
    }
}