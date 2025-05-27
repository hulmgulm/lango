# Lango - A dead simple front-end for LanguageTool text analysis

A modern frontend interface for the LanguageTool API, built with React, TypeScript, and Material UI.

![Main page screenshot](/screenshots/screenshot1.png)

## Features

- Text grammar and style checking using LanguageTool API
- Real-time text analysis
- Fix suggestions with apply on click featuer
- Higlight potential issues in text
- Modern and responsive UI


## Getting Started

### Use with custom backend

Lango was created especially to use with custom selfhosted LanguageTool backend.  
I prefer to use [meyayl/docker-languagetool](https://github.com/meyayl/docker-languagetool) because it better supported and more configurable:

```
services:

  languagetool:
    image: meyay/languagetool:latest
    container_name: languagetool
    restart: unless-stopped
    read_only: true
    tmpfs:
      - /tmp:exec
    cap_drop:
      - ALL
    cap_add:
      - CAP_CHOWN
      - CAP_DAC_OVERRIDE
      - CAP_SETUID
      - CAP_SETGID
    security_opt:
      - no-new-privileges
    ports:
      - 8081:8081
    environment:
      download_ngrams_for_langs: en
      MAP_UID: 783
      MAP_GID: 783
    volumes:
      - ./ngrams:/ngrams
      - ./fasttext:/fasttext

  lango:
    image: kiriharu/lango:latest
    environment:
      VITE_LANGUAGETOOL_API_URL: http://server_ip.net:8081/v2
    ports:
      - "3000:3000"
```

After that all API requests will be forwarded to http://server_ip.net:8001 that points to selfhosted backend.  

### Use with official backend

You can use Lango with official LanguageTool backend. For this you can use this docker-compose.yml:

```
version: '3.8'

services:
  frontend:
    image: kiriharu/lango:latest
    environment:
      VITE_LANGUAGETOOL_API_URL: https://api.languagetoolplus.com/v2
    ports:
      - "3000:3000"
```

## Tech Stack

- React
- TypeScript
- Vite
- Material UI
- Axios