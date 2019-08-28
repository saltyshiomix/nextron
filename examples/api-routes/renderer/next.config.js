module.exports = {
  webpack: (config) => Object.assign(config, {
    target: 'electron-renderer',
  }),
  async exportPathMap () {
    // fetch our list of people, this allow us to dynamically generate the exported pages
    const people = require('./data');
    // or...
    // const response = await fetch('https://your-external-domain.com/api/people');
    // const people = await response.json();

    // tranform the list of people into a map of pages with the pathname `/people/:id`
    const pages = people.reduce(
      (pages, person) =>
        Object.assign({}, pages, {
          [`/people/${person.id}`]: {
            page: '/person',
            query: { id: person.id },
          },
        }),
      {},
    );

    // combine the map of post pages with the home
    return Object.assign({}, pages, {
      '/home': { page: '/home' },
    })
  },
};
