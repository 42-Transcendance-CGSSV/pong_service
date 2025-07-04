import axios from "axios";


/**
 * Get account data from user id
 * @param userId
 */
export async function getAccountDataFromId(userId: number) {
    return axios.get(`https://0.0.0.0:25565/get-account/?userId=${userId}`);
}
