import { HttpTypes } from "@medusajs/types"

/**
 * Check if all items in the cart are digital products (don't require shipping)
 */
export function isDigitalOnlyCart(cart: HttpTypes.StoreCart | null): boolean {
  if (!cart?.items?.length) {
    return false
  }

  // Check if all items don't require shipping
  const allDigital = cart.items.every((item) => item.requires_shipping === false)
  
  return allDigital
}

/**
 * Check if cart has any digital products
 */
export function hasDigitalProducts(cart: HttpTypes.StoreCart | null): boolean {
  if (!cart?.items?.length) {
    return false
  }

  return cart.items.some((item) => item.requires_shipping === false)
}

/**
 * Check if cart has any physical products (requiring shipping)
 */
export function hasPhysicalProducts(cart: HttpTypes.StoreCart | null): boolean {
  if (!cart?.items?.length) {
    return false
  }

  return cart.items.some((item) => item.requires_shipping !== false)
}

