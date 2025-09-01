import { ROUTE } from "@/enums/routes.enum";
import { AxiosError } from "axios";

//Identifica os erros e faz tratamento
export const errorInterceptor = (error: AxiosError) => {

    if (error.message === 'Netework error') {
        Promise.reject(new Error('Erro de conexão.'))
    }

    if (error.response?.status === 401) {
        /*localStorage.removeItem(Environment.APP_ACCESS_CARDAPIO); //Acesso via cardapio
        localStorage.removeItem(Environment.APP_ACCESS_TOKEN); //Acesso via login
        localStorage.removeItem(Environment.APP_EMP_ID); //ID da empresa acessada no banco de dados
        localStorage.removeItem(Environment.APP_USER_LOGIN); // Login do usuario
        localStorage.removeItem(Environment.APP_USER_PWD); //Senha do usuário
        localStorage.removeItem(Environment.APP_USER_ID); //ID do usuário no banco de dados
        localStorage.removeItem(Environment.APP_USER_TIPO); //Tipo do usuário - Adminitrador, Atendente, cliente
        localStorage.removeItem(Environment.APP_LOCAL_TIPO); //QUal o tipo de local de atendimento
        localStorage.removeItem(Environment.APP_LOCAL_CLIENTE); //Tipo de Local do cliente (QR CODE)
        localStorage.removeItem(Environment.APP_NOME_CLIENTE); //Nome do cliente (para acesso)
        localStorage.removeItem(Environment.APP_CHAVE_CLIENTE); //Senha do cliente*/

        console.log(window.location.href);
        window.location.href = ROUTE.LOGIN;
        return;

        /*const targetLocation = location.state?.from || { pathname: ROUTE.LOGIN } // Redirects to the current page or to ROUTE.LOGIN if there's no previous state
        return <Navigate to={targetLocation} state={{ from: location }} replace />;*/
    }


    return Promise.reject(error);
}