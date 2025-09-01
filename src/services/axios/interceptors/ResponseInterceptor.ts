import { AxiosResponse } from "axios";

//Pode interceptar os dados e tratar
//Guadar históricos
export const responseInterceptor = (response: AxiosResponse) =>{
    return response;
}