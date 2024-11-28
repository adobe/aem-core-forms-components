/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
package com.adobe.cq.forms.core.components.it.service;

import com.day.cq.mailer.MailService;
import com.day.cq.mailer.MailingException;
import org.apache.commons.mail.Email;
import org.apache.commons.mail.EmailException;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class serves as a mock implementation of {@link MailService} for testing purposes.
 * It uses a {@link DataManager} to store and retrieve email objects based on their subject.
 */
@Component(
        service = MailService.class,
        immediate = true
)
public class MockMailServiceImpl implements MailService {

    @Reference
    private DataManager dataManager;

    private static final Logger logger = LoggerFactory.getLogger(MockMailServiceImpl.class);

    /**
     * Stores the email object in the data manager.
     *
     * @param email an instance of {@link Email}
     * @throws EmailException if the email cannot be stored
     */
    @Override
    public void sendEmail(Email email) throws EmailException {
        if (dataManager == null) {
            logger.error("DataManager is not available.");
            throw new EmailException("DataManager is not available.");
        }
        if (email != null) {
            logger.info("Storing email with subject: {}", email.getSubject());
            dataManager.put(email.getSubject(), email);
        }
    }

    /**
     * Determines if this service can handle the specified email class.
     *
     * @param aClass the email class to check
     * @return true if the service can handle the specified class, false otherwise
     */
    @Override
    public boolean handles(Class<? extends Email> aClass) {
        // Example: return aClass.equals(MySpecificEmail.class);
        return false; // Modify based on actual handling logic
    }

    /**
     * Stores the email object in the data manager and handles exceptions.
     *
     * @param email an instance of {@link Email}
     * @throws MailingException if the email cannot be sent
     */
    @Override
    public void send(Email email) throws MailingException {
        try {
            sendEmail(email);
        } catch (EmailException e) {
            logger.error("Failed to send email", e);
            throw new MailingException(e);
        }
    }

    /**
     * Fetches the mail for the given subject from the data manager.
     *
     * @param subject of the email.
     * @return instance of {@link Email} for the given subject, or null if not found.
     */
    public Email getEmail(String subject) {
        if (dataManager == null) {
            logger.error("DataManager is not available.");
            return null;
        }
        logger.info("Retrieving email with subject: {}", subject);
        return (Email) dataManager.get(subject);
    }
}