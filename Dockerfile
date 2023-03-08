FROM node:18-bullseye-slim AS stage_init
COPY . /opt/nodeapp
WORKDIR /opt/nodeapp
RUN npm i

FROM stage_init AS stage_build
RUN npm run build

FROM nginx:alpine-slim
COPY --from=stage_build /opt/nodeapp/build /usr/share/nginx/html