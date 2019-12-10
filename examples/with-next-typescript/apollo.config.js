module.exports = {
  client: {
    includes: ["./pages/**/*.tsx", "./components/**/*.tsx"],
    service: {
      name: "datocms",
      url: "https://graphql.datocms.com/",
      headers: {
        authorization:
          "Bearer faeb9172e232a75339242faafb9e56de8c8f13b735f7090964"
      }
    }
  }
};
