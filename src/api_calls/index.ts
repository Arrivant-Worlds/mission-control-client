import axios from "axios";
import queryString from "query-string";
import { Connection } from "@solana/web3.js";
import { BASE_URL, RPC_CONNECTION_URL } from "./constants";
import { JourneyRewardResponseDTO, LeaderboardResponse, PayloadHeaders, QuestCreationModel, QuestResponse, QuestValidation, userResponseDTO } from "interfaces";

export const create_user = async (
  headers: PayloadHeaders, 
  user_code?: { referral_code: string }
  ) => 
{
  const referral_code = user_code || {};
  console.log("trying to create user")
  try {
    const response: {data: userResponseDTO} = await axios.post(
      `${BASE_URL}/users`,
      referral_code,
      { headers: {...headers} }
    );
    return response.data;
  } catch (errors) {
    console.error(errors);
  }
};

export const get_user = async (headers: PayloadHeaders) => {
  try {
    const response = await axios.get(`${BASE_URL}/users`, {headers: {...headers}});
    return await response.data;
  } catch (errors) {
    //console.error(errors.response.data);
    //@ts-ignore
    if (errors.response.status === 747) {
      console.log("HIT ERROR 747")
      if (window.location.search) {
        const params = new Proxy(new URLSearchParams(window.location.search), {
          //@ts-ignore
          get: (searchParams, prop) => searchParams.get(prop),
        });
        //@ts-ignore
        if (params.inviteCode) {
          const create_user_call = await create_user(headers, 
          //@ts-ignore
            { referral_code: params.inviteCode }
          );
          if(!create_user_call) return
          //@ts-ignore
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
        const create_user_call = await create_user(headers);
        if(!create_user_call) return
        //@ts-ignore
        create_user_call.welcome = true;
        // console.log(create_user_call, "return from create_user after attempt");
        return await create_user_call;
      }
    } else {
      throw new Error("There was an error, please login again.");
    }
  }
};

export const get_quests = async (headers: PayloadHeaders): Promise<QuestResponse | null> => {
  try {
    // const response = await axios.get(`${BASE_URL}/quests?available_to_user=true`, {headers: payload});
    const response = await axios.get(`${BASE_URL}/quests`, {
      headers: {...headers},
    });
    return response.data;
  } catch (errors) {
    console.error(errors);
    return null
  }
};

export const get_rewards = async (headers: PayloadHeaders): Promise<JourneyRewardResponseDTO[] | undefined> => {
  try {
    const response = await axios.get(`${BASE_URL}/journeyRewards`, {
      headers: {...headers}
    });
    return response.data;
  } catch (errors) {
    console.error(errors);
    return 
  }
};

export const get_leaderboard = async (headers: PayloadHeaders): Promise<LeaderboardResponse | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/leaderboard`, {
      headers: {...headers},
    });
    return response.data;
  } catch (errors) {
    console.error(errors);
    return null;
  }
};

export const auth_twitter = async (headers: PayloadHeaders) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/users/twitter/authorize`,
      {},
      { headers: {...headers} }
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
export const get_twitter_oauth_redirect = async (oauth_token: string) => {
  return `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
};

// PUT authorized user to server, return status for client to display
// call this function in a useEffect, which waits for callback URL to contain necessary query params
export const verify_twitter = async (payload: PayloadHeaders, query: any) => {
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
            //@ts-ignore
            oauth_token: oauth_token,
            //@ts-ignore
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

export const verify_discord = async (
  headers: PayloadHeaders, 
  token_type: string, 
  access_token: string
  ) => {
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

export const submit_email = async (
  headers: PayloadHeaders, 
  email_string: string, 
  name_string: string
  ) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/users/registerEmail`,
      { email: email_string, name: name_string },
      { headers: {...headers} }
    );
    return response.data;
  } catch (errors) {
    console.error(errors);
    return [];
  }
};

export const update_wallet = async (
  headers: PayloadHeaders, newWalletinfo: any) => {
    console.log("sending", newWalletinfo)
    const response = await axios.post(
      `${BASE_URL}/users/updateWallet`,
      { ...newWalletinfo },
      { headers: {...headers} }
    );
    return response.data;
};

export const claim_journey_reward = async (headers: PayloadHeaders, reward_id: string) => {
  console.log("j reward header", headers)
  try {
    const response = await axios.put(
      `${BASE_URL}/journeyRewards/${reward_id}/claim`,
      {},
      { headers: {...headers} }
    );
    return {status: response.status, data: response.data};
  } catch (errors) {
    console.error(errors);
    //@ts-ignore
    return {status: errors.response.status, data: errors.response.data};
  }
};

export const transmit_signed_journey_reward_tx_to_server = async (
  headers: PayloadHeaders, 
  serializedTX: string, 
  reward_id: string
  ) => {
  try {
    const response = await axios.post(
        `${BASE_URL}/journeyRewards/${reward_id}/transmit`,
        {tx: serializedTX},
        { headers: {...headers} }
    );
    return response
  } catch (errors) {
    console.error(errors);
    return null;
  }
};

export const transmit_signed_quest_reward_tx_to_server = async (
  headers: PayloadHeaders, 
  reward_id: string,
  serializedTX?: string, 
) => {
  try {
    const response = await axios.post(
        `${BASE_URL}/questRewards/${reward_id}/transmit`,
        {tx: serializedTX},
        { headers: {...headers} }
    );
    return response
  } catch (errors) {
    console.error(errors);
    return null;
  }
};

//@ts-ignore
export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const claim_quest_reward = async (
  headers: PayloadHeaders, 
  reward_id: string
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/questRewards/${reward_id}/claim`,
      {},
      { headers: {...headers} }
    );
    return response;
  } catch (errors) {
    console.error(errors);
    //@ts-ignore
    return errors.response;
  }
};

export const claim_all_quest_rewards = async (
  headers: PayloadHeaders, 
  reward_ids: string[] 
) => {
  try {
    console.log("rewards", reward_ids)
    const response = await axios.put(
      `${BASE_URL}/questRewards/claim`,
      { payload: reward_ids },
      { headers: {...headers} }
    );
    return response;
  } catch (errors) {
    console.error(errors);
    //@ts-ignore
    return errors.response;
  }
}

export const get_soulbound = async (headers: PayloadHeaders) => {
  try {
    const response = await axios.get(`${BASE_URL}/soulbounds`, {
      headers: {...headers},
    });
    return response.data;
  } catch (errors) {
    console.error(errors);
    return [];
  }
};

export const create_quest = async (payload: QuestCreationModel, headers: PayloadHeaders) => {
  try {
    const response = await axios.post(
        `${BASE_URL}/admin_MC/create`,
        payload,
        { headers: {...headers} }
    );
    return response
  } catch (errors) {
    //@ts-ignore
    return errors.response.data;
  }
};

export const update_quest = async (payload: QuestCreationModel, headers: PayloadHeaders) => {
  try {
    const response = await axios.post(
        `${BASE_URL}/admin_MC/update`,
        payload,
        { headers: {...headers} }
    );
    return response
  } catch (errors) {
    console.error(errors);
    //@ts-ignore
    if(errors.response.data === typeof(String)) return errors.response.data;
    else { return "Failed"}

  }
};

export const validate_quest = async (payload: QuestValidation, headers: PayloadHeaders) => {
  try {
    const response = await axios.post(
        `${BASE_URL}/admin_MC/validate`,
        payload,
        { headers: {...headers} }
    );
    return response
  } catch (errors) {
    console.error(errors);
    //@ts-ignore
    if(errors.response.data === typeof(String)) return errors.response.data;
    else { return "Failed"}
  }
};

export const RPC_CONNECTION = new Connection(RPC_CONNECTION_URL);
