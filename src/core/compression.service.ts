import { PrivateCryptoModel, Injectable, FileService } from '@rxdi/core';
import { createReadStream, createWriteStream, exists, lstat } from 'fs';
import { createGzip, createGunzip } from 'zlib';
import { Observable } from 'rxjs';
import archiver from 'archiver';
import { join } from 'path';
import { promisify } from 'util';
@Injectable()
export class CompressionService {
  constructor(private fileService: FileService) {}
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

  public async gZipAll(folder: string, output: string) {
    const zip = createWriteStream(output);
    const archive = archiver('tar', {
      zlib: { level: 9 } // Sets the compression level.
    });
    archive.on('error', function(err) {
      throw err;
    });
    archive.pipe(zip);
    let files: string[] = [];
    if (await promisify(exists)(folder)) {
      const file = await promisify(lstat)(folder);
      if (file && file.isDirectory()) {
        files = await this.fileService.fileWalker(folder).toPromise();
      } else if (file.isFile()) {
        files.push(folder);
      }
    } else {
      throw new Error('Missing file or directory!');
    }
    const archiveFiles = [];
    for (const file of files) {
      const name = file
        .replace(process.cwd(), '')
        .replace(/^\/|\/$/g, '');
      archiveFiles.push(name);
      archive.file(file, {
        name
      });
      console.log(`Added ${name}`);
    }
    await archive.finalize();
    console.log(`Output archive created: ${join(process.cwd(), output)}`);
    return { archivePath: output, archiveFiles };
  }
}
