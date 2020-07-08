import {getInput, setSecret} from '@actions/core';
import {exec} from '@actions/exec';
import {config} from './config';

export async function docker(): Promise<number> {
  try {
    const username: string = getInput('username', {required: true});
    const password: string = getInput('password', {required: true});
    const registry: string = getInput('registry');

    setSecret(password); // should be a no-op but always do this to be safe

    await config();
    // echo $TOKEN | docker login docker.pkg.github.com -u clarkbw --password-stdin
    try {
      return await exec(
        'docker',
        ['login', registry, '-u', username, '--password-stdin'],
        {input: Buffer.from(password)}
      );
    } catch (e) {
      console.error(`Error logging into ${registry}`, e);
      throw e;
    }
    return -100;
  } catch (e) {
    console.error(`Bailing on login attempt ${e}`);
    throw e;
  }
  return -1000;
}
