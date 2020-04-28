import * as core from '@actions/core';
import {docker} from './docker';

async function run(): Promise<void> {
  try {
    docker();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
