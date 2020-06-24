require("dotenv").config();
var net = require("net");

const sg = require("sendgrid")(process.env.SENDGRID_API_KEY);
const fromAddress = process.env.FROM_EMAIL_ADDRESS;

const HOST = "15.196.54.22";
const PORT = 10125;

const sendJupyterEmail = ({ recipient, subject, content }) => {
  // new Promise((resolve, reject) => {
  // add plain version for mobile device previews.
  const client = new net.Socket();
  const msg = `MAIL FROM: ${fromAddress} \nRCPT TO: ${recipient} \nDATA\nSubject: ${subject} \n${content}\n.\n`;

  client.connect(PORT, HOST, function() {
    console.log("CONNECTED TO: " + HOST + ":" + PORT);
    console.log("message", msg);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
    client.write(msg);
  });

  // Add a 'data' event handler for the client socket
  // data is what the server sent to this socket
  client.on("data", function(data) {
    console.log("DATA: " + data);
    // if (error) {
    //   console.log("Response", JSON.stringify(data, null, 2));
    //   console.log(
    //     "Email Error response received",
    //     JSON.stringify(error, null, 2)
    //   );
    // }
    // Close the client socket completely
    client.destroy();
  });

  // Add a 'close' event handler for the client socket
  client.on("close", function() {
    console.log("Connection closed");
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
          name: "HPE Workshops On Demand",
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
