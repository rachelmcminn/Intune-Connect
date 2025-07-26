import Resolver from '@forge/resolver';
import api, { route } from "@forge/api";
import { kvs } from '@forge/kvs';
import { getAADToken, validateJSMToken } from "./tokenmgmt.js";
import {
  TokenURLEndpoint,
  GraphURLScope,
  GraphURLEndpoint,
  ContainerTokenURL,
} from "./constants";
import { logIfDev } from "./utilities";

import { keys } from './constants';
const resolver = new Resolver();

resolver.define("getEnvironment", async ({context}) => {
  const env = context.environmentType;
  return env;
});

resolver.define("getLicenseStatus", async ({payload, context}) => {
  console.log('context', context);
  console.log('context account type', context.accountType);
  console.log('context license', context.license);


  if (!context.license.isActive) {
    return false;
  }
  else {
    return true;
  }

});

resolver.define("setImportSettings", async (context) => {
  const data = context.payload;

  await kvs.setSecret(keys.appEnableImport, data.isEnabled);
  await kvs.setSecret(keys.appImportInterval, data.interval);
});

resolver.define("setJsmContainerToken", async (context) => {
  const data = context.payload;
  await kvs.setSecret(keys.jsmContainerToken, data.token);
});


resolver.define("setJsmGetStatusURL", async (context) => {
  const data = context.payload;
  await kvs.setSecret(keys.jsmStatusUrl, data.url);
});

resolver.define("setJsmStartURL", async (context) => {
  const data = context.payload;
  await kvs.setSecret(keys.jsmStartUrl, data.url);
});

resolver.define("setJsmMappingUrl", async (context) => {
  const data = context.payload;
  await kvs.setSecret(keys.jsmMappingUrl, data.url);
});

resolver.define("setJsmSchemaConfigured", async (context) => {
  const data = context.payload;
  await kvs.setSecret(keys.jsmSchemaConfigured, data.config);
});

resolver.define("getImportStatus", async () => {
    const importStatus = await kvs.getSecret(keys.appEnableImport);
    return importStatus || false;
  });

resolver.define("getImportInterval", async () => {
    const importInterval = await kvs.getSecret(keys.appImportInterval);
    return importInterval ?? null; 
});

resolver.define("getJsmContainerToken", async () => {
  const token = await kvs.getSecret(keys.jsmContainerToken);
  return token || false;

});

resolver.define("getIntuneGraphConfig", async () => {
  const intuneConfig = await kvs.getSecret(keys.intuneConfigured);
  return intuneConfig || false;
});

resolver.define("getIntuneGraphClient", async () => {
  const intuneClient = await kvs.getSecret(keys.intuneClient);
  return intuneClient || false;
});

resolver.define("getIntuneGraphTenant", async () => {
  const intuneTenant = await kvs.getSecret(keys.intuneTenant);
  return intuneTenant || false;
});

resolver.define("getIntuneGraphSecret", async () => {
  const intuneSecret = await kvs.getSecret(keys.intuneSecret);
  return intuneSecret || false;
});

resolver.define("getJsmGetStatusURL", async () => {
  const statusURL= await kvs.getSecret(keys.jsmStatusUrl);
  return statusURL || false;
});

resolver.define("getJsmGetStartURL", async () => {
  const url= await kvs.getSecret(keys.jsmStartUrl);
  return url || false;
});

resolver.define("getJsmGetMappingURL", async () => {
  const JSMMappingURL = await kvs.getSecret(keys.jsmMappingUrl);
  return JSMMappingURL || false;
});

resolver.define("getJsmSchemaConfigured", async () => {
  const data = await kvs.getSecret(keys.jsmSchemaConfigured);
  return data || false;

});

resolver.define("getAADToken", async (context) => {
  const tenant = context.payload.tenant;
  const client = context.payload.client;
  const secret = context.payload.secret;
  let statusMessage;

  const API_URL = `${TokenURLEndpoint}/${tenant}/oauth2/v2.0/token`;
  const data = `client_id=${client}&scope=${GraphURLScope}&client_secret=${secret}&grant_type=client_credentials`;

  let requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
    redirect: "follow",
  };

  const apiResponse = await api.fetch(API_URL, requestOptions);
  // logIfDev("AAD Token response: ", apiResponse);

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

  // return response;
});

resolver.define("validateJSMToken", async (context) => {
  const payload = context.payload;
  const jsmContainerSecret = payload.token;
  return await validateJSMToken(jsmContainerSecret);
});


resolver.define("setJsmConfigured", async (context) => {
  const data = context.payload;
  await kvs.setSecret(keys.jsmConfigured, data.configured);
});

resolver.define("setIntuneSettings", async (context) => {
  const data = context.payload;

  await kvs.setSecret(keys.intuneClient, data.client);
  await kvs.setSecret(keys.intuneTenant, data.tenant);
  await kvs.setSecret(keys.intuneSecret, data.secret);


  const tempClient = await kvs.getSecret(keys.intuneClient);
  const tempTenant = await kvs.getSecret(keys.intuneTenant);
  const tempSecret = await kvs.getSecret(keys.intuneSecret);

  if (tempClient && tempSecret && tempTenant) {
    kvs.setSecret(keys.intuneConfigured, true);
    return {
      client: tempClient,
      secret: tempSecret,
      tenant: tempTenant,
      configured: true,
    };
  } else {
    console.log("graph configuration error");
    return { configured: false };
  }
});

resolver.define("clearStorage", async () => {
  await kvs.deleteSecret(keys.intuneClient);
  await kvs.deleteSecret(keys.intuneTenant);
  await kvs.deleteSecret(keys.intuneSecret);
  await kvs.deleteSecret(keys.intuneConfigured);

});

// Tab3
// Only retrieves the first page of devices because all devices may take a really long time
resolver.define("getTestIntuneDevices", async (context) => {
  const payload = context.payload;
  const token = payload.token; 
  let status_message;
  let status;

  const API_URL = `${GraphURLEndpoint}/v1.0/deviceManagement/managedDevices`;
  const bearer = "Bearer " + token;

  const requestOptions = {
    method: "GET",
    headers: { Authorization: bearer },
    redirect: "follow",
  };

  async function fetchFirstXPages(url, pageCount) {
    const allResults = [];
    let currentPageCount = pageCount;

    async function fetchPage(url) {
      try {
        const response = await api.fetch(url, requestOptions);
        status = response.status;
        if (!response.ok) throw new Error(`HTTP Error ${status}`);

        const data = await response.json();
        allResults.push(...data.value);

        if (data["@odata.nextLink"] && currentPageCount > 1) {
          return fetchPage(data["@odata.nextLink"], --currentPageCount);
        }
        return allResults;
      } catch (error) {
        console.error("Error fetching pages: ", error);
        return [];
      }
    }
    return await fetchPage(url);
  }

  const results = await fetchFirstXPages(API_URL, 1);
  status_message = status === 200 ? "✅ Success" : "⚠️ Error retrieving data";

  return {
    results: results,
    status: status,
    status_message: status_message,
  };
});

resolver.define("createSchemaInAssets", async (context) => {
  const payload = context.payload;
  const jsmMappingURL = payload.mappingURL;
  const jsmContainerSecret = payload.secret;
  const API_URL = jsmMappingURL;
  const bearer = "Bearer " + jsmContainerSecret;
  const requestOptions = {
    method: "PUT",
    headers: { Authorization: bearer, "Content-Type": "application/json" },
    body: JSON.stringify(MappingJSON),
  };
  const apiResponse = await api.fetch(API_URL, requestOptions);
  // logIfDev("createdschema response: ", apiResponse);
  const returnValue = {
    status: apiResponse.status,
    statusText: apiResponse.statusText,
  };
  return returnValue;
});




export const handler = resolver.getDefinitions();

