import * as main from '../src/main';
import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';

// shows how the runner will run a javascript action with env / stdout protocol
test('test get', () => {
  const username: string = 'dbowie';
  process.env[`INPUT_USERNAME`] = username;

  const password: string = 'groundcontrol';
  process.env[`INPUT_PASSWORD`] = password;

  const registry: string = 'https://containers.pkg.github.com';
  process.env[`INPUT_REGISTRY`] = registry;
  const ip = path.join(__dirname, '..', 'lib', 'credential-helper.js');
  const options: cp.ExecSyncOptions = {
    env: process.env
  };
  const output = JSON.parse(
    cp.execSync(`node ${ip} get ${registry}`, options).toString()
  );
  expect(output).toMatchObject({Username: username, Secret: password});
});
