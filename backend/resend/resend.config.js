import { Resend } from 'resend';
import dotenv from "dotenv";

dotenv.config();

export const resend = new Resend(process.env.RESEND_KEY)
export const from =  "CodeExamPrep <cep@robertplawski.pl>"
