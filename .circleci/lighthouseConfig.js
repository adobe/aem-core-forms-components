const lighthouseConfig = {

    "urls": [
      "http://localhost:4502/aem/start.html"
    ],
    "requiredScores": [
      {
        "performance": 90,
        "accessibility": 90,
        "bestPractices": 90,
        "seo": 90
      },
      {
        "performance": 90,
        "accessibility": 90,
        "bestPractices": 90,
        "seo": 90
      }
    ]

}

module.export = lighthouseConfig
