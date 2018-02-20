import { Injectable } from '@angular/core';

@Injectable()
export class AdminService {
    public balanceBTC;

    constructor() {
        this.balanceBTC = 0.01398605;
    }
}