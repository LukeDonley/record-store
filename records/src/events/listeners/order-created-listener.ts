import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@hmbmk/record-common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/record';
import { TicketUpdatedPublisher } from '../publishers/record-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the record that the order is reserving
    const record = await Ticket.findById(data.record.id);

    // If no record, throw error
    if (!record) {
      throw new Error('Ticket not found');
    }

    // Mark the record as being reserved by setting its orderId property
    record.set({ orderId: data.id });

    // Save the record
    await record.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: record.id,
      price: record.price,
      title: record.title,
      userId: record.userId,
      orderId: record.orderId,
      version: record.version
    });

    // ack the message
    msg.ack();
  }
}
