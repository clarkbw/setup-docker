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

test('config file created for experimental', async () => {
  process.env[`INPUT_EXPERIMENTAL`] = 'true';

  await config.config();

  expect(process.env['DOCKER_CONFIG']).toBeDefined();
  if (process.env['DOCKER_CONFIG']) {
    expect(fs.existsSync(process.env['DOCKER_CONFIG'])).toBe(true);
  } else {
    fail();
  }

  const file = path.join(process.env['DOCKER_CONFIG'], config.CONFIG_FILE);
  expect(fs.existsSync(file)).toBe(true);
  expect(fs.readFileSync(file, 'utf-8')).toEqual(
    JSON.stringify(config.EXPERIMENTAL_CONFIG)
  );

  delete process.env[`INPUT_EXPERIMENTAL`];
});

test('config directory is cleaned up on exit', async () => {
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
});
