import {docker} from '../src/docker';
import * as config from '../src/config';

import * as path from 'path';

import * as exec from '@actions/exec';

process.env['RUNNER_TEMP'] = path.join(__dirname, 'runner');

test('calls config and runs exec', async () => {
  const configSpy: jest.SpyInstance = jest.spyOn(config, 'config');
  const execSpy: jest.SpyInstance = jest.spyOn(exec, 'exec');
  // don't let exec try to actually run the commands
  execSpy.mockImplementation(() => {});

  const username: string = 'dbowie';
  process.env[`INPUT_USERNAME`] = username;

  const password: string = 'groundcontrol';
  process.env[`INPUT_PASSWORD`] = password;

  const registry: string = 'docker.pkg.github.com';
  process.env[`INPUT_REGISTRY`] = registry;

  await docker();

  expect(configSpy).toHaveBeenCalled();
  expect(execSpy).toHaveBeenCalledWith(
    `docker`,
    ['login', registry, '-u', username, '--password-stdin'],
    {input: Buffer.from(password)}
  );
});
