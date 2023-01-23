import axios from "axios";
import queryString from "query-string";
import { Connection } from "@solana/web3.js";
import { BASE_URL, RPC_CONNECTION_URL } from "./constants";

export const create_user = async (payload, user_code) => {
  const referral_code = user_code || {};
  console.log("trying to create user")
  try {
    const response = await axios.post(
      `${BASE_URL}/users`,
      referral_code,
      { headers: payload }
    );
    return response.data;
  } catch (errors) {
    console.error(errors);
  }
};

export const get_user = async (payload) => {
  try {
    const response = await axios.get(`${BASE_URL}/users`, {headers: payload});
    return await response.data;
  } catch (errors) {
    //console.error(errors.response.data);
    if (errors.response.status === 747) {
      console.log("HIT ERROR 747")
      if (window.location.search) {
        const params = new Proxy(new URLSearchParams(window.location.search), {
          get: (searchParams, prop) => searchParams.get(prop),
        });
        if (params.inviteCode) {
          const create_user_call = await create_user(payload, 
            { referral_code: params.inviteCode }
          );
          create_user_call.welcome = true;
          let url = window.location.toString();
          if (url.indexOf("?") > 0) {
              let clean_url = url.substring(0, url.indexOf("?"));
              window.history.replaceState(window.history.state, "", clean_url);
          }
          return create_user_call;
        }
      } else {
        console.log("CALLING CREATE USER")
        const create_user_call = await create_user(payload);
        // console.log(create_user_call, "return from create_user before attempt");
        create_user_call.welcome = true;
        // console.log(create_user_call, "return from create_user after attempt");
        return await create_user_call;
      }
      console.log("sss", errors.response.status)
    } else {
      throw new Error("User exists on a different wallet");
    }
  }
};

export const get_quests = async (payload) => {
  try {
    // const response = await axios.get(`${BASE_URL}/quests?available_to_user=true`, {headers: payload});
    const response = await axios.get(`${BASE_URL}/quests`, {
      headers: payload,
    });
    return response.data;
  } catch (errors) {
    console.error(errors);
    return [
      {
        title: "",
        xp: 0,
        description: "",
        platform: "",
      },
    ];
  }
};

export const get_rewards = async (payload) => {
  try {
    const response = await axios.get(`${BASE_URL}/journeyRewards`, {
      headers: payload,
    });
    return response.data;
  } catch (errors) {
    console.error(errors);
    return [
      {
        xp: 0,
        title: "",
      },
    ];
  }
};

export const get_leaderboard = async (payload) => {
  try {
    const response = await axios.get(`${BASE_URL}/leaderboard`, {
      headers: payload,
    });
    return response.data;
  } catch (errors) {
    console.error(errors);
    return [];
  }
};

export const auth_twitter = async (payload, wallet) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/users/${wallet}/twitter/authorize`,
      {},
      { headers: payload }
    );
    // oauth_token
    return response.data;
  } catch (errors) {
    console.error(errors);
    return [];
  }
};

// Navigate to this oauth URL
// Afterwards it automatically redirects to callback URL defined in Twitter Developer Portal
export const get_twitter_oauth_redirect = async (oauth_token) => {
  return `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
};

// PUT authorized user to server, return status for client to display
// call this function in a useEffect, which waits for callback URL to contain necessary query params
export const verify_twitter = async (payload, query) => {
  let { oauth_token, oauth_verifier } = queryString.parse(query);
  // console.log("callback query", query);
  // console.log("query oauth_token", oauth_token);
  // console.log("query oauth_verifier", oauth_verifier);
  if (oauth_token && oauth_verifier) {
    try {
      const response = await axios.put(
        `${BASE_URL}/users/twitter/callback`,
        {},
        {
          headers: {
            ...payload,
            oauth_token: oauth_token,
            oauth_verifier: oauth_verifier,
          },
        }
      );
      return response.status;
    } catch (e) {
      return false;
    }
  }
};

export const verify_discord = async (headers, token_type, access_token) => {
  await axios.post(
      `${BASE_URL}/discord/oauth?token_type=${token_type}&access_token=${access_token}`,
      {},
      {
        headers: {
          ...headers,
        },
      }
  );
}

export const submit_email = async (payload, email_string, name_string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/users/registerEmail`,
      { email: email_string, name: name_string },
      { headers: payload }
    );
    return response.data;
  } catch (errors) {
    console.error(errors);
    return [];
  }
};

export const claim_journey_reward = async (payload, reward_id) => {
  console.log("j reward header", payload)
  try {
    const response = await axios.put(
      `${BASE_URL}/journeyRewards/${reward_id}/claim`,
      {},
      { headers: payload }
    );
    return {status: response.status, data: response.data};
  } catch (errors) {
    console.error(errors);
    return {status: errors.response.status, data: errors.response.data};
  }
};

export const transmit_signed_journey_reward_tx_to_server = async (payload, serializedTX, reward_id) => {
  try {
    const response = await axios.post(
        `${BASE_URL}/journeyRewards/${reward_id}/transmit`,
        {tx: serializedTX},
        { headers: payload }
    );
    return response
  } catch (errors) {
    console.error(errors);
    return null;
  }
};

export const transmit_signed_quest_reward_tx_to_server = async (payload, serializedTX, reward_id) => {
  try {
    const response = await axios.post(
        `${BASE_URL}/questRewards/${reward_id}/transmit`,
        {tx: serializedTX},
        { headers: payload }
    );
    return response
  } catch (errors) {
    console.error(errors);
    return null;
  }
};

export const claim_quest_reward = async (payload, reward_id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/questRewards/${reward_id}/claim`,
      {},
      { headers: payload }
    );
    return response;
  } catch (errors) {
    console.error(errors);
    return errors.response;
  }
};

export const get_soulbound = async (payload) => {
  try {
    const response = await axios.get(`${BASE_URL}/soulbounds`, {
      headers: payload,
    });
    return response.data;
  } catch (errors) {
    console.error(errors);
    return [];
  }
};

export const create_quest = async (payload, headers) => {
  try {
    const response = await axios.post(
        `${BASE_URL}/admin_MC/create`,
        payload,
        { headers: headers }
    );
    return response
  } catch (errors) {
    console.error(errors);
    if(errors.response.data === typeof(String)) return errors.response.data;
    else { return "Failed"}
  }
};

export const update_quest = async (payload, headers) => {
  try {
    const response = await axios.post(
        `${BASE_URL}/admin_MC/update`,
        payload,
        { headers: headers }
    );
    return response
  } catch (errors) {
    console.error(errors);
    if(errors.response.data === typeof(String)) return errors.response.data;
    else { return "Failed"}

  }
};

export const validate_quest = async (payload, headers) => {
  try {
    const response = await axios.post(
        `${BASE_URL}/admin_MC/validate`,
        payload,
        { headers: headers }
    );
    return response
  } catch (errors) {
    console.error(errors);
    if(errors.response.data === typeof(String)) return errors.response.data;
    else { return "Failed"}
  }
};

export const RPC_CONNECTION = new Connection(RPC_CONNECTION_URL);
