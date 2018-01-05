import { Component } from "@angular/core";


@Component({
    selector : 'my-portfolio',
    templateUrl : './my-portfolio.component.html'
})

export class MyPortfolioComponent{
    constructor(){
    // console.log(mode);
    // console.log(id);
    }

    isViewMode = true;
    pageTitle = 'My Portfolio Page';
    // employee : Employee = {
    //     Id : 1,
    //     Name : 'Adesh Shukla',
    //     Salary : 10000
    // }

    
}

