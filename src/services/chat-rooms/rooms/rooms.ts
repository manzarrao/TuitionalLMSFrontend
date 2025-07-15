import {
  AxiosGet,
  AxiosPost,
  AxiosDelete,
  AxiosPut,
} from "@/utils/helpers/api-methods";
import { configDataType } from "@/services/config";
import {
  Rooms_Api_Response_Type,
  GetRoomsOptions_Type,
} from "@/types/rooms/getRooms.types";
import { getRoomsApi } from "@/api/rooms";

export const getRooms = (
  options: GetRoomsOptions_Type,
  config: configDataType
) => AxiosGet<Rooms_Api_Response_Type>(getRoomsApi(options), config);
