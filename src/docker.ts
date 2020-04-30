import * as core from '@actions/core';
import {exec} from '@actions/exec';
import {join} from 'path';
import {mkdirP} from '@actions/io';

export async function docker(): Promise<number> {
  const username: string = core.getInput('username', {required: true});
  const password: string = core.getInput('password', {required: true});
  const registry: string = core.getInput('registry');

  core.setSecret(password); // should be a no-op but always do this to be safe

  await config();

  // echo $TOKEN | docker login docker.pkg.github.com -u clarkbw --password-stdin
  return await exec(
    'docker',
    ['login', registry, '-u', username, '--password-stdin'],
    {input: Buffer.from(password)}
  );
}

async function config(): Promise<void> {
  // https://docs.docker.com/engine/reference/commandline/cli/#change-the-docker-directory
  const temp: string = process.env['RUNNER_TEMP'] || '';
  const dir = join(temp, `.docker-${Date.now()}`);
  await mkdirP(dir);
  core.exportVariable('DOCKER_CONFIG', dir);
  console.log(`$DOCKER_CONFIG = ${config}`);
}
