import { Subjects, Publisher, PaymentCreatedEvent } from '@hmbmk/record-common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
