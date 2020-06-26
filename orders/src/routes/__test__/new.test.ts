import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/record';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the record does not exist', async () => {
  const recordId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ recordId })
    .expect(404);
});

it('returns an error if the record is already reserved', async () => {
  const record = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await record.save();
  const order = Order.build({
    record,
    userId: 'laskdflkajsdf',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ recordId: record.id })
    .expect(400);
});

it('reserves a record', async () => {
  const record = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await record.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ recordId: record.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const record = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await record.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ recordId: record.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
