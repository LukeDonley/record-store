import express, { Request, Response } from 'express';
import { NotFoundError } from '@hmbmk/record-common';
import { Ticket } from '../models/record';

const router = express.Router();

router.get('/api/records/:id', async (req: Request, res: Response) => {
  const record = await Ticket.findById(req.params.id);

  if (!record) {
    throw new NotFoundError();
  }

  res.send(record);
});

export { router as showTicketRouter };
