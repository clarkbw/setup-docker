import {setFailed} from '@actions/core';
import {docker} from './docker';

export async function run(): Promise<void> {
  try {
    await docker();
  } catch (e) {
    setFailed(e.message);
    throw e;
  }
}

run();
