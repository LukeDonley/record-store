import { Ticket } from '../record';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a record
  const record = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });

  // Save the record to the database
  await record.save();

  // fetch the record twice
  const firstInstance = await Ticket.findById(record.id);
  const secondInstance = await Ticket.findById(record.id);

  // make two separate changes to the records we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the first fetched record
  await firstInstance!.save();

  // save the second fetched record and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const record = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123'
  });

  await record.save();
  expect(record.version).toEqual(0);
  await record.save();
  expect(record.version).toEqual(1);
  await record.save();
  expect(record.version).toEqual(2);
});
