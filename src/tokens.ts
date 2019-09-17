export interface AbstractRunner<T> {
  run(): Promise<T>;
}
