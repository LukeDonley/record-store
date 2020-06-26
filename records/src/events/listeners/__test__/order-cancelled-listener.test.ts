import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from '@hmbmk/record-common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Ticket } from '../../../models/record';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const record = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'asdf'
  });
  record.set({ orderId });
  await record.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    record: {
      id: record.id
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { msg, data, record, orderId, listener };
};

it('updates the record, publishes an event, and acks the message', async () => {
  const { msg, data, record, orderId, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(record.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
