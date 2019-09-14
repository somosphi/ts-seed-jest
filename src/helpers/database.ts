import knex from 'knex';

const knexfile = require('../../knexfile');

export default function getDb(connector = 'mysql') {
  switch (connector) {
    case 'mysql':
      return knex(knexfile);
    default:
      return null;
  }
}
