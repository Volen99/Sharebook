import {Injectable} from '@angular/core';
import {ICustomerFeedback} from './feedback.model';
import {HttpService} from '../../../core/backend/common/api/http.service';

import {
  faGrinHearts,
  faSmile,
  faMeh,
  faFrown,
  faMehRollingEyes,
} from '@fortawesome/pro-light-svg-icons';
import {IconDefinition} from '@fortawesome/fontawesome-common-types';

export interface IActionItem {
  id?: number;
  name?: string;
  icon?: IconDefinition;
  destructive?: boolean;
  disabled?: boolean;
  isDivider?: boolean;
}

const SEND_FEEDBACK_API_ENDPOINT = 'feedback/send';

export type FeedbackFormMode = 'form' | 'failed' | 'sending' | 'sent';

@Injectable({providedIn: 'root'})
export class CustomerFeedbackService {
  public defaultRateItem: IActionItem = {id: 2, name: 'neutral', icon: faMeh};

  public ratingItems: IActionItem[] = [
    {id: 0, name: 'loving it', icon: faGrinHearts},
    {id: 1, name: 'like it', icon: faSmile},
    this.defaultRateItem,
    {id: 3, name: 'don\'t like it', icon: faFrown},
    {id: 4, name: 'really don\'t like it', icon: faMehRollingEyes},
  ];

  public feedbackRate: IActionItem = this.defaultRateItem;
  public feedbackMessage = '';
  public mode: FeedbackFormMode = 'form';
  public includeScreenshot = false;

  public get feedbackDiscovered() {
    return true; // this._feedbackDiscovered;
  }

  constructor(private hrs: HttpService) {
  }

  public async sendFeedback(feedback: ICustomerFeedback): Promise<ICustomerFeedback> {
    const url = `${SEND_FEEDBACK_API_ENDPOINT}`;
    const result = await this.hrs.post(url, feedback).toPromise(); // .toPromise() by mi
    return result;
  }

}
