#!/usr/bin/env bash

action="${1}"

if [ "${action}" == "ver" ]
then
    git checkout -- src/version.js

    VERSION="$(node -p -e "require('./package.json').version")"
    TAG="$(git name-rev --tags --name-only HEAD)"
    CLEANED="$([ -z "$(git status --porcelain)" ] && echo -n "" || echo -n "*")"
    REV="$(git rev-parse --short HEAD)"
    FULLVERSION="${VERSION} - ${REV}${CLEANED}"
    if [ "${TAG}" != "undefined" ]
    then
        if [ "${TAG}" != "v${VERSION}" ]
        then
            FULLVERSION="${FULLVERSION} (${TAG})"
        fi
    fi
    echo "export const version='${FULLVERSION}';"> src/version.js
fi

if [ "${action}" == "dev" ]
then
    git checkout -- src/version.js
fi



