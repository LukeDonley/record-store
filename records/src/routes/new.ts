import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@hmbmk/record-common';
import { Ticket } from '../models/record';
import { TicketCreatedPublisher } from '../events/publishers/record-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/records',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const record = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id
    });
    await record.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: record.id,
      title: record.title,
      price: record.price,
      userId: record.userId,
      version: record.version
    });

    res.status(201).send(record);
  }
);

export { router as createTicketRouter };
