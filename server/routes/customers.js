import express from "express";
import models from "../models";
const Sequelize = require("sequelize");
const op = Sequelize.Op;
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// end customer challenge trail in process.env.CHALLENGE_DURATION hours
const getDates = () => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setHours(
    parseFloat(endDate.getHours()) + parseFloat(process.env.CHALLENGE_DURATION)
  );
  return { startDate, endDate };
};

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management
 */

/**
 * @swagger
 * path:
 *  /customers:
 *    get:
 *      summary: Returns a list of  customers.
 *      tags: [Customers]
 *      responses:
 *        "200":
 *          description: A JSON array of customer objects
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Customer'
 */
// Get customers
router.get("/customers", (req, res) => {
  models.customer
    .findAll({
      raw: true,
      order: [["id", "ASC"]]
    })
    .then(entries => res.send(entries));
});

/**
 * @swagger
 * path:
 *  /customers/{customerId}:
 *    get:
 *      summary: Get a customer by ID.
 *      tags: [Customers]
 *      parameters:
 *        - in: path
 *          name: customerId
 *          schema:
 *            type: integer
 *          required: true
 *          description: Id of the  customer
 *      responses:
 *        "200":
 *          description: An customer object
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Customer'
 */
// Get customer by ID
router.get("/customers/:id", (req, res) => {
  models.customer
    .findOne({
      where: { id: req.params.id }
    })
    .then(entry => {
      if (entry) res.status(200).send(entry);
      else res.status(400).send("Customer Not Found");
    })
    .catch(error => {
      res.status(400).send({ error });
    });
});

// Create a Customer
/**
 * @swagger
 * path:
 *  /customer:
 *    post:
 *      summary: Create a new customer
 *      tags: [Customers]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Customer'
 *      responses:
 *        "200":
 *          description: A customer schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Customer'
 */
// Create customer
router.post("/customer", async (req, res) => {
  try {
    // check whether customer is already registered for another challenge
    // const count = await models.customer.count({
    //   where: {
    //     email: req.body.email
    //   }
    // });
    const exisitingCustomer = await models.customer.findAll({
      where: { email: req.body.email }
    });
    let counter = 0;
    exisitingCustomer.forEach(customer => {
      const { dataValues } = customer;
      const customerStatus = dataValues.active;
      const lastemailsent = dataValues.lastEmailSent;
      if (customerStatus || lastemailsent === null) {
        counter = counter + 1;
      }
    });
    if (counter >= 1) {
      return res
        .status(202)
        .send(
          "You can only register for one challenge at a time, please finish the current challenge and try again!"
        );
    }
    // fetch the customer requested challenge from challenges table
    const challenge = await models.challenge.findOne({
      where: { name: req.body.challenge }
    });

    let challengeName = req.body.challenge;
    let studentRange = [0, 0];

    // Matches for challenge name and assign student range:
    switch (challengeName) {
      case "The Container Challenge":
        studentRange = [41, 60];
        break;
      case "The Redfish Challenge":
        studentRange = [61, 99];
        break;
      case "The HPE OneView Challenge":
        studentRange = [1, 40];
        break;
      case "The Grommet Challenge":
        studentRange = [101, 150];
        break;
      default:
        break;
    }

    console.log("student range", studentRange);

    // fetch the unassigned student account to assign to the requested customer
    const student = await models.student.findOne({
      where: {
        assigned: {
          [op.eq]: false
        },
        id: {
          [op.between]: studentRange
        }
      }
    });
    // return error if student account is not available else assign it to the customer
    if (student === null) {
      console.log("Student Account Not Available!");
      return res.status(202).send("Registration full, try again tomorrow");
    } else {
      console.log("customer req", req.body);
      const dataValues = await models.customer.create({
        ...req.body,
        hours: 4,
        ...getDates(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      if (dataValues) {
        await student.update({
          assigned: true
        });
        await dataValues.update({
          studentId: student.id
        });
        await challenge.decrement("capacity");
        //await dataValues.save();
        return res.status(200).send({});
      }
    }
  } catch (error) {
    console.log("error in catch!", error);
    return res.status(400).send({ error });
  }
});

/**
 * @swagger
 * path:
 *  /customer/{customerId}:
 *    put:
 *      summary: Update a customer by ID.
 *      tags: [Customers]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Customer'
 *      parameters:
 *        - in: path
 *          name: customerId
 *          schema:
 *            type: integer
 *          required: true
 *          description: Id of the customer
 *      responses:
 *        "200":
 *          description: A Customer object
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Customer'
 */
// Edit customer
router.put("/customer/:id", (req, res) => {
  models.customer
    .findOne({
      where: { id: req.params.id }
    })
    .then(entry => {
      console.log("req.body", req.body);
      entry
        .update({ ...req.body })
        .then(({ dataValues }) => res.status(200).send(dataValues));
    })
    .catch(error => {
      res.status(400).send({ error });
    });
});

/**
 * @swagger
 * path:
 *  /customer/{customerId}:
 *    delete:
 *      summary: Delete a  customer by ID.
 *      tags: [Customers]
 *      parameters:
 *        - in: path
 *          name: customerId
 *          schema:
 *            type: integer
 *          required: true
 *          description: Id of the customer
 *      responses:
 *        "200":
 *          description: A Customer object
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Customer'
 */
// Delete customer
router.delete("/customer/:id", (req, res) => {
  models.customer
    .findOne({
      where: { id: req.params.id }
    })
    .then(entry => {
      entry.destroy().then(() => res.status(200).send({}));
    })
    .catch(error => {
      res.status(400).send({ error });
    });
});

export default router;
