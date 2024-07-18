/*
 *  Copyright 2022 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

describe('Form with Adaptive form text', () => {
  const pagePath = "content/forms/af/core-components-it/samples/image/basic.html";
  let formContainer = null;

  /**
   * initialization of form container before every test
   * */
  beforeEach(() => {
    cy.previewForm(pagePath).then(p => {
      formContainer = p;
    })
  });


  it('image should use default servlet to fetch 1.json', () => {
    cy.fixture('image/image.1.json').then(expectedJson => {
      cy.request('GET', '/content/forms/af/core-components-it/samples/image/image-api-test/jcr:content/guideContainer/image.1.json')
        .then(response => {
          expect(response.status).to.eq(200);
          const expectedFields = Object.keys(expectedJson);
          const actualFields = Object.keys(response.body);
          expectedFields.forEach((key) => {
            expect(actualFields).to.include(key);
          });
        })
    })
  })

  it('image should use Sling Model Exporter  to fetch model.json', () => {
    cy.fixture('image/image.model.json').then(expectedJson => {
      cy.request('GET', '/content/forms/af/core-components-it/samples/image/image-api-test/jcr:content/guideContainer/image.model.json')
      .then(response => {
        expect(response.status).to.eq(200);
        const expectedFields = Object.keys(expectedJson);
        const actualFields = Object.keys(response.body);
        expectedFields.forEach((key) => {
          expect(actualFields).to.include(key);
        });
      })
    })
  })

  it('image should use StaticImageGETServlet  to fetch image files', () => {
    cy.request({
      url: '/content/forms/af/core-components-it/samples/image/image-api-test/jcr:content/guideContainer/image.model.jpg',
      encoding: 'binary'
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.include('image/jpeg');
    })
  })

})
