import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { replace } from "../navigation/navigationService";

const api = axios.create({
    baseURL: "https://apps.actindore.com/api",
    timeout: 10000,
});

api.interceptors.request.use(
    async (config) => {

        const token = await AsyncStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;

    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    response => response,
    async error => {

        if (error.response?.status === 401) {

            // logout
            await AsyncStorage.clear();

            replace("Login");

            console.log("Session expired");

        }

        return Promise.reject(error);

    }
);

export default api;