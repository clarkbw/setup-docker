import {getInput} from '@actions/core';
import * as github from '@actions/github';

interface IGetSecret {
  Username: string;
  Secret: string;
}

interface IMsg {
  success?: IGetSecret | string;
  error?: string;
}

function getSecret(request: string): IMsg {
  const username: string = getInput('username', {required: true});
  const password: string = getInput('password', {required: true});
  const registry: string = getInput('registry');
  if (registry == request) {
    return {
      success: {
        Username: username,
        Secret: password
      }
    };
  }
  return {error: 'No such registry service registered with setup-docker'};
}

function print(msg: IMsg): void {
  if (msg.error) {
    console.error(msg.error);
  } else if (msg.success) {
    console.log(JSON.stringify(msg.success));
  }
}

export async function run() {
  const args = process.argv.slice(2);
  let msg: IMsg = {};
  if (args[0] === 'get') {
    msg = getSecret(args[1]);
  } else if (args[0] == 'store') {
    // do nothing for now
  } else {
    msg.error = 'Other commands are unsupported';
  }
  print(msg);
}

run();
