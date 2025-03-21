import { Vonage } from "@vonage/server-sdk";
import { Auth } from "@vonage/auth";

const auth = new Auth({
  apiKey: "72142600",
  apiSecret: "ulfGlS0Pl4K0b8hY",
});

const vonage = new Vonage(auth);

async function sendSMS(to:string, from:string, text:string) {
  await vonage.sms
    .send({ to, from, text })
    .then((resp) => {
      console.log("Message sent successfully");
      console.log(resp);
    })
    .catch((err) => {
      console.log("There was an error sending the messages.");
      console.error(err);
    });
}

export default sendSMS;
