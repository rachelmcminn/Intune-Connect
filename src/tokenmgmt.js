import api from "@forge/api";
import {
  TokenURLEndpoint,
  GraphURLScope,
  ContainerTokenURL,
} from "./constants";
import { logIfDev } from "./utilities";

export const getAADToken = async (tenant, client, secret) => {
  logIfDev("getAADToken");
  logIfDev("Tenant: ", tenant);
  logIfDev("Client: ", client);
  logIfDev("Secret: ", secret);
  let statusMessage;
  const API_URL = `${TokenURLEndpoint}/${tenant}/oauth2/v2.0/token`;

  const data = `client_id=${client}&scope=${GraphURLScope}&client_secret=${secret}&grant_type=client_credentials`;

  logIfDev("URL ", API_URL);
  logIfDev("Credentials", data);
  let requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
    redirect: "follow",
  };

  const apiResponse = await api.fetch(API_URL, requestOptions);
  logIfDev("AAD Token response: ", apiResponse);

  const tokenStatus = apiResponse.status;
  let jsonResponse;
  let jsonParsed = true;
  try {
    jsonResponse = await apiResponse.json();
  } catch (error) {
    jsonParsed = false;
    console.error("Error with apiResponse: ", apiResponse);
  }

  switch (tokenStatus) {
    case 200:
      statusMessage = "✅ Success";
      break;
    case 403:
      statusMessage = "⚠️ Invalid Credentials; please recheck the values";
      jsonParsed = false;
      break;
    default:
      statusMessage =
        "⚠️ Unknown error; please recheck the credential and check the app log";
      console.error("Error with Entra ID Credentials: ", apiResponse);
  }

  const tokenObject = {
    response: jsonParsed ? jsonResponse : "Unparseable Response",
    status: tokenStatus,
    status_message: statusMessage,
  };

  return tokenObject;
};

export const validateJSMToken = async (token) => {
  const API_URL = ContainerTokenURL;
  const bearer = "Bearer " + token;
  const requestOptions = {
    method: "GET",
    headers: { Authorization: bearer },
  };
  logIfDev("Validating JSM Token: ", API_URL);
  logIfDev("Request Options: ", requestOptions);
  const apiResponse = await api.fetch(API_URL, requestOptions);
  logIfDev("JSM Token API Response", apiResponse);

  const results = await apiResponse.json();

  const status = apiResponse.status;

  const objectReturn = {
    status: status,
    links: results.links,
    msg: results.message,
  };

  return objectReturn;
};
