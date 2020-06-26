import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@hmbmk/record-common';
import { Ticket } from '../../models/record';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const record = Ticket.build({
      id,
      title,
      price
    });
    await record.save();

    msg.ack();
  }
}
