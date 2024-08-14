'use strict';
let md5 = require('md5')
const now = new Date()

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('admins', [
      {
      name: "admin",
      email: "admin@smktelkom-mlg.sch.id",
      password: md5("admin123"),
      createdAt: now,
      updatedAt: now
    }
  ])
   
  },

  async down (queryInterface, Sequelize) {
   
  }
};
