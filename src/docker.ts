import {getInput, setSecret} from '@actions/core';
import {exec} from '@actions/exec';
import {config} from './config';
import {default as prepend} from 'prepend-http';

export async function docker(): Promise<number> {
  try {
    const username: string = getInput('username', {required: true});
    const password: string = getInput('password', {required: true});
    const registry: string = getInput('registry') || 'docker.io';

    setSecret(password); // should be a no-op but always do this to be safe

    await config();
    // echo $TOKEN | docker login docker.pkg.github.com -u clarkbw --password-stdin
    try {
      return await exec(
        'docker',
        [
          'login',
          '--username',
          username,
          '--password-stdin',
          prepend(registry)
        ],
        {input: Buffer.from(password), silent: true}
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
