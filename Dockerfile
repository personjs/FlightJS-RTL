FROM node:22 as builder

# Build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22

# Install required dependencies
RUN apt-get update && \
    apt-get install -y \
    supervisor \
    nginx \
    build-essential \
    git \
    cmake \
    libusb-1.0-0-dev \
    librtlsdr-dev \
    libsoapysdr-dev \
    libfftw3-dev \
    libboost-all-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN rm -rf /usr/share/nginx/html/* \
&& mkdir -p /app

# Clone dump1090 repository
RUN git clone https://github.com/flightaware/dump1090.git /dump1090

# Build dump1090
RUN cd /dump1090; make; mv /dump1090/dump1090 /usr/local/bin/; rm -rf /dump1090

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/node_modules/ws /app/node_modules/ws
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY tcp-to-websocket.cjs /app/tcp-to-websocket.cjs
COPY supervisord.conf /etc/supervisord.conf

EXPOSE 30003
EXPOSE 8080
EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
