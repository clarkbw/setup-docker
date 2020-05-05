import * as config from '../src/config';
import * as cleanup from '../src/cleanup';

import * as fs from 'fs';
import * as path from 'path';

import {rmRF} from '@actions/io';

process.env['RUNNER_TEMP'] = path.join(__dirname, 'runner');

beforeEach(() => {
  expect(process.env['DOCKER_CONFIG']).toBeUndefined();
});

afterEach(async () => {
  if (process.env['DOCKER_CONFIG']) {
    await rmRF(process.env['DOCKER_CONFIG']);
    delete process.env['DOCKER_CONFIG'];
  }
}, 300000);

test('config directory is created', async () => {
  await config.config();

  expect(process.env['DOCKER_CONFIG']).toBeDefined();
  if (process.env['DOCKER_CONFIG']) {
    expect(fs.existsSync(process.env['DOCKER_CONFIG'])).toBe(true);
  } else {
    fail();
  }
});

test('env variable set for experimental features', async () => {
  process.env[`INPUT_EXPERIMENTAL`] = 'enabled';

  await config.config();

  expect(process.env['DOCKER_CONFIG']).toBeDefined();
  if (process.env['DOCKER_CONFIG']) {
    expect(fs.existsSync(process.env['DOCKER_CONFIG'])).toBe(true);
  } else {
    fail();
  }

  expect(process.env['DOCKER_CLI_EXPERIMENTAL']).toBe('enabled');

  delete process.env[`INPUT_EXPERIMENTAL`];
});

test('config directory is cleaned up on exit', async () => {
  process.env[`INPUT_EXPERIMENTAL`] = 'enabled';
  await config.config();
  expect(process.env['DOCKER_CONFIG']).toBeDefined();
  if (process.env['DOCKER_CONFIG']) {
    expect(fs.existsSync(process.env['DOCKER_CONFIG'])).toBe(true);
  } else {
    fail();
  }

  const dir = process.env['DOCKER_CONFIG']; // keep directory name around
  await cleanup.run();

  expect(fs.existsSync(dir)).toBe(false);
  expect(process.env['DOCKER_CONFIG']).toBeUndefined();
  expect(process.env['DOCKER_CLI_EXPERIMENTAL']).toBeUndefined();
});
