import { PrivateCryptoModel, Injectable } from '@rxdi/core';
import { createReadStream, createWriteStream } from 'fs';
import { createGzip, createGunzip } from 'zlib';
import { Observable } from 'rxjs';
import archiver from 'archiver';
import { join, basename } from 'path';
import fg from 'fast-glob';

@Injectable()
export class CompressionService {
  constructor() {}
  public gZipFile(
    input: string,
    output: string,
    options: PrivateCryptoModel = { cyperIv: '', algorithm: '', cyperKey: '' }
  ) {
    return new Observable(observer => {
      createReadStream(input)
        .pipe(createGzip())
        // .pipe(createCipheriv(config.algorithm, config.cyperKey, config.cyperIv))
        .pipe(createWriteStream(output))
        .on('finish', () => {
          observer.next(true);
          observer.complete();
        })
        .on('error', err => {
          observer.error(err);
          observer.complete();
        });
    });
  }

  public readGzipFile(
    input: string,
    output: string,
    options: PrivateCryptoModel = { cyperIv: '', algorithm: '', cyperKey: '' }
  ) {
    return new Observable(observer => {
      createReadStream(input)
        // .pipe(createDecipheriv(config.algorithm, config.cyperKey, config.cyperIv))
        .pipe(createGunzip())
        .pipe(createWriteStream(output))
        .on('finish', () => {
          observer.next(true);
          observer.complete();
        })
        .on('error', err => {
          observer.error(err);
          observer.complete();
        });
    });
  }

  public async gZipAll(folders: string[], output: string) {
    const zip = createWriteStream(output);
    const archive = archiver('tar', {
      zlib: { level: 9 } // Sets the compression level.
    });
    archive.on('error', function(err) {
      throw err;
    });
    archive.pipe(zip);
    const archiveFiles = [];
    for (const name of await fg(folders, {
      ignore: [
        '!**/.git',
        '!**/node_modules',
        '!**/.cache',
        '!**/.rxdi',
        `!**/${basename(output)}`,
      ],
      dot: true
    })) {
      archive.file(name, {
        name
      });
      archiveFiles.push(name);
      console.log(`Added ${name}`);
    }
    await archive.finalize();
    console.log(`Output archive created: ${join(process.cwd(), output)}`);
    return { archivePath: output, archiveFiles };
  }
}
