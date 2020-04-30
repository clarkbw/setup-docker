import * as fs from 'fs';
import {join} from 'path';

import * as core from '@actions/core';
import {mkdirP} from '@actions/io';

export const CONFIG_FILE = 'config.json';
export const EXPERIMENTAL_CONFIG = {
  experimental: 'enabled'
};

export async function config(): Promise<void> {
  // https://docs.docker.com/engine/reference/commandline/cli/#change-the-docker-directory
  const temp: string = process.env['RUNNER_TEMP'] || '';
  const dir = join(temp, `.docker-${Date.now()}`);
  await mkdirP(dir);
  core.exportVariable('DOCKER_CONFIG', dir);
  console.log(`$DOCKER_CONFIG = ${dir}`);

  const experimental: string = core.getInput('experimental');
  if (experimental) {
    const location = join(dir, CONFIG_FILE);
    if (fs.existsSync(location)) {
      console.warn(`overwriting existing file ${location}`);
    } else {
      console.log(`writing ${location}`);
    }

    fs.writeFileSync(location, JSON.stringify(EXPERIMENTAL_CONFIG), {
      encoding: 'utf-8',
      flag: 'w'
    });
  }
}
