/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import "dotenv/config";
import {WebClient, LogLevel} from "@slack/web-api";
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest(async (request, response) => {
  try {
    const accessToken = process.env.SLACK_ACCESS_TOKEN;
    const verificationToken = process.env.SLACK_VERIFICATION_TOKEN;
    const client = new WebClient(accessToken, {
      logLevel: LogLevel.DEBUG,
    });

    if (accessToken === undefined || verificationToken === undefined) {
      logger.error("Invalid token");
      return;
    }
    logger.info(request.body, {structuredData: true});

    if (typeof request.body.challenge !== "undefined") {
      logger.info(request.body.challenge, {structuredData: true});
      return;
    }

    if (request.body.token !== verificationToken) {
      logger.error("Invalid token");
      return;
    }
    // user特定
    const userId = request.body.event.user;
    const userName = await client.users.info({user: userId});
    const realUserName = userName.user?.real_name;
    // テキスト抽出
    const text = request.body.event.text;
    const formatedText = text.replace(/<@.*>/g, "");
    const resendText =
      realUserName +
      "さんからのメッセージです\n" +
      formatedText +
      "\n詳しくはtutjazz.slack.comをご確認ください";
    logger.info(resendText, {structuredData: true});
    logger.info("line notify")
  } catch (e) {
    logger.error(e);
  }
});



