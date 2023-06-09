import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createWaterBill } from 'apiSdk/water-bills';
import { Error } from 'components/error';
import { waterBillValidationSchema } from 'validationSchema/water-bills';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ConsumerInterface } from 'interfaces/consumer';
import { UserInterface } from 'interfaces/user';
import { MeterReadingInterface } from 'interfaces/meter-reading';
import { getConsumers } from 'apiSdk/consumers';
import { getUsers } from 'apiSdk/users';
import { getMeterReadings } from 'apiSdk/meter-readings';
import { WaterBillInterface } from 'interfaces/water-bill';

function WaterBillCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: WaterBillInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createWaterBill(values);
      resetForm();
      router.push('/water-bills');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<WaterBillInterface>({
    initialValues: {
      amount_due: 0,
      due_date: new Date(new Date().toDateString()),
      status: '',
      consumer_id: (router.query.consumer_id as string) ?? null,
      treasurer_id: (router.query.treasurer_id as string) ?? null,
      meter_reading_id: (router.query.meter_reading_id as string) ?? null,
    },
    validationSchema: waterBillValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Water Bill
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="amount_due" mb="4" isInvalid={!!formik.errors?.amount_due}>
            <FormLabel>Amount Due</FormLabel>
            <NumberInput
              name="amount_due"
              value={formik.values?.amount_due}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('amount_due', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.amount_due && <FormErrorMessage>{formik.errors?.amount_due}</FormErrorMessage>}
          </FormControl>
          <FormControl id="due_date" mb="4">
            <FormLabel>Due Date</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.due_date}
              onChange={(value: Date) => formik.setFieldValue('due_date', value)}
            />
          </FormControl>
          <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
            <FormLabel>Status</FormLabel>
            <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
            {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ConsumerInterface>
            formik={formik}
            name={'consumer_id'}
            label={'Select Consumer'}
            placeholder={'Select Consumer'}
            fetcher={getConsumers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email as string}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'treasurer_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email as string}
              </option>
            )}
          />
          <AsyncSelect<MeterReadingInterface>
            formik={formik}
            name={'meter_reading_id'}
            label={'Select Meter Reading'}
            placeholder={'Select Meter Reading'}
            fetcher={getMeterReadings}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.reading as string}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'water_bill',
  operation: AccessOperationEnum.CREATE,
})(WaterBillCreatePage);
