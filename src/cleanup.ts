import {rmRF} from '@actions/io';

export async function run() {
  const directory: string | undefined = process.env['DOCKER_CONFIG'];
  if (directory) {
    await rmRF(directory);
    console.log(`cleanup: removing $DOCKER_CONFIG directory ${directory}`);
  }
  delete process.env['DOCKER_CLI_EXPERIMENTAL'];
  delete process.env['DOCKER_CONFIG'];
}

run();
