import { VERIFICATION_EMAIL_SPAN, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { resend, from } from "./resend.config.js";
export const sendVerificationEmail = async (name, email, verificationToken) => {
    try{
        const verificationTokenDisplay = Array.from(verificationToken).map((digit)=>VERIFICATION_EMAIL_SPAN.replace("{digit}", digit)).join("")
        const response = await resend.emails.send({
            from,
            to: email,
            subject: 'Email verification',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationToken}", verificationToken).replace("{verificationTokenDisplay}",verificationTokenDisplay).replace("{name}",name),
          });
          console.log("Succesfully sent email: "+JSON.stringify(response))
    }catch(error){
        console.log("Error sending verification email: " + error)
    }
}