import {docker} from '../src/docker';
import * as config from '../src/config';

import * as path from 'path';

import * as exec from '@actions/exec';
import {rmRF} from '@actions/io';

const TOOL_DIR = path.join(__dirname, 'runner', 'tools');
const TEMP_DIR = path.join(__dirname, 'runner', 'temp');
process.env['RUNNER_TOOL_CACHE'] = TOOL_DIR;
process.env['RUNNER_TEMP'] = TEMP_DIR;

// will need to clean out this directory for tests
// await rmRF(TOOL_DIR);

beforeEach(async () => {
  expect(process.env['DOCKER_CONFIG']).toBeUndefined();
  await rmRF(TEMP_DIR);
});

afterEach(async () => {
  if (process.env['DOCKER_CONFIG']) {
    await rmRF(process.env['DOCKER_CONFIG']);
    delete process.env['DOCKER_CONFIG'];
  }
}, 300000);

test('calls config and runs exec', async () => {
  const configSpy: jest.SpyInstance = jest.spyOn(config, 'config');
  const execSpy: jest.SpyInstance = jest.spyOn(exec, 'exec');
  // don't let exec try to actually run the commands
  execSpy.mockImplementation(() => {});

  const username: string = 'dbowie';
  process.env[`INPUT_USERNAME`] = username;

  const password: string = 'groundcontrol';
  process.env[`INPUT_PASSWORD`] = password;

  const registry: string = 'https://docker.pkg.github.com';
  process.env[`INPUT_REGISTRY`] = registry;

  await docker();

  expect(configSpy).toHaveBeenCalled();
  expect(execSpy).toHaveBeenCalledWith(
    `docker`,
    ['login', '--username', username, '--password-stdin', registry],
    {input: Buffer.from(password)}
  );
});
