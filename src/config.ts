import {join} from 'path';

import * as core from '@actions/core';
import {mkdirP} from '@actions/io';

export async function config(): Promise<void> {
  try {
    // https://docs.docker.com/engine/reference/commandline/cli/#change-the-docker-directory
    const temp: string = process.env['RUNNER_TEMP'] || '';
    const dir: string = join(temp, `.docker-${Date.now()}`);

    await mkdirP(dir);

    core.exportVariable('DOCKER_CONFIG', dir);
    console.log(`$DOCKER_CONFIG = ${dir}`);

    const experimental: string = core.getInput('experimental');
    if (experimental) {
      core.exportVariable('DOCKER_CLI_EXPERIMENTAL', 'enabled');
      console.log(`DOCKER_CLI_EXPERIMENTAL=enabled`);
    }
  } catch (e) {
    console.error(`Error setting DOCKER_CONFIG`, e);
    throw e;
  }
}
