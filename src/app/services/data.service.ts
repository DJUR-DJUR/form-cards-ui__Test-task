import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckUserResponseData, SubmitFormResponseData } from "../shared/interface/responses";
import { SubmitFormData } from "../shared/interface/interfaces";

@Injectable({
    providedIn: 'root',
})
export class DataService {
    constructor(private http: HttpClient) {
    }

    checkUsername(username: string): Observable<CheckUserResponseData> {
        return this.http.post<CheckUserResponseData>('/api/checkUsername', {username});
    }

    submitForm(data: SubmitFormData[]): Observable<SubmitFormResponseData> {
        return this.http.post<SubmitFormResponseData>('/api/submitForm', data);
    }
}
