export const JWT_CONFIG = {
  secret: 'secret',
  expiresIn: '12h'
}

export enum CartStatus {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED'
}

export const RESPONSE_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const PG_CONNECTION = 'PG_CONNECTION';