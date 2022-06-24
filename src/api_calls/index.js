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
    return (
      {
        xp: 0,
        badgeName: "",
        survivalAssessment: "",
        badgeUrl: "",
      }
    )
  }
};

export const get_quests = async (payload) => {
  try {
    const response = await axios.get(`${BASE_URL}/quests?available_to_user=true`, {}, {headers: payload});
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
    const response = await axios.get(`${BASE_URL}/journeyRewards`, {}, {headers: payload});
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
    const response = await axios.get(`${BASE_URL}/leaderboard`, {}, {headers: payload});
    return response.data;
  } catch (errors) {
    console.error(errors);
    return ([]);
  }
};
