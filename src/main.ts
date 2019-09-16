import { UploadFile } from './helpers/upload-file';

async function Main() {
  const body = await UploadFile();
  console.log(body);
}

Main();
