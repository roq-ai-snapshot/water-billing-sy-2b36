import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { consumerValidationSchema } from 'validationSchema/consumers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getConsumers();
    case 'POST':
      return createConsumer();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getConsumers() {
    const data = await prisma.consumer
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'consumer'));
    return res.status(200).json(data);
  }

  async function createConsumer() {
    await consumerValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.meter_reading?.length > 0) {
      const create_meter_reading = body.meter_reading;
      body.meter_reading = {
        create: create_meter_reading,
      };
    } else {
      delete body.meter_reading;
    }
    if (body?.water_bill?.length > 0) {
      const create_water_bill = body.water_bill;
      body.water_bill = {
        create: create_water_bill,
      };
    } else {
      delete body.water_bill;
    }
    const data = await prisma.consumer.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
