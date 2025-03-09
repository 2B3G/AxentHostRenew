const cron = require("node-cron");
const sm = require("./SessionManager.js");

cron.schedule("*/1 * * * *", main);

const SessionManager = new sm();

async function main() {
  if (SessionManager.getToken() == null) {
    console.log("Making new session ...");
    await login();
  }

  const token = SessionManager.getToken();
  console.log(token);

  console.log("\n");
  const amount = await getRewardsAmount(token);
  console.log("Amount of coins to claim : " + amount);

  if (amount != 0) {
    console.log("Claiming coins ...");
    for (let i = 0; i < amount; i++) {
      claimCoin(token);
    }
  }
}

async function getRewardsAmount(authToken) {
  const resp = await fetch(
    "https://api.axenthost.com/v5/users/claim/informations",
    {
      headers: {
        Authorization: "Bearer " + authToken,
        "x-axenthost-version": "5.4.3",
      },
    }
  );
  const data = await resp.json();

  return data.capability;
}

async function getCfToken(url) {
  const resp = await makeRequest(
    "http://mi-717f913c.axenthost.me:48891/cf-clearance-scraper",
    {
      url: url,
      siteKey: "0x4AAAAAAAfv2t1uIJ5yrh6C",
      mode: "turnstile-min",
    }
  );

  return JSON.parse(resp).token;
}

async function login() {
  const resp = await makeRequest(
    "https://api.axenthost.com/v5/auth/login",
    {
      user: {
        email: "jan.e.y.su.w.a@gmail.com",
        password: "jan.e.y.su.w.a@gmail.comA1",
      },
      token: await getCfToken("https://app.axenthost.com/login"),
      source: "",
    },
    {
      "x-axenthost-version": "5.4.3",
    }
  );

  const data = JSON.parse(resp);
  SessionManager.setSession(data);
}

async function claimCoin(authToken) {
  await makeRequest(
    "https://api.axenthost.com/v5/users/claim",
    {
      token: await getCfToken("https://api.axenthost.com/v5/users/claim"),
      source: "",
    },
    {
      Authorization: "Bearer " + authToken,
      "x-axenthost-version": "5.4.3",
      "Content-Type": "application/json",
    }
  );
}

function makeRequest(url, data, headers = {}) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  }).then((data) => data.text());
}
