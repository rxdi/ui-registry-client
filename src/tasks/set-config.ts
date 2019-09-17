import { writeFile } from 'fs';
import { AbstractRunner } from '../tokens';
import { Injectable } from '@rxdi/core';
import { promisify } from 'util';
import { join } from 'path';
import { homedir } from 'os';
import { nextOrDefault } from '../helpers/cli';

@Injectable()
export class SetConfig implements AbstractRunner<string> {
  constructor() {}
  async run() {
    const filePath = join(homedir(), '.rxdi/config.json');
    let config = {
      token: nextOrDefault('--authorization', null),
      registry: nextOrDefault('--url', null)
    };
    try {
      config = JSON.parse(nextOrDefault('set'));
    } catch (e) {}
    await promisify(writeFile)(filePath, JSON.stringify(config, null, 2), {
      encoding: 'utf-8'
    });
    return filePath;
  }
}
