import { PAGSEGURO_PUIBLIC_KEY } from '@/constants/pagseguro'


export const encryptCardPagSeguro = (cardData) => {
    /*const script = document.createElement("script");
    script.src = "https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js";
    script.async = true;
    document.body.appendChild(script);*/

    const card = PagSeguro.encryptCard({
        publicKey: PAGSEGURO_PUIBLIC_KEY,
        holder: cardData.holder,
        number: cardData.number,
        expMonth: cardData.expMonth,
        expYear: cardData.expYear,
        securityCode: cardData.securityCode
    })

    return card;
}

export function Calc_DIG_Modulo(Numero, Modulo) {

    var str_multp_10 = "12121212121212121212121212121212121212121212121212";
    var str_multp_11 = "32987654329876543298765432987654329876543298765432";
    var str_multp = "";
    var str_soma = "";
    var int_soma = 0;
    var int_total = 0;
    var int_dig = 0;
    var int_mod = 0;

    if (Modulo == 10) {
        str_multp = str_multp_10.substring(str_multp_10.length - Numero.length, Numero.length);

        for (var i = Numero.length - 1; i >= 0; i--) {
            int_soma = (Numero.substring(i, i + 1) * str_multp.substring(i, i + 1));
            if (int_soma > 9) {
                str_soma = int_soma.toString();
                int_total += parseInt(str_soma.substr(0, 1)) + parseInt(str_soma.substr(1, 1));
            }
            else {
                int_total += int_soma;
            }
        }

        int_dig = ((int_total % Modulo) == 0 ? 0 : (Modulo - (int_total % Modulo)));

    }
    else {
        str_multp = str_multp_11.substring(str_multp_11.length - Numero.length, str_multp_11.length);
        for (var i = Numero.length - 1; i >= 0; i--) {
            int_soma = (Numero.substring(i, i + 1) * str_multp.substring(i, i + 1));
            int_total += int_soma;
        }

        int_dig = ((int_total % Modulo) == 0 || (int_total % Modulo) == 1 ? 0 : ((int_total % Modulo) == 10 ? 1 : (Modulo - (int_total % Modulo))));
    }

    return int_dig;

}
