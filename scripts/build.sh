#!/bin/bash

set -e

rm -rf dist
mkdir -p dist/wasm

pnpm run lint

if [[ "$(docker images -q clang:hash-wasm 2> /dev/null)" == "" ]]; then
  docker build -f scripts/Dockerfile -t clang:hash-wasm .
fi

# copy to docker volume
docker rm hash-wasm-temp || true
docker volume rm hash-wasm-volume || true
docker container create --name hash-wasm-temp -v hash-wasm-volume:/app busybox
docker cp . hash-wasm-temp:/app

docker run \
  --rm \
  -v hash-wasm-volume:/app \
  -u $(id -u):$(id -g) \
  clang:hash-wasm \
  make -f /app/scripts/Makefile-clang --silent --always-make --output-sync=target -j8 all

# copy output back
docker cp hash-wasm-temp:/app/dist/wasm/ ./dist/
docker rm hash-wasm-temp
docker volume rm hash-wasm-volume

# node scripts/optimize
node scripts/make-json.js
pnpm exec tsup

#-s ASSERTIONS=1 \