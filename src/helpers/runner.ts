import { AbstractRunner } from '../tokens';
import { Container } from '@rxdi/core';
import { includes } from './cli';
import { AddFile } from '../tasks/add-file';

export async function Runner<T>() {
  let task: Function;
  if (includes('add')) {
    task = AddFile;
  }
  return await Container.get<AbstractRunner<T>>(task).run();
}
