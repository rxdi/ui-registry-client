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
    const { archivePath, archiveFiles } = await this.zip.gZipAll(
      file,
      nextOrDefault('--zip-name', './rxdi.tar.gz')
    );
    function postRequest(url: string, archivedFiles: string[] = []) {
      return new Promise<{ ETag: string }>((resolve, reject) => {
        request.post(
          {
            headers: {
              authorization:
                nextOrDefault('--authorization', null) || config.token
            },
            url,
            body: {
              archivedFiles
            },
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
    const config = Container.get(Config);
    let data: any;

    try {
      const endpoint =
        nextOrDefault('--url', null) ||
        config.registry ||
        'http://0.0.0.0:9000/upload';
      console.log(`Uploading file to endpoint: ${endpoint}`);
      data = await postRequest(endpoint, archiveFiles);
      if (typeof(data) === 'string') {
        let parse: any = {};
        try {
          parse =  JSON.parse(data);
        } catch (e) {}
        if (parse.statusCode && parse.statusCode !== '200') {
          throw new Error(data);
        }
      }
    } catch (e) {
      console.log(`Uploading file failed!`);
      console.error(e);
      console.log('Re-trying with endpoint: http://0.0.0.0:9000/upload...');
      try {
        data = await postRequest('http://0.0.0.0:9000/upload', archiveFiles);
      } catch (e) {
        console.error(e);
        console.log('Re-trying failed. Upload Failed!');
      }
    }
    return data;
  }
}
