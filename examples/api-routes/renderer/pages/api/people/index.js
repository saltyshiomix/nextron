const people = require('../../../data');

export default (req, res) => {
  res.status(200).json(people);
};
