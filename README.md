<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Usage

Add the `clarkbw/setup-docker@v1` to your Actions workflow file to log into a registry. You'll need to pass in a username, password, and registry domain.

```yml
- uses: clarkbw/setup-docker@v1
  with:
    username: $GITHUB_ACTOR
    password: ${{ secrets.GITHUB_TOKEN }}
    registry: docker.pkg.github.com
```

If you want to enable experimental features add the `experimental` option.

```yml
- uses: clarkbw/setup-docker@v1
  with:
    username: $GITHUB_ACTOR
    password: ${{ secrets.GITHUB_TOKEN }}
    registry: docker.pkg.github.com
    experimental: 'enabled'
```


## Options

See the [action.yml](./action.yml) for the complete set of options.

- `username`: the username to log into the docker registry, for example `$GITHUB_ACTOR`
- `password`: the password to log into the docker registry, for example `${{ secrets.GITHUB_TOKEN }}`
- `registry`: the domain of the registry to log into, for example `docker.pkg.github.com` if not provided it will use the default
- `experimental`: option to enable [experimental docker client features](https://docs.docker.com/engine/reference/commandline/cli/#experimental-features) via environment variable, set to  `'enabled'`

# Complete Example 

After `setup-docker` you can use your `docker build` and `docker push` commands to interact with the docker service.

```yml
name: Docker Image CI

on:
  push:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: clarkbw/setup-docker@v1
      with:
        username: $GITHUB_ACTOR
        password: ${{ secrets.GITHUB_TOKEN }}
    - name: Build the Docker image
      run: docker build . --tag docker.pkg.github.com/github/container-registry-playground/container-registry-playground:latest
    - name: Publish the Docker image
      run: docker push docker.pkg.github.com/github/container-registry-playground/container-registry-playground:latest
```

## Credentials

Docker will store the given credentials in the docker `config.json` file. This action places that file in a unique temporary location which can be located via the `DOCKER_CONFIG` environment variable. 

_Docker will complain about the credentials being stored in plaintext and this is why this action removes those credentials in a post cleanup run_

### Cleaning up

When your Action run completes this action is designed to clean up the Docker credentials after the job is run to prevent the credentials from being left behind.

# Why

Many Actions workflows require a step for logging into Docker and there are a mirriad of ways to accomplish this with only 1 secure way.

## Ways to log into Docker

Here are several common ways to log into Docker.

### The preferred method

This method hides the password from logs and shell history by piping it in

```yml
  - name: Login to docker
    run: echo ${{ secrets.GITHUB_TOKEN }} | docker login docker.pkg.github.com -u github-actions --password-stdin
```

### The security risk

This method allows your password to possibly be recorded in logs and / or shell history

```yml
  - name: Login to docker
    run:  docker login docker.pkg.github.com -u github-actions --password ${{ secrets.GITHUB_TOKEN }}
```

