import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { secret } from 'config/env';
import { RowDataPacket, OkPacket } from 'mysql';
import { CUDRows } from 'types/app';
import { Response } from 'express';
import { ValidatePassword } from 'types/utils';

export const dbQueryToStr = (obj: Record<string, string | null>): string =>
  Object.keys(obj)
    .filter(key => obj[key] !== undefined)
    .map(key => {
      let value = '';
      if (typeof obj[key] === 'string') value = `"${obj[key]}"`;
      if (typeof obj[key] === 'boolean') {
        if (obj[key]) value = 'True';
        else value = 'False';
      }
      if (obj[key] === null) value = 'NULL';
      return `${key}=${value}`;
    })
    .join();

export const generateJwt = (id: number): string =>
  jwt.sign(
    {
      id,
    },
    secret,
    { expiresIn: '24h' },
  );

export const generatePbkdf2 = (
  password: string,
): { salt: string; hash: string } => {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10, 32, 'sha512')
    .toString('hex');
  return { salt, hash };
};

export const validatePassword = ({
  password,
  hash,
  salt,
}: ValidatePassword): boolean =>
  crypto.pbkdf2Sync(password, salt, 10, 32, 'sha512').toString('hex') === hash;

export const checkUpdated = (
  rows: RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[],
  res: Response,
): void => res.status((rows as CUDRows).affectedRows === 0 ? 500 : 200).end();

export const isUpdated = (
  rows: RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[],
): boolean => (rows as CUDRows).affectedRows !== 0;
