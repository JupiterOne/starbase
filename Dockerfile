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
  # nodegit dependencies
  apt-get install -y \
  libgssapi-krb5-2 \
  ca-certificates

RUN update-ca-certificates
RUN yarn install

ENTRYPOINT ["yarn", "starbase"]
