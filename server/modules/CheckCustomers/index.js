import cron from "cron";
import models from "../../models";
import createEmailBody from "../Email/createEmailBody";
import { sendEmail, sendJupyterEmail } from "../Email";
import dotenv from "dotenv";

dotenv.config();

const { CronJob } = cron;

const jupyterEmail = process.env.JUPYTER_EMAIL;
const feedback_url = process.env.FEEDBACK_URL;
const getHoursLeft = ends => {
  const oneHour = 1 * 60 * 60 * 1000;
  const endsDate = new Date(ends);
  const today = new Date();
  return Math.round((endsDate.getTime() - today.getTime()) / oneHour);
};

const getDates = () => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setHours(
    parseFloat(endDate.getHours()) + parseFloat(process.env.CHALLENGE_DURATION)
  );
  return { startDate, endDate };
};

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const checkCustomer = () => {
  models.customer
    .findAll({ include: [{ all: true, nested: true }] })
    .then(customers =>
      customers.map(async customer => {
        // eslint-disable-line array-callback-return
        const { dataValues } = customer;
        const customerStatus = dataValues.active;
        //const updated = dataValues.upupdatedAt.getHours();
        const hoursLeft = getHoursLeft(dataValues.endDate);

        // Send welcome email.
        if (!dataValues.lastEmailSent && dataValues.studentId != null) {
          console.log("send jupyter email");
          var mailContent = `${dataValues.notebook}`;
          return sendJupyterEmail({
            recipient: jupyterEmail,
            subject: `CREATE ${dataValues.studentId} ${dataValues.id} ${dataValues.email}`,
            content: mailContent
          })
            .then(() => {
              console.log("send welcome email");
              sendEmail({
                recipient: dataValues.email,
                subject: "Welcome to HPE Discover HackShack Challenge",
                content: createEmailBody({
                  heading: "Welcome to HPE Discover HackShack Challenge!",
                  content: `
  Hi ${dataValues.name},</br>
  Your request for the <b>${dataValues.challenge}</b> challenge has been received. We will send you the access details shortly in a seperate email.</br>
  <b>NOTE:</b> Your challenge access will be expired in ${dataValues.hours} hours after you receive your credentials.</br>
  Please save your challenge work before your loose the access</br>
  </br></br>
  `
                })
              });
            })
            .then(() => {
              customer.update({
                lastEmailSent: "welcome"
              });
            })
            .catch(error => {
              console.log("Promise Rejected", error);
            });
        }

        // Send challenge credentilas as soon as there are ready.
        if (customerStatus && dataValues.lastEmailSent === "welcome") {
          // fetch the customer requested challenge from challenges table
          const challenge = await models.challenge.findOne({
            where: { name: dataValues.challenge }
          });
          console.log("send challenges credentials email");
          return sendEmail({
            recipient: dataValues.email,
            subject: "Your HPE Discover HackShack Challenge credentials",
            content: createEmailBody({
              heading: "Your HPE Discover HackShack Challenge credentials",
              content: `Your <b>${dataValues.challenge}</b> credentials along with the video link are provided below to follow along the challenge. Your access to the challenge will end in ${dataValues.hours} hours from now.`,
              buttonLabel: "Start Challenge",
              buttonUrl: dataValues.student.url,
              userName: dataValues.student.username,
              password: dataValues.student.password,
              videoUrl: `${challenge.replayAvailable}` ? challenge.videoUrl : ""
            })
          })
            .then(() => {
              customer.update({
                lastEmailSent: "credentials",
                ...getDates()
              });
            })
            .catch(error => {
              console.log("Promise Rejected", error);
            });
        }

        // Send expiring soon email.
        if (hoursLeft <= 1 && dataValues.lastEmailSent === "credentials") {
          // fetch the customer requested challenge from challenges table
          const challenge = await models.challenge.findOne({
            where: { name: dataValues.challenge }
          });
          return sendEmail({
            recipient: dataValues.email,
            subject:
              "Your HPE Discover HackShack Challenge session will end in an hour",
            content: createEmailBody({
              heading:
                "Your HPE Discover HackShack Challenge session will end in an hour",
              content: `Your challenge session will end in an hour. Please save your work and download the challenge notebook if required in future. Your account will be erased after your session is ended`,
              buttonLabel: "View Challenge",
              buttonUrl: dataValues.student.url,
              userName: dataValues.student.username,
              password: dataValues.student.password,
              videoUrl: `${challenge.replayAvailable}` ? challenge.videoUrl : ""
            })
          })
            .then(() => {
              customer.update({
                lastEmailSent: "expiring"
              });
            })
            .catch(error => {
              console.log("Promise Rejected", error);
            });
        }

        // Send expired email.
        if (hoursLeft <= 0 && dataValues.lastEmailSent === "expiring") {
          console.log("send expired email");
          return sendEmail({
            recipient: dataValues.email,
            subject: "Your HPE Discover HackShack Challenge session has ended",
            content: createEmailBody({
              heading: "Thanks for trying HPE Discover HackShack Challenge!",
              content: `We hope you enjoyed <b>${dataValues.challenge}<b>.`,
              buttonLabel: "Click here to Provide the Feedback",
              buttonUrl: feedback_url
            })
          }).then(async () => {
            customer
              .update({
                lastEmailSent: "expired",
                active: false
              })
              .then(() => {
                sendJupyterEmail({
                  recipient: jupyterEmail,
                  subject: `CLEANUP ${dataValues.studentId} ${dataValues.id}`
                });
              })
              .catch(error => {
                console.log("Promise Rejected", error);
              });
            // fetch the customer requested challenge from challenges table
            const challenge = await models.challenge.findOne({
              where: { name: dataValues.challenge }
            });
            await challenge.increment("capacity");
          });
        }
        return;
      })
    );
};

const runCronJobs = () => {
  const jobToCheckCustomers = new CronJob({
    // cronTime: '00 00 * * * *', // every hour
    cronTime: "*/20 * * * * *", // every 20 seconds
    // onTick: checkCustomer(),
    onTick: () => checkCustomer(),
    runOnInit: true
  });

  jobToCheckCustomers.start();
};

export default runCronJobs;
