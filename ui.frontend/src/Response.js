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

export default class Response {

    #message;
    #errorCode;
    #somExpression;
    #qualifiedName;

    constructor(params) {
        this.errors = false;
        this.data = params.data;
        this.#message = [];
        this.#errorCode = [];
        this.#somExpression = []; //deprecated
        this.#qualifiedName = this.#somExpression;
    }

    addMessage(code, msg, som) {
        this.errors = true;
        this.#message.push(msg);
        this.#somExpression.push(som);
        this.#errorCode.push(code);
    };

    getNextMessage () {
        if (this.#errorCode.length === 0) {
            return null;
        }
        let somExpression = this.#somExpression.pop();
        return {
            code : this.#errorCode.pop(),
            somExpression : somExpression, //deprecated
            qualifiedName: somExpression,
            message : this.#message.pop()
        };
    };

}


