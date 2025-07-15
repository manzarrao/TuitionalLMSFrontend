import { BASE_URL } from "@/services/config";
import { GetRoomsOptions_Type } from "@/types/rooms/getRooms.types";

export const getRoomsApi = (options: GetRoomsOptions_Type) => {
  const params = [];
  if (options?.userId) params.push(`userId=${options.userId}`);

  const queryString = params.join("&");
  return `${BASE_URL}/api/rooms?${queryString}`;
};
