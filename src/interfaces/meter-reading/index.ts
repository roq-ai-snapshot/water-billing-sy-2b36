import { WaterBillInterface } from 'interfaces/water-bill';
import { ConsumerInterface } from 'interfaces/consumer';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface MeterReadingInterface {
  id?: string;
  consumer_id: string;
  encoder_id: string;
  reading: number;
  reading_date: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string;
  water_bill?: WaterBillInterface[];
  consumer?: ConsumerInterface;
  user?: UserInterface;
  _count?: {
    water_bill?: number;
  };
}

export interface MeterReadingGetQueryInterface extends GetQueryInterface {
  id?: string;
  consumer_id?: string;
  encoder_id?: string;
}
