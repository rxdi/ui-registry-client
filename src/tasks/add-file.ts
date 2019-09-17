import request from 'request';
import { createReadStream } from 'fs';
import { nextOrDefault } from '../helpers/cli';
import { AbstractRunner, Config } from '../tokens';
import { Injectable, Container } from '@rxdi/core';
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
    const config = Container.get(Config);
    return new Promise<{ ETag: string }>((resolve, reject) => {
      request.post(
        {
          headers: {
            authorization: nextOrDefault('--authorization', null) || config.token
          },
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
