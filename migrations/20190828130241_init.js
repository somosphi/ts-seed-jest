/** @param {import('knex')} knex */
function up(knex) {
  return knex.select('1 + 1');
};

/** @param {import('knex')} knex */
function down(knex) {
  return knex.select('1+1');
};

module.exports = { up, down };
