import { Metadata } from "next"
import { headers } from "next/headers"
import { Suspense } from "react"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import { TenantHeader } from "@modules/layout/components/tenant-header"
import { TenantFooter } from "@modules/layout/components/tenant-footer"
import { fetchTenantByDomain } from "@/utilities/fetchTenantByDomain"
import { EmbeddedWrapper } from "./embedded-wrapper"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  // Fetch tenant based on domain
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const tenant = await fetchTenantByDomain(host)

  return (
    <>
      <Suspense fallback={null}>
        <EmbeddedWrapper>
          {tenant && <TenantHeader tenant={tenant} />}
          <Nav />
          {customer && cart && (
            <CartMismatchBanner customer={customer} cart={cart} />
          )}

          {cart && (
            <FreeShippingPriceNudge
              variant="popup"
              cart={cart}
              shippingOptions={shippingOptions}
            />
          )}
        </EmbeddedWrapper>
      </Suspense>
      {props.children}
      <Suspense fallback={null}>
        <EmbeddedWrapper>
          <Footer />
          {tenant && <TenantFooter tenant={tenant} />}
        </EmbeddedWrapper>
      </Suspense>
    </>
  )
}
