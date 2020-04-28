import {setSecret, getInput} from '@actions/core';
import {exec} from '@actions/exec';

export async function docker(): Promise<string> {
  const username: string = getInput('username', {required: true});
  const password: string = getInput('password', {required: true});
  const registry: string = getInput('registry');

  setSecret(password);

  let output = '';

  const options = {
    input: Buffer.from(password),
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString();
      },
      stderr: (data: Buffer) => {
        output += data.toString();
      }
    }
  };

  //   echo $TOKEN | docker login docker.pkg.github.com -u clarkbw --password-stdin
  await exec(
    'docker',
    ['login', registry, '-u', username, '--password-stdin'],
    options
  );

  return output;
}
