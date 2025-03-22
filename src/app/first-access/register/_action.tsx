/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getAddressForZipCode } from '@/http/get-address'

export async function getAddressForZipCodeAction(zipCode: string) {
  try {
    return await getAddressForZipCode(zipCode)
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
