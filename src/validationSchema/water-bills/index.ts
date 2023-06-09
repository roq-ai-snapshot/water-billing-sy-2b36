import * as yup from 'yup';

export const waterBillValidationSchema = yup.object().shape({
  amount_due: yup.number().integer().required(),
  due_date: yup.date().required(),
  status: yup.string().required(),
  consumer_id: yup.string().nullable().required(),
  treasurer_id: yup.string().nullable().required(),
  meter_reading_id: yup.string().nullable().required(),
});
