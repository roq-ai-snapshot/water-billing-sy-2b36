import * as yup from 'yup';
import { consumerValidationSchema } from 'validationSchema/consumers';

export const companyValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  image: yup.string(),
  tenant_id: yup.string().required(),
  user_id: yup.string().nullable().required(),
  consumer: yup.array().of(consumerValidationSchema),
});
