require("dotenv").config();
var net = require("net");

const sg = require("sendgrid")(process.env.SENDGRID_API_KEY);
const fromAddress = process.env.FROM_EMAIL_ADDRESS;

const HOST = process.env.JUPYTER_HOST;
const PORT = process.env.JUPYTER_PORT;

const sendJupyterEmail = ({ recipient, subject, content }) => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    client.setTimeout(2000);
    const msg = `MAIL FROM: ${fromAddress} \nRCPT TO: ${recipient} \nDATA\nSubject: ${subject} \n${content}\n.\n`;
    client
      .connect(PORT, HOST, function() {
        console.log("CONNECTED TO: " + HOST + ":" + PORT);
        console.log("message", msg);
        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
        client.write(msg);
      })
      .on("error", function(error) {
        console.log("ERROR" + error.message);
        client.destroy();
        return reject(error);
      })
      .on("data", function(data) {
        console.log("DATA: " + data);
        // Close the client socket completely
        client.destroy();
        return resolve(recipient);
      })
      .on("close", function() {
        console.log("Connection closed");
        return resolve(recipient);
      });
  });
};

const sendEmail = ({ recipient, subject, content }) =>
  new Promise((resolve, reject) => {
    // add plain version for mobile device previews.
    const contentPlainText = content.replace(/<(?:.|\n)*?>/gm, "");
    const request = sg.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      host: "api.sendgrid.com",
      body: {
        personalizations: [
          {
            to: [
              {
                email: recipient
              }
            ],
            subject
          }
        ],
        from: {
          name: "HPE HackShack Challenge",
          email: fromAddress
        },
        content: [
          {
            type: "text/plain",
            value: contentPlainText
          },
          {
            type: "text/html",
            value: content
          }
        ]
      }
    });

    sg.API(request, (error, response) => {
      if (error) {
        console.log("Response", JSON.stringify(response, null, 2));
        console.log(
          "Email Error response received",
          JSON.stringify(error, null, 2)
        );
        return reject(error);
      }
      return resolve(recipient);
    });
  });

export { sendEmail, sendJupyterEmail };
