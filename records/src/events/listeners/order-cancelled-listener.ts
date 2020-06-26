import { Listener, OrderCancelledEvent, Subjects } from '@hmbmk/record-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/record';
import { TicketUpdatedPublisher } from '../publishers/record-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const record = await Ticket.findById(data.record.id);

    if (!record) {
      throw new Error('Ticket not found');
    }

    record.set({ orderId: undefined });
    await record.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: record.id,
      orderId: record.orderId,
      userId: record.userId,
      price: record.price,
      title: record.title,
      version: record.version
    });

    msg.ack();
  }
}
