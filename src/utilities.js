export const returnSuccess = async (msg) => {
    return {
      body: "Success: " + msg,
      headers: { "Content-Type": ["application/json"] },
      statusCode: 200,
      statusText: msg,
    };
  };
  
  export const returnError = async (msg) => {
    return {
      body: "Error: " + msg,
      headers: { "Content-Type": ["application/json"] },
      statusCode: 500,
      statusText: msg,
    };
  };
  
  export const formatDate = (d) => {
    const date = new Date(d);
  
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  };
  
  export const isLicenseActiveBackend = (data) => {
    let r = false;
    if (data.license == null) {
      r = true; // Non Prod environments are considered licensed.
      if (data.environmentType !== "PRODUCTION") {
        if (data.environmentType === "DEVELOPMENT") {
          isDevEnvironment = true;
        }
      }
    } else if (data.license && data.license.isActive) {
      r = data.license.isActive;
    } else if (data.license.isActive == false) {
      r = false;
    }
    return r;
  };
  
  export let isDevEnvironment = true;
  
  export async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  export function logIfDev(prefix, body) {
    if (isDevEnvironment) {
      console.log(prefix, body);
    }
  }