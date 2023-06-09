import axios from 'axios';
import queryString from 'query-string';
import { ConsumerInterface, ConsumerGetQueryInterface } from 'interfaces/consumer';
import { GetQueryInterface } from '../../interfaces';

export const getConsumers = async (query?: ConsumerGetQueryInterface) => {
  const response = await axios.get(`/api/consumers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createConsumer = async (consumer: ConsumerInterface) => {
  const response = await axios.post('/api/consumers', consumer);
  return response.data;
};

export const updateConsumerById = async (id: string, consumer: ConsumerInterface) => {
  const response = await axios.put(`/api/consumers/${id}`, consumer);
  return response.data;
};

export const getConsumerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/consumers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteConsumerById = async (id: string) => {
  const response = await axios.delete(`/api/consumers/${id}`);
  return response.data;
};
