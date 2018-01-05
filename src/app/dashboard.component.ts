import { Component } from "@angular/core";

@Component({
    selector : 'dashboard',
    templateUrl : './dashboard.component.html'
})

export class DashboardComponent{
    constructor(){
    // console.log(mode);
    // console.log(id);
    }

    isViewMode = true;
    pageTitle = 'Dashboard';
}

