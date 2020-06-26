import { Publisher, OrderCreatedEvent, Subjects } from '@hmbmk/record-common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
