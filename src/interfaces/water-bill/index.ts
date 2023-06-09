import { ConsumerInterface } from 'interfaces/consumer';
import { UserInterface } from 'interfaces/user';
import { MeterReadingInterface } from 'interfaces/meter-reading';
import { GetQueryInterface } from 'interfaces';

export interface WaterBillInterface {
  id?: string;
  consumer_id: string;
  treasurer_id: string;
  meter_reading_id: string;
  amount_due: number;
  due_date: Date | string;
  status: string;
  created_at?: Date | string;
  updated_at?: Date | string;

  consumer?: ConsumerInterface;
  user?: UserInterface;
  meter_reading?: MeterReadingInterface;
  _count?: {};
}

export interface WaterBillGetQueryInterface extends GetQueryInterface {
  id?: string;
  consumer_id?: string;
  treasurer_id?: string;
  meter_reading_id?: string;
  status?: string;
}
