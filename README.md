<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Why

Many Actions workflows require a step for logging into Docker and there are a mirriad of ways to accomplish this.

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

###

## Cleaning up

Finally this action is designed to clean up the Docker credentials after the job is run because by default Docker saves the passwords in a plaintext `config.json` file.

# Usage

Add the `clarkbw/setup-docker@master` to your Actions workflow file.  To log into a registry you'll need to pass in a username, password, and registry domain.

```yml
- uses: clarkbw/setup-docker@master
  with:
    username: $GITHUB_ACTOR
    password: ${{ secrets.GITHUB_TOKEN }}
    registry: docker.pkg.github.com
```

And here's how it looks in a full example.  If login your job will continue and you can use your `docker build` and `docker push` commands.

```yml
name: Docker Image CI

on:
  push:

jobs:

  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - uses: clarkbw/setup-docker@master
      with:
        username: $GITHUB_ACTOR
        password: ${{ secrets.GITHUB_TOKEN }}
    - name: Build the Docker image
      run: docker build . --tag docker.pkg.github.com/github/container-registry-playground/container-registry-playground:latest
    - name: Publish the Docker image
      run: docker push docker.pkg.github.com/github/container-registry-playground/container-registry-playground:latest
```



## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder. 

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run pack
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml)])

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/javascript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
