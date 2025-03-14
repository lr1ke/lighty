// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:

// import { Content } from "next/font/google";

const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

const customers = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'White Rabbit',
    email: 'white@rabbit.com',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
  },
];

const entries = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000', 
    title: '', // Set to empty string
    content: 'Content for entry 1',
    owner: '550e8400-e29b-41d4-a716-446655440001', // Replace with a valid UUID
    timestamp: new Date(),
    location: 'Location 1',
    lon: -73.935242,
    lat: 40.730610,
    token1: '', // Set to empty string
    token2: '', // Set to empty string
    token3: '', // Set to empty string
    customer_id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', // Link to a customer
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002', 
    title: '', // Set to empty string
    content: 'Content for entry 2',
    owner: '550e8400-e29b-41d4-a716-446655440002', 
    timestamp: new Date(),
    location: 'Location 2',
    lon: -74.0060,
    lat: 40.7128,
    token1: '', // Set to empty string
    token2: '', // Set to empty string
    token3: '', // Set to empty string
    customer_id: '3958dc9e-712f-4377-85e9-fec4b6a6442a', // Link to another customer
  },
];


export { users, customers, entries };
