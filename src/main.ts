import { Runner } from './helpers/runner';
import { promisify } from 'util';
import { exists } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { Container } from '@rxdi/core';
import { Config } from './tokens';

async function Main() {
  try {
    let config: Config = {} as Config;
    const configPath = join(homedir(), '.rxdi/config.json');
    if (await promisify(exists)(configPath)) {
      try {
        config = require(configPath);
      } catch (e) {
        console.error(`${configPath} present but it is not a valid json`);
      }
    }
    Container.set(Config, config);
    const body = await Runner();
    console.table(body);
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

Main();
