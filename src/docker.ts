import {getInput, setSecret, addPath, debug, setFailed} from '@actions/core';
import {exec} from '@actions/exec';
import * as tc from '@actions/tool-cache';
import {join} from 'path';

import {config} from './config';

export async function docker(): Promise<number> {
  try {
    const username: string = getInput('username', {required: true});
    const password: string = getInput('password', {required: true});
    const registry: string = getInput('registry');

    setSecret(password); // should be a no-op but always do this to be safe

    await config();

    await cli();
    // echo $TOKEN | docker login docker.pkg.github.com -u clarkbw --password-stdin
    try {
      return await exec(
        'docker',
        ['login', '--username', username, '--password-stdin', registry],
        {input: Buffer.from(password)}
      );
    } catch (e) {
      console.error(`Error logging into ${registry}`, e);
      throw e;
    }
    return -100;
  } catch (e) {
    console.error(`Bailing on login attempt ${e}`);
    throw e;
  }
  return -1000;
}

// https://download.docker.com/mac/static/stable/x86_64/docker-19.03.12.tgz

async function cli() {
  const IS_MAC = process.platform === 'darwin';
  // currently only the Mac requires this install
  if (!IS_MAC) {
    return;
  }
  const DOCKER_VERSION = '19.03.12';
  const ARCHITECTURE = 'x86_64'; // https://download.docker.com/mac/static/stable/
  const RELEASE = 'stable'; // edge, nightly, test https://download.docker.com/mac/static/
  const DOCKER_URL = `https://download.docker.com/mac/static/${RELEASE}/${ARCHITECTURE}/docker-${DOCKER_VERSION}.tgz`;
  // https://github.com/actions/runner/blob/2709cbc0eae592e6004b016c52c04382f19c7683/src/Runner.Common/HostContext.cs#L243-L244
  debug(`DOCKER_URL ${DOCKER_URL}`);
  const CACHE_DIR = process.env['RUNNER_TOOL_CACHE'] || '';
  debug(`CACHE_DIR ${CACHE_DIR}`);
  const PATH = join(CACHE_DIR, 'docker', DOCKER_VERSION, ARCHITECTURE);
  debug(`PATH ${PATH}`);

  let toolPath: string = '';
  try {
    toolPath = tc.find('docker', DOCKER_VERSION, ARCHITECTURE);
  } catch (err) {
    setFailed(`Could not find toolpath ${err}`);
  }
  debug(`toolPath ${toolPath}`);

  if (!toolPath) {
    let downloadPath: string = '';
    try {
      downloadPath = await tc.downloadTool(DOCKER_URL);
    } catch (err) {
      setFailed(`Could not download tool ${err}`);
    }
    debug(`downloadPath ${downloadPath}`);

    let dockerExtractedFolder: string = '';
    try {
      dockerExtractedFolder = await tc.extractTar(downloadPath, PATH);
    } catch (err) {
      setFailed(`Could not extract tar ${err}`);
    }
    debug(`dockerExtractedFolder ${dockerExtractedFolder}`);

    const cachedPath = await tc.cacheDir(
      dockerExtractedFolder,
      'docker',
      DOCKER_VERSION,
      ARCHITECTURE
    );
    debug(`cachedPath ${cachedPath}`);

    toolPath = cachedPath;
  }

  toolPath = join(toolPath, 'docker');
  debug(`toolPath ${toolPath}`);

  debug(`ENV ${JSON.stringify(process.env['PATH'])}`);
  debug(`add path ${toolPath}`);
  addPath(toolPath);
  debug(`ENV ${JSON.stringify(process.env['PATH'])}`);
}

async function fetch(platform: string, architecture: string, version: string) {}
