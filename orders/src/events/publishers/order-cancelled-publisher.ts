import { Subjects, Publisher, OrderCancelledEvent } from '@hmbmk/record-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
