import express from 'express';
import nodemailer from 'nodemailer';
import { parseAsString } from 'parse-dont-validate';
import {
    allValueValid,
    Data,
    getEmail,
    getMessage,
    getName,
} from '../../../common/src/contact';

const contactRouter = (app: express.Application) => ({
    sendEmail: () =>
        app.post('/api/contact', (req, res) => {
            if (req.method !== 'POST') {
                throw new Error('Only accept POST request');
            } else {
                const { body } = req;
                const { name, email, message } = body;
                const parsedName = getName(
                    parseAsString(name).orElseGetEmptyString()
                );
                const parsedEmail = getEmail(
                    parseAsString(email).orElseGetEmptyString()
                );
                const parsedMessage = getMessage(
                    parseAsString(message).orElseGetEmptyString()
                );
                if (allValueValid(parsedName, parsedEmail, parsedMessage)) {
                    const email = process.env.EMAIL;
                    const pass = process.env.PASS;
                    const options = {
                        from: `${parsedName.value.trim()} <${email}>`,
                        to: `Gervin Fung Da Xuen <${email}>`,
                        subject: 'UTARi Contact Form',
                        text: `Hello, my name is ${parsedName.value.trim()}\n\nYou can reach me at ${
                            parsedEmail.value
                        }\n\nI would like to ${parsedMessage.value.trim()}`,
                    };
                    nodemailer
                        .createTransport({
                            host: 'smtp-mail.outlook.com',
                            port: 587,
                            secure: false,
                            tls: {
                                ciphers: 'SSLv3',
                            },
                            auth: {
                                user: email,
                                pass,
                            },
                        })
                        .sendMail(options, (error) => {
                            const result = (
                                error
                                    ? {
                                          type: 'failed',
                                          error: error.message,
                                      }
                                    : {
                                          type: 'succeed',
                                          name: {
                                              ...parsedName,
                                              value: '',
                                          },
                                          email: {
                                              ...parsedEmail,
                                              value: '',
                                          },
                                          message: {
                                              ...parsedMessage,
                                              value: '',
                                          },
                                      }
                            ) as Data;
                            res.status(200).json(result);
                        });
                } else {
                    const result = {
                        type: 'input',
                        name,
                        email,
                        message,
                    } as Data;
                    res.status(200).json(result);
                }
            }
        }),
});

export default contactRouter;