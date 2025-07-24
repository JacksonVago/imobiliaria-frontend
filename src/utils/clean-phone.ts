export const cleanPhoneNumber = (phone: string) => {
  return phone.replace(/[^\d\-\(\)\s]/g, '') // Remove tudo que não for número, espaço, parênteses ou traço
}
