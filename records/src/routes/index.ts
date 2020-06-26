import express, { Request, Response } from 'express';
import { Ticket } from '../models/record';

const router = express.Router();

router.get('/api/records', async (req: Request, res: Response) => {
  const records = await Ticket.find({
    orderId: undefined
  });

  res.send(records);
});

export { router as indexTicketRouter };
