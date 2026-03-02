import { PagamentoLinks } from "./pagamentolinks"
import { EmpresaAssinatura } from "./empresaassinatura"

export interface PagamentoAssinatura {
    id: number

    dataPagamento: Date
    valorPago: number
    metodoPagamento: string
    createdAt: Date
    updatedAt: Date

    //dados da empresa que fez o pagamento
    empresa_pagamento: string
    id_request: string
    reference_id: string
    created_at: Date

    costumer_name: string
    costumer_email: string
    costumer_tax_id: string
    costumer_phone_type: string
    costumer_phone_country: string
    costumer_phone_area: string
    costumer_phone_number: string

    items_reference_id: string
    items_name: string
    items_quantity: number
    items_unit_amount: number

    shipping_address_street: string
    shipping_address_number: string
    shipping_address_locality: string
    shipping_address_city: string
    shipping_address_region_code: string
    shipping_address_country: string
    shipping_address_postal_code: string

    charges_id: string
    charges_reference_id: string
    charges_status: string
    charges_created_at: Date
    charges_paid_at: Date
    charges_description: string

    charges_amount_value: number
    charges_amount_currency: string

    charges_amount_summary_total: number
    charges_amount_summary_paid: number
    charges_amount_summary_refunded: number

    charges_payment_response_code: number
    charges_payment_response_message: string
    charges_payment_response_reference: string

    charges_payment_response_raw_data_authorization_code: string
    charges_payment_response_raw_data_nsu: string
    charges_payment_response_raw_data_tid: string
    charges_payment_response_raw_data_reason_code: string

    charges_payment_method_type: string
    charges_payment_method_installments: number
    charges_payment_method_capture: boolean
    charges_payment_method_soft_description: string

    charges_payment_method_card_id: string
    charges_payment_method_card_brand: string
    charges_payment_method_card_first_digits: string
    charges_payment_method_card_last_digits: string
    charges_payment_method_card_exp_month: string
    charges_payment_method_card_exp_year: string
    charges_payment_method_card_store: boolean

    charges_payment_method_holder_name: string
    charges_payment_method_holder_tax_id: string

    assinaturaempresa: EmpresaAssinatura
    pagamentoLinks:PagamentoLinks[]

}
