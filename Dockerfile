FROM nginx:stable-alpine

WORKDIR /usr/src/api

COPY . ./

RUN apk add nodejs npm supervisor
RUN npm install pm2 -g

ADD docker/supervisord.conf /etc/supervisor/supervisord.conf
ADD docker/nginx.conf /etc/nginx/nginx.conf
ADD docker/nginx-site.conf /etc/nginx/sites-available/default.conf
RUN mkdir -p /etc/nginx/sites-enabled/
RUN ln -s /etc/nginx/sites-available/default.conf /etc/nginx/sites-enabled/default.conf

ENV PM2_PUBLIC_KEY igznqy4blq77la4
ENV PM2_SECRET_KEY cb9no43ixpe7xiy

CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]

EXPOSE 80
