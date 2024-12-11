/*******************************************************************************
 * Copyright 2024 Adobe
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

if (typeof window.FormFillHelper === "undefined") {
  window.FormFillHelper = class FormFillHelper {
    static bemBlock = ".cmp-adaptiveform-container__form-fill-helper";

    constructor(container) {
      this.container = container;
      // this.form = container.getModel().getRuleNode();
      // this.formFields = this.form.querySelectorAll('input, select, textarea');
      // this.formFields.forEach(field => {
      //   field.addEventListener('change', this.handleFieldChange.bind(this));
      // });
    }

    getContainerElement() {
      return document.querySelector(FormFillHelper.bemBlock);
    }

    init() {
      this.initializeChat();
      this.attachEventListeners();
    }

    attachEventListeners(){
      const that = this;
      const element = document.querySelector(".cmp-adaptiveform-container");
      if (element) {
      

        let lastInteractionTime = Date.now();

        let resetInteractionTimer = () => {
          lastInteractionTime = Date.now();
        };
        
        element.addEventListener("mousemove", resetInteractionTimer);
        element.addEventListener("keypress", resetInteractionTimer);
        element.addEventListener("click", resetInteractionTimer);

        let checkInactivity = () => {
          let currentTime = Date.now();
          if (currentTime - lastInteractionTime > 2000) { // 2 seconds of inactivity
            that.callGenAi();
          }
        };
        setInterval(checkInactivity, 2000);
      }
    }

    callGenAi(){
      console.log("Calling GenAi...");
    }

    initializeChat(){
      // Create chat container
      const chatContainer = document.createElement("div");
      chatContainer.className = "chat-container";

      // Create message list
      const messageList = document.createElement("div");
      messageList.className = "message-list";
      chatContainer.appendChild(messageList);

      // Create input field
      const inputField = document.createElement("input");
      inputField.type = "text";
      inputField.className = "chat-input";
      inputField.placeholder = "Type your message...";
      chatContainer.appendChild(inputField);

      // Create send button
      const sendButton = document.createElement("button");
      sendButton.className = "send-button";
      sendButton.type = "button";
      sendButton.innerText = "Send";
      chatContainer.appendChild(sendButton);

      // Append chat container to the main container
      const element = this.getContainerElement();
      element.appendChild(chatContainer);

      // Add event listener to send button
      sendButton.addEventListener("click", () => {
        const message = inputField.value.trim();
        if (message) {
          this.addMessage(message, messageList);
          inputField.value = "";
        }
      });
    }

    addMessage(message, messageList) {
      const messageItem = document.createElement("div");
      messageItem.className = "message-item";
      messageItem.innerText = message;
      messageList.appendChild(messageItem);
    }
  };
}
