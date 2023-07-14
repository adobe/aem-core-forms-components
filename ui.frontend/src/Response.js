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

/**
 * @module FormView
 */

/**
 * Represents a response object with message and error information.
 */
class Response {

    /**
     * The array of messages.
     * @type {string[]}
     */
    #message;
    /**
     * The array of messages.
     * @type {string[]}
     */
    #errorCode;
    /**
     * The array of SOM expressions. (deprecated)
     * @type {any[]}
     */
    #somExpression;
    /**
     * The array of qualified names.
     * @type {any[]}
     */
    #qualifiedName;

    /**
     * Constructs a new Response object.
     * @param {Object} params - The parameters for constructing the Response.
     * @param {any} params.data - The data associated with the Response.
     */
    constructor(params) {
        this.errors = false;
        this.data = params.data;
        this.#message = [];
        this.#errorCode = [];
        this.#somExpression = []; //deprecated
        this.#qualifiedName = this.#somExpression;
    }

    /**
     * Adds a message to the response.
     * @param {number} code - The error code.
     * @param {string} msg - The message.
     * @param {any} som - The SOM expression. (deprecated)
     */
    addMessage(code, msg, som) {
        this.errors = true;
        this.#message.push(msg);
        this.#somExpression.push(som);
        this.#errorCode.push(code);
    };

    /**
     * Retrieves the next message from the response.
     * @returns {Object|null} An object containing the error code, SOM expression (deprecated),
     * qualified name, and message; or null if there are no more messages.
     */
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

export default Response;


