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

const checkCustomer = () => {
  models.customer
    .findAll({ include: [{ all: true, nested: true }] })
    .then(customers =>
      customers.map(async customer => {
        const { dataValues } = customer;
        const customerStatus = dataValues.active;
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
                subject: "HPE Discover Hack Shack Challenge",
                content: createEmailBody({
                  heading: "Welcome to HPE Discover Hack Shack Challenge!",
                  content: `Hi, ${dataValues.name}!</br>
                    Your request for the Hack Shack <b>${dataValues.challenge}</b> has been received. The HPE Dev team will send you the access details shortly in a separate email.</br>
                    <b>NOTE:</b> Your challenge access will expire ${dataValues.hours} hours after you receive your credentials.</br>
                    Please make sure you save your challenge work before you loose the access to your Jupyter Notebook.</br>
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
          // const challenge = await models.challenge.findOne({
          //   where: { name: dataValues.challenge }
          // });
          console.log("send challenges credentials email");
          return sendEmail({
            recipient: dataValues.email,
            subject: "HPE Discover Hack Shack Challenge credentials",
            content: createEmailBody({
              heading: "Your HPE Discover HackShack Challenge credentials",
              content: `Your HPE Discover Hack Shack Challenge credentials for the Hack Shack <b>${dataValues.challenge}</b> are provided below. Your access to the challenge will end in ${dataValues.hours} hours from now.</br> 
              <b>NOTE:</b> You may have to click Launch Server button once you log in to your Jupyter student account.</br>`,
              buttonLabel: "Start Challenge",
              buttonUrl: dataValues.student.url,
              userName: dataValues.student.username,
              password: dataValues.student.password
              // videoUrl: `${challenge.replayAvailable}` ? challenge.videoUrl : ""
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
          // const challenge = await models.challenge.findOne({
          //   where: { name: dataValues.challenge }
          // });
          return sendEmail({
            recipient: dataValues.email,
            subject:
              "Your HPE Discover Hack Shack Challenge session will end in one hour",
            content: createEmailBody({
              heading:
                "Your HPE Discover Hack Shack Challenge session will end in one hour",
              content: `Please remember to save your work and download the challenge notebook if you anticipate requiring it in the future. 
              Your account will be erased after your session has ended.`,
              buttonLabel: "View Challenge",
              buttonUrl: dataValues.student.url,
              userName: dataValues.student.username,
              password: dataValues.student.password
              // videoUrl: `${challenge.replayAvailable}` ? challenge.videoUrl : ""
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
            subject: "Your HPE Discover Hack Shack Challenge session has ended",
            content: createEmailBody({
              heading:
                "Thanks for participating in the HPE Discover Hack Shack Challenge!",
              content: `We hope you enjoyed <b>${dataValues.challenge}<b>.`,
              buttonLabel: "Click here to provide feedback",
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
