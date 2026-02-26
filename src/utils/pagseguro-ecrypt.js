import { PAGSEGURO_PUIBLIC_KEY } from '@/constants/pagseguro'

const pagSeguroScript = document.createElement('script')
pagSeguroScript.setAttribute('src', 'https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js')
document.head.appendChild(pagSeguroScript)

export function encryptCardPagSeguro(cardData) {
    const card = PagSeguro.encryptCard({
        publicKey: PAGSEGURO_PUIBLIC_KEY,
        holder: cardData.nome,
        number: cardData.numeroCartao,
        expMonth: cardData.expMes,
        expYear: cardData.expAno,
        securityCode: cardData.codigoSeguranca
    })

    return card
}