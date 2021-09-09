/*******************************************************************************
 *
 *    Copyright 2020 Adobe. All rights reserved.
 *    This file is licensed to you under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License. You may obtain a copy
 *    of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software distributed under
 *    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 *    OF ANY KIND, either express or implied. See the License for the specific language
 *    governing permissions and limitations under the License.
 *
 ******************************************************************************/

package com.adobe.cq.forms.core.components.internal;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Utils {

    private static final Logger LOGGER = LoggerFactory.getLogger(Utils.class);

    /**
     * Name of the separator character used between prefix and hash when generating an ID, e.g. image-5c7e0ef90d
     */
    public static final String ID_SEPARATOR = "-";

    private Utils() {}

    /**
     * Returns an ID based on the prefix, the ID_SEPARATOR and a hash of the path, e.g. image-5c7e0ef90d
     *
     * @param prefix
     *            the prefix for the ID
     * @param path
     *            the resource path
     * @return the generated ID
     */
    public static String generateId(String prefix, String path) {
        return StringUtils.join(prefix, ID_SEPARATOR, StringUtils.substring(DigestUtils.sha256Hex(path), 0, 10));
    }
}
