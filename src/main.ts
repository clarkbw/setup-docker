import {setFailed} from '@actions/core';
import {register} from './register';
import {docker} from './docker';

export async function run(): Promise<void> {
  try {
    await register();
    await docker();
  } catch (e) {
    setFailed(e.message);
    throw e;
  }
}

run();
