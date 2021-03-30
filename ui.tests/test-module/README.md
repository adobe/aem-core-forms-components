Sample Tests Project
====================

Sample UI tests using [Cypress](https://www.cypress.io//) framework


* `package.json` Project definition: dependencies, npm scripts, ...
* `cypress.json` Cypress configuration: reporters, browser capabilities, ...
* `specs` Tests


* [Node.js LTS](https://nodejs.org/en/)


```
npm install
```



* AEM instance (example: `http://localhost:4502`)

  > For local testing we suggest to use the [AEM as a Cloud Service SDK](https://docs.adobe.com/content/help/en/experience-manager-cloud-service/implementing/developing/aem-as-a-cloud-service-sdk.html)

* Chrome or Firefox browser installed locally in default location


* Chrome
  ```
  mvn verify -Pcypress
  ```

After execution, reports and logs are available in `reports` folder
