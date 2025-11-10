export const formatCpfCnpj = (value: string) => {
  const cleanedValue = value.replace(/\D/g, ''); // remove caracteres não numéricos

  if (cleanedValue.length <= 11) {
    // CPF
    return cleanedValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  } else {
    // CNPJ
    return cleanedValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
};

export const formatPhone = (phoneNumber: string): string => {
  const cleanedValue = phoneNumber.replace(/\D/g, ''); // Remove non-digits
  const regex = /^(\d{3})(\d{5})(\d{4})$/; // Matches 10 digits

  if (regex.test(cleanedValue)) {
    return cleanedValue.replace(regex, '($1) $2-$3');
  } else {
    // Handle other lengths or international formats
    return cleanedValue; // Return as-is or apply other logic
  }
};