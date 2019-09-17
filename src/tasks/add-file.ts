import request from 'request';
import { createReadStream } from 'fs';
import { nextOrDefault } from '../helpers/cli';
import { AbstractRunner } from '../tokens';
import { Injectable } from '@rxdi/core';

@Injectable()
export class AddFile implements AbstractRunner<{ ETag: string }> {
  async run() {
    return new Promise<{ ETag: string }>((resolve, reject) => {
      request.post(
        {
          url: nextOrDefault('--url', 'http://0.0.0.0:9000/upload', v =>
            String(v)
          ),
          formData: {
            file: createReadStream(nextOrDefault('add'))
          }
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
}
