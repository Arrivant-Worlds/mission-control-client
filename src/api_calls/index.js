import axios from 'axios';

// const BASE_URL = 'https://stark-thicket-35864.herokuapp.com';
const BASE_URL = 'http://localhost:3001';

export const create_user = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/users`, {}, {headers: payload});
    return response.data;
  } catch (errors) {
    console.error(errors);
  }
};

export const get_user = async (payload) => {
  try {
    const response = await axios.get(`${BASE_URL}/users`, {headers: payload});
    return response.data;
  } catch (errors) {
    console.error(errors.response.data);
    if (errors.response.data === "user does not exist") {
      const create_user_call = await create_user(payload);
      return create_user_call;
    } else {
      return (
        {
          xp: 0,
          badgeName: "",
          survivalAssessment: "",
          badgeUrl: "",
        }
      )
    }
  }
};

export const get_quests = async (payload) => {
  try {
    // const response = await axios.get(`${BASE_URL}/quests?available_to_user=true`, {headers: payload});
    const response = await axios.get(`${BASE_URL}/quests`, {headers: payload});
    return response.data;
  } catch (errors) {
    console.error(errors);
    return (
      [{
        title: "",
        xp: 0,
        description: "",
        platform: "",
      }]
    )
  }
};

export const get_rewards = async (payload) => {
  try {
    const response = await axios.get(`${BASE_URL}/journeyRewards`, {headers: payload});
    return response.data;
  } catch (errors) {
    console.error(errors);
    return (
      [
        {
          xp: 0,
          title: "",
        }
      ]
    )
  }
};

export const get_leaderboard = async (payload) => {
  try {
    const response = await axios.get(`${BASE_URL}/leaderboard`, {headers: payload});
    return response.data;
  } catch (errors) {
    console.error(errors);
    return ([]);
  }
};

export const auth_twitter = async (payload, wallet) => {
  try {
    const response = await axios.put(`${BASE_URL}/users/${wallet}/twitter/authorize`, {});
    return response.data;
  } catch (errors) {
    console.error(errors);
    return ([]);
  }
};

export const submit_email = async (payload, email_string) => {
  console.log(payload, "in api call");
  console.log(email_string, "email in api call");
  try {
    const response = await axios.post(`${BASE_URL}/quests/registerEmail`, {email: email_string}, {headers: payload});
    return response.data;
  } catch (errors) {
    console.error(errors);
    return ([]);
  }
};