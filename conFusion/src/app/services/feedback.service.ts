import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { Http, Response } from '@angular/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

import { Observable } from 'rxjs/Observable';
/*
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
*/
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class FeedbackService {

  constructor(private restangular: Restangular,
    private processHTTPMsg: ProcessHTTPMsgService) { }

  submitFeedback(feedback: Feedback): Observable<Feedback> {
    return this.restangular.all('feedback').post(feedback);     
    }

  getSubmission(id: number): Observable<Feedback> {
    return  this.restangular.one('feedback',id).get();
  }

  getSubmissionIds(): Observable<number[]> {
    return this.restangular.all('feedback').getList()
                .map(feedbacks => { return feedbacks.map(feedback => feedback.id) })
                // l'erreur dans l'instruction, le return doit être Observable () et non directement error
                .catch(error => { return Observable.of(error); } )
                ;
  }

}
