import { Runner } from './helpers/runner';

async function Main() {
  try {
    const body = await Runner();
    console.log(body);
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

Main();
