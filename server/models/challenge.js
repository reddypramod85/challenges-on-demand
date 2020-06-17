"use strict";
/**
 * @swagger
 *  components:
 *    schemas:
 *      Challenge:
 *        type: object
 *        required:
 *          - name
 *          - notebook
 *          - capacity
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *          notebook:
 *            type: string
 *          description:
 *            type: string
 *          capacity:
 *            type: integer
 *          preRequisite:
 *            type: string
 *          replayAvailable:
 *            type: boolean
 *          videoUrl:
 *            type: string
 *          active:
 *            type: boolean
 *          createdAt:
 *            type: string
 *            format: date-time
 *          updatedAt:
 *            type: string
 *            format: date-time
 *        example:
 *           name: Grommet
 *           capacity: 20
 *           notebook: CHLG-Grommet
 */
module.exports = (sequelize, DataTypes) => {
  const Challenge = sequelize.define(
    "challenge",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING,
      notebook: DataTypes.STRING,
      description: DataTypes.TEXT,
      capacity: DataTypes.INTEGER,
      preRequisite: DataTypes.TEXT,
      replayAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      videoUrl: DataTypes.TEXT,
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {}
  );
  Challenge.associate = function(models) {
    // associations can be defined here
  };
  return Challenge;
};
