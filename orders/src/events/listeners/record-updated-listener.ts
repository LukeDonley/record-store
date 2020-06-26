import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@hmbmk/record-common';
import { Ticket } from '../../models/record';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const record = await Ticket.findByEvent(data);

    if (!record) {
      throw new Error('Ticket not found');
    }

    const { title, price } = data;
    record.set({ title, price });
    await record.save();

    msg.ack();
  }
}
