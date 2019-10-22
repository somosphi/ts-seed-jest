import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.raw('select 1 + 1');
}

export async function down(knex: Knex): Promise<any> {
  return knex.raw('select 1 + 1');
}
