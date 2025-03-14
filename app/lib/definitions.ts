// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
};

export type Entries = {
  id: string; // UUID
  title?: string; // Optional Title of the entry
  content: string; // Content of the entry
  owner: string; // UUID of the owner
  timestamp: string; // Timestamp of the entry (consider using Date type if needed)
  location: string; 
  lon: number; 
  lat: number; 
  token1?: string; // Optional token field
  token2?: string; // Optional token field
  token3?: string; // Optional token field
  customer_id?: string; // Optional UUID referencing the customer
};


export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  // total_invoices: number;
  // total_pending: number;
  // total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  // total_invoices: number;
  // total_pending: string;
  // total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};


