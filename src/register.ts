import {addPath} from '@actions/core';
import {resolve} from 'path';

const IS_WINDOWS = process.platform === 'win32';

export async function register() {
  if (!IS_WINDOWS) {
    addPath(resolve(__dirname, 'bin/secretservice'));
  }
}
