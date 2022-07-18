import SelectInput from "@mui/material/Select/SelectInput";
import axios from "axios";
import queryString from "query-string";
import { Connection } from "@solana/web3.js";
import { BASE_URL, RPC_CONNECTION_URL } from "./constants";

export const create_user = async (payload) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/users`,
      {},
      { headers: payload }
    );
    return response.data;
  } catch (errors) {
    console.error(errors);
  }
};

export const get_user = async (payload) => {
  try {
    const response = await axios.get(`${BASE_URL}/users`, { headers: payload });
    return response.data;
  } catch (errors) {
    //console.error(errors.response.data);
    if (errors.response.status == 404) {
      const create_user_call = await create_user(payload);
      return create_user_call;
    } else {
      return {
        xp: 0,
        badgeName: "",
        survivalAssessment: "",
        badgeUrl: "",
      };
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

export const submit_email = async (payload, email_string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/quests/registerEmail`,
      { email: email_string },
      { headers: payload }
    );
    return response.data;
  } catch (errors) {
    console.error(errors);
    return [];
  }
};

export const claim_journey_reward = async (payload, reward_id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/journeyRewards/${reward_id}/claim`,
      {},
      { headers: payload }
    );
    console.log(response.data);
    return response.data;
  } catch (errors) {
    console.error(errors);
    return [];
  }
};

export const claim_quest_reward = async (payload, reward_id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/questRewards/${reward_id}/claim`,
      {},
      { headers: payload }
    );
    console.log(response.data);
    return response.data;
  } catch (errors) {
    console.error(errors);
    return [];
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

export const RPC_CONNECTION = new Connection(RPC_CONNECTION_URL);
