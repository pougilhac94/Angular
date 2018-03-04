import { Component, OnInit, Inject } from '@angular/core';

import { FeedbackService } from '../services/feedback.service';
import 'rxjs/add/operator/switchMap';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { temporaire, expand2 } from '../animations/app.animation';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    'style': 'display: block;'
    },
  animations: [temporaire(), expand2()]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  submission :Feedback;
  feedbackIds: number[];
  feedbackLast: number;
  contactType = ContactType;
  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  temporaire = 'shown';

  affForm = false;

  validationMessages = {
    'firstname': {
      'required' : 'First Name is required',
      'minlength': 'First Name must be at meast 2 characters long',
      'maxlength': 'First Name cannot be more than 25 characters long'
    },
    'lastname': {
      'required' : 'Last Name is required',
      'minlength': 'Last Name must be at meast 2 characters long',
      'maxlength': 'Last Name cannot be more than 25 characters long'
    },
    'telnum': {
      'required' : 'Tel. Number is required',
      'pattern'  : 'Tel. Number must contain only numbers'      
    },
    'email': {
      'required' : 'Email is required',
      'pattern'  : 'Email not in valid format'      
    }
  };

  constructor(private fbService: FeedbackService,
    @Inject('BaseURL') private BaseURL,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder) { this.createForm(); }

  ngOnInit() {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25) ]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25) ]],
      telnum: ['', [Validators.required, Validators.pattern ]],
      email: ['', [Validators.required, Validators.email ]],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.temporaire = 'hidden';
    
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();// (re)set validation messages now
    
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {return;}
    const form = this.feedbackForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    this.fbService.submitFeedback(this.feedback)
      .subscribe(feedback => this.feedback = feedback );
    this.fbService.getSubmissionIds()
      .subscribe(feedbackIds => { this.feedbackIds = feedbackIds ; 
                                  this.fbService.getSubmission(this.feedbackIds.length)
                                    .subscribe(submission => this.submission = submission ); 
                                }); 
    this.temporaire = 'hidden';
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
  }

}
