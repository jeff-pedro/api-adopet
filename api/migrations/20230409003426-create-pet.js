'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      birthday: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      size: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      personality: {
        allowNull: false,
        type: Sequelize.STRING
      },
      species: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      profilePictureUrl: {
        allowNull: false,
        type: Sequelize.STRING
      },
      shelter_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Shelters', key: 'id' }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pets')
  }
}