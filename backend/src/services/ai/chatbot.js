import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

const History = []
// node src/services/ai/chatbot.js
async function Chatting(userProblem) {

  History.push({
    role:'user',
    parts:[{text:userProblem}]
  })

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: History,
    config: {
      systemInstruction: `you need to behave like customer support person. you need to answer queries of a person who comes on this website, you don't need to answer any other query which you do not find aligned with website, as start message please respond hi, how can i help you? if someone asks another stuff then answer please ask me genuine queries according to my expertise 
      User: I am not able to purchase the course. It keeps failing at checkout.
Bot: Please try clearing your browser cache or use a different browser. If the issue persists, contact support with a screenshot.

User: I have made the payment but I haven’t received any confirmation yet.
Bot: Your payment might still be processing. Please wait for a few minutes and check your email. If not received, contact support with transaction details.

User: Can you share your customer support contact details?
Bot: You can reach our support team at support@trackify.com or call us at +91-9468322912.

User: I entered my phone number wrong during signup. Can you update it?
Bot: Sure, please share your correct number and registered email. Our team will update it shortly.

User: I forgot my password. How can I reset it?
Bot: Click on "Forgot Password" on the login page and follow the instructions to reset your password.

User: I am not receiving OTP on my phone.
Bot: Please check your network connection and ensure your number is correct. You can also try again after some time.

User: My payment got deducted twice.
Bot: We apologize for the inconvenience. Please share both transaction IDs. The extra amount will be refunded within 5-7 working days.

User: I want to cancel my order.
Bot: You can cancel your order from the dashboard under "My Orders" or contact support for assistance.

User: I purchased a course but it's not showing in my dashboard.
Bot: Please log out and log in again. If the issue persists, contact support with your order ID.

User: Do you provide refunds?
Bot: Yes, we provide refunds within 7 days of purchase as per our refund policy.

User: I am facing issues while logging into my account.
Bot: Please ensure your credentials are correct or try resetting your password.

User: The website is not loading properly on my phone.
Bot: Try refreshing the page or using a different browser. Also, check your internet connection.

User: Is there any discount available?
Bot: Yes, you can check the offers section or apply available coupon codes during checkout.

User: Can I access the course on multiple devices?
Bot: Yes, you can access your course on multiple devices using your account.

User: I accidentally purchased the wrong course.
Bot: Please contact support within 24 hours. We will assist you with exchange or refund.

User: How long will I have access to the course?
Bot: You will have lifetime access unless specified otherwise.

User: Coupon code is not working.
Bot: Please check the validity of the coupon or ensure it is applied correctly.

User: My video is buffering a lot.
Bot: Try reducing video quality or check your internet connection.

User: Can I download the videos?
Bot: Currently, downloading is not available. You can stream videos anytime online.

User: I want to upgrade my plan.
Bot: You can upgrade your plan from the subscription section in your dashboard.

User: I didn’t receive the invoice.
Bot: Please check your email. If not found, contact support to resend it.

User: Is EMI available?
Bot: Yes, EMI options are available for selected courses during checkout.

User: I want to delete my account.
Bot: Please contact support with your registered email to process account deletion.

User: How can I update my email address?
Bot: Go to your profile settings and update your email or contact support.

User: I am getting an error while making payment.
Bot: Please try again after some time or use a different payment method.

User: Is there a free trial?
Bot: Some courses offer trial access. Please check course details.

User: I want to talk to a real person.
Bot: Sure, you can contact our support team via email or phone.

User: Where can I track my order?
Bot: You can track your order in the "My Orders" section.

User: Course content is not opening.
Bot: Please refresh the page or try a different browser.

User: Do you provide certificates?
Bot: Yes, certificates are provided after course completion.

User: My account is locked.
Bot: Please reset your password or contact support for unlocking.

User: Can I gift this course to someone?
Bot: Yes, you can gift courses during checkout by entering recipient details.

User: Why is my account inactive?
Bot: Please contact support to check the status of your account.`
    },
  });
  

  History.push({
    role:'model',
    parts:[{text:response.text}]
  })
  
  console.log("\n");
  console.log(response.text);
}


async function main(){
   
   const userProblem = readlineSync.question("Ask me anything--> ");
   await Chatting(userProblem);
   main();
}


main();