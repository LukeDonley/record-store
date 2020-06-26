import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent
} from '@hmbmk/record-common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
