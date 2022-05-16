FROM loadimpact/k6
USER root
RUN apk add --update nodejs npm git openssh bash && npm install --global yarn
COPY . .
RUN git config --global --add url.'git@github.com:'.insteadOf 'https://github.com/' &&\
    ssh-keygen -t rsa -f /root/.ssh/id_rsa -q -P "" && \
    ssh-keyscan github.com >> ~/.ssh/known_hosts &&\
    chmod 400 github-key &&\
    ssh-agent bash -c "ssh-add github-key; yarn install" &&\
    yarn webpack &&\
    mkdir -p results 
