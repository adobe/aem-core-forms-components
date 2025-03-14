/*******************************************************************************
 * Copyright 2022 Adobe
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

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.cjs');

module.exports = (env = {}) => {
    const sourcemapPath = env.xfa ? 
        '/libs/core/fd/clientlibs/core-forms-components-runtime-xfa/resources/[name].js.map' :
        '/libs/core/fd/clientlibs/core-forms-components-runtime/resources/[name].js.map';
    
    return merge(common(env), {
        mode: 'development',
        devtool: false,
        plugins: [new webpack.SourceMapDevToolPlugin({
            append: `\n//# sourceMappingURL=${sourcemapPath}`,
            filename: env.xfa ? '[name]-xfa.js.map' : '[name].js.map'
        })]
    });
};
