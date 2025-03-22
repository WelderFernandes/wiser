export async function getAddressForZipCode(zipCode: string) {
  const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${zipCode}`)
  const data = response.json()
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return data
}
