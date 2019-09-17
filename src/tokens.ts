import { InjectionToken } from '@rxdi/core';

export interface AbstractRunner<T> {
  run(): Promise<T>;
}

export interface Config {
  token: string;
  registry: string;
}

export const Config = new InjectionToken<Config>('rxdi-registry-client-config');
