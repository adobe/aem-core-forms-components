#!/usr/bin/env bash
#
# Copyright 2026 Adobe. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -euo pipefail

version=121.0.6167.139
repository="https://storage.googleapis.com/chrome-for-testing-public/${version}/linux64"
install_dir="${HOME}/.local/share/chrome-for-testing/${version}"
download_dir="$(mktemp -d)"
trap 'rm -f -- "${download_dir}/chrome.zip" "${download_dir}/chromedriver.zip"; rmdir -- "$download_dir"' EXIT

curl --fail --silent --show-error --location --retry 3 \
    "${repository}/chrome-linux64.zip" --output "${download_dir}/chrome.zip"
curl --fail --silent --show-error --location --retry 3 \
    "${repository}/chromedriver-linux64.zip" --output "${download_dir}/chromedriver.zip"
printf '%s  %s\n' \
    8c7a0a3ec7b9cda06e6be55b6bf2866cc2b405ba333fd03527739c261ce50766 "${download_dir}/chrome.zip" \
    49b14c73cf3cb4365dbee82a6f3dc48d609fb667a568188c4de46b4157a50d1c "${download_dir}/chromedriver.zip" \
    | sha256sum --check

curl --fail --silent --show-error --location --retry 3 \
    https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo apt-get update
sudo apt-get install --yes --no-install-recommends \
    fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 \
    libgbm1 libgtk-3-0 libnss3 libxcomposite1 libxdamage1 libxfixes3 \
    libxkbcommon0 libxrandr2 libxss1

mkdir -p "$install_dir"
unzip -oq "${download_dir}/chrome.zip" -d "$install_dir"
unzip -oq "${download_dir}/chromedriver.zip" -d "$install_dir"
for binary in google-chrome google-chrome-stable chrome; do
    sudo ln -sfn "${install_dir}/chrome-linux64/chrome" "/usr/local/bin/${binary}"
done
sudo ln -sfn "${install_dir}/chromedriver-linux64/chromedriver" /usr/local/bin/chromedriver
printf 'export CHROME_PATH=%q\n' "${install_dir}/chrome-linux64/chrome" >> "$BASH_ENV"

test "$(google-chrome --product-version)" = "$version"
chromedriver --version | grep -F "ChromeDriver ${version} "
