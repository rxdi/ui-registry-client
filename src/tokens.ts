import { InjectionToken } from '@rxdi/core';

export interface AbstractRunner<T> {
  run(): Promise<T>;
}

export interface Config {
  token: string;
}

export const Config = new InjectionToken<Config>('rxdi-registry-client-config');
