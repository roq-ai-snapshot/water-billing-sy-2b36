import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { consumerValidationSchema } from 'validationSchema/consumers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.consumer
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getConsumerById();
    case 'PUT':
      return updateConsumerById();
    case 'DELETE':
      return deleteConsumerById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getConsumerById() {
    const data = await prisma.consumer.findFirst(convertQueryToPrismaUtil(req.query, 'consumer'));
    return res.status(200).json(data);
  }

  async function updateConsumerById() {
    await consumerValidationSchema.validate(req.body);
    const data = await prisma.consumer.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteConsumerById() {
    const data = await prisma.consumer.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
