import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('user', (t) => {
    t.uuid('id').unique().primary().notNullable();
    t.string('name');
    t.string('username');
    t.string('emailAddress');
    t.enum('source', ['JSON_PLACEHOLDER']).notNullable();

    t.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    t.timestamp('updatedAt').notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'));
    t.timestamp('deletedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('user');
}
