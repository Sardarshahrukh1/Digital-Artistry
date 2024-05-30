import axios from "axios";

export const getAllNotificationFromDB = async (token) => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/notifications/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        //jwt-based bearer token authentication
      }
    );
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
