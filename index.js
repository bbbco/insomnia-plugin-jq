const jq = require('node-jq');

module.exports.templateTags = [
  {
    displayName: 'JQ',
    name: 'jq',
    description: 'pull data from JSON strings with JQ',
    args: [
      {
        displayName: 'JSON string',
        type: 'string',
      },
      {
        displayName: 'JQ Filter',
        encoding: 'base64', // So it doesn't cause syntax errors
        type: 'string',
      },
      {
        displayName: 'Output as a raw string (otherwise retain JSON object)',
        type: 'boolean',
      },
    ],
    run(context, jsonString, filter, outputAsRaw) {
      let body;
      try {
        body = JSON.parse(jsonString);
      } catch (err) {
        throw new Error(`Invalid JSON: ${err.message}`);
      }

      let results;
      let jqOptions = { 
        input: 'json',
        raw: outputAsRaw,
      };
      console.log(body, filter, outputAsRaw);
      try {
        results = jq.run(filter, body, jqOptions).then((result) => { return result });
      } catch (err) {
        throw new Error(`Invalid JQ query: ${filter}`);
      }

      if (results.length === 0) {
        throw new Error(`JQ query returned no results: ${filter}`);
      }

      return results;
    },
  },
];
