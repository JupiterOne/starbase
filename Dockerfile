FROM node:14-buster-slim

ENV APP_DIR=/opt/jupiterone/starbase
WORKDIR ${APP_DIR}

COPY src/ ${APP_DIR}/src
COPY [ \
  "LICENSE", \
  "package.json", \
  "tsconfig.dist.json", \
  "tsconfig.json", \
  "yarn.lock", \
  "config.yaml", \
  "./" \
  ]

RUN apt-get update && \
  apt-get upgrade -y && \
  apt-get install -y git

RUN yarn install

ENTRYPOINT ["yarn", "starbase"]
