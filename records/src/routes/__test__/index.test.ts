import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
  return request(app).post('/api/records').set('Cookie', global.signin()).send({
    title: 'asldkf',
    price: 20
  });
};

it('can fetch a list of records', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/records').send().expect(200);

  expect(response.body.length).toEqual(3);
});
