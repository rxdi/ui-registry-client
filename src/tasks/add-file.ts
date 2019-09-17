import request from 'request';
import { createReadStream } from 'fs';
import { nextOrDefault } from '../helpers/cli';
import { AbstractRunner } from '../tokens';
import { Injectable } from '@rxdi/core';
import { CompressionService } from '../core/compression.service';

@Injectable()
export class AddFile implements AbstractRunner<{ ETag: string }> {
  constructor(private zip: CompressionService) {}
  async run() {
    const file = nextOrDefault('add');
    // await this.zip.gZipFile(file, './pesho.tar.gz').toPromise();
    // await this.zip.readGzipFile('./pesho.tar.gz', './out/file.').toPromise();
    const { archivePath } = await this.zip.gZipAll(
      file,
      nextOrDefault('--zip-name', './rxdi.tar.gz')
    );

    return new Promise<{ ETag: string }>((resolve, reject) => {
      request.post(
        {
          url: nextOrDefault('--url', 'http://0.0.0.0:9000/upload', v =>
            String(v)
          ),
          formData: {
            file: createReadStream(archivePath)
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
