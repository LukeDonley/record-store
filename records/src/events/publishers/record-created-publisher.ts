import { Publisher, Subjects, TicketCreatedEvent } from '@hmbmk/record-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
