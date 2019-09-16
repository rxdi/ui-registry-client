import request from 'request';
import { createReadStream } from 'fs';
import { nextOrDefault } from './cli';

export function UploadFile() {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: nextOrDefault('--url', 'http://0.0.0.0:9000/upload', v => String(v)),
        formData: {
          file: createReadStream(nextOrDefault('--add')),
        },
      },
      (error, response, body) => {
        if (error) {
          return reject(error);
        }
        resolve(body);
      }
    );
  });
}
