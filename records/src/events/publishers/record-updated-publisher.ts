import { Publisher, Subjects, TicketUpdatedEvent } from '@hmbmk/record-common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
