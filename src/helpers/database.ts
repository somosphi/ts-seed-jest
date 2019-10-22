import knex from 'knex';

import knexfile from '../../knexfile';

export default function database(connector = 'mysql') {
  switch (connector) {
    case 'mysql':
      return knex(knexfile);
    default:
      return null;
  }
}
