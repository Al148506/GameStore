import api from "./axios";

export const orderApi = {
    getLastOder: async () => {
        const res = await api.get("/orders/last-order");
        return res.data;
    },
    getHistory: async () => {
        const res = await api.get("/orders/history");
        return res.data;
    }
};