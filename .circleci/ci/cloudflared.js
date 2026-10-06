/*******************************************************************************
 * Copyright 2025 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

'use strict';

/*
 * Phase 1 of exposing a local/CI AEM instance for the Universal Editor.
 *
 * The AEM author started by qp is reachable only on localhost, but the Universal
 * Editor (running under experience.adobe.com) needs a public HTTPS origin. This
 * module installs cloudflared, opens a quick tunnel (no account/auth required)
 * to the author, scrapes the generated https://<name>.trycloudflare.com URL and
 * persists it so later phases can consume it.
 */

const fs = require('fs');
const ci = new (require('./ci.js'))();

const CLOUDFLARED_BIN = process.env.CLOUDFLARED_BIN || '/home/circleci/cloudflared';
const TUNNEL_LOG = process.env.CLOUDFLARE_LOG || '/home/circleci/cloudflared.log';
const URL_FILE = process.env.CLOUDFLARE_URL_FILE || '/home/circleci/build/CLOUDFLARE_URL.txt';
const TARGET_URL = process.env.TUNNEL_TARGET_URL || 'http://localhost:4502';
const DOWNLOAD_URL = 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64';
const TUNNEL_URL_REGEX = /https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/;

/**
 * Download the static cloudflared binary (linux/amd64) into the workspace.
 * The CI executor image pins the OS/arch, so no root, apt or arch detection is
 * needed. No-op if the binary is already present.
 */
function install() {
    ci.stage('Cloudflared: install');
    if (fs.existsSync(CLOUDFLARED_BIN)) {
        console.log('cloudflared already present at ' + CLOUDFLARED_BIN);
    } else {
        ci.sh(`curl -sfL ${DOWNLOAD_URL} -o ${CLOUDFLARED_BIN}`);
        ci.sh(`chmod +x ${CLOUDFLARED_BIN}`);
    }
    ci.sh(`${CLOUDFLARED_BIN} --version`);
}

/**
 * Start a cloudflared quick tunnel to the given target URL as a background
 * process. Returns the { pid, logFile } handle so callers can later stop it.
 */
function start(targetUrl = TARGET_URL, logFile = TUNNEL_LOG) {
    ci.stage('Cloudflared: start tunnel');
    // start from a clean log so we only match this run's URL
    fs.writeFileSync(logFile, '');
    const handle = ci.shBackground(
        `${CLOUDFLARED_BIN} tunnel --protocol http2 --no-autoupdate --url ${targetUrl}`,
        logFile
    );
    console.log(`cloudflared started (pid ${handle.pid}) -> ${targetUrl}, logging to ${logFile}`);
    return handle;
}

/**
 * Poll the tunnel log until the public trycloudflare.com URL appears.
 */
function fetchUrl(logFile = TUNNEL_LOG, timeoutSec = 60) {
    ci.stage('Cloudflared: fetch public URL');
    const url = ci.waitForLogMatch(logFile, TUNNEL_URL_REGEX, timeoutSec);
    console.log('Cloudflare tunnel URL: ' + url);
    return url;
}

/**
 * Persist the tunnel URL so downstream steps/phases can read it.
 */
function persistUrl(url, file = URL_FILE) {
    ci.writeFile(file, url);
    console.log('Wrote tunnel URL to ' + file);
    return url;
}

/**
 * Stop a tunnel started with start(). Kills the whole detached process group
 * (start() spawns cloudflared as a group leader). Safe to call with a null
 * handle or an already-dead process.
 */
function stop(handle) {
    if (!handle || !handle.pid) {
        return;
    }
    ci.stage('Cloudflared: stop tunnel');
    try {
        process.kill(-handle.pid);
        console.log('Stopped cloudflared tunnel (pid ' + handle.pid + ')');
    } catch (err) {
        console.log('cloudflared tunnel already stopped: ' + err.message);
    }
}

module.exports = { install, start, fetchUrl, persistUrl, stop, TUNNEL_URL_REGEX };

// Allow running standalone: `node .circleci/ci/cloudflared.js`
if (require.main === module) {
    install();
    start();
    persistUrl(fetchUrl());
}
