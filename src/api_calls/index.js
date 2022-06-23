import axios from 'axios';

const BASE_URL = 'https://stark-thicket-35864.herokuapp.com';

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
    const response = await axios.get(`${BASE_URL}/users`, {}, {headers: payload});
    return response.data;
  } catch (errors) {
    console.error(errors);
  }
};

export const get_quests = async (payload) => {
  try {
    const response = await axios.get(`${BASE_URL}/quests`, {}, {headers: payload});
    return response.data;
  } catch (errors) {
    console.error(errors);
  }
};

export const get_rewards = async (payload) => {
  try {
    const response = await axios.get(`${BASE_URL}/completions`, {}, {headers: payload});
    return response.data;
  } catch (errors) {
    console.error(errors);
  }
};

export const get_leaderboard = async (payload) => {
  try {
    const response = await axios.get(`${BASE_URL}/leaderboard`, {}, {headers: payload});
    return response.data;
  } catch (errors) {
    console.error(errors);
  }
};
