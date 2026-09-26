import { notFound } from 'next/navigation'

/** Any address that matches no page shows the site's own "not found" page (in its language). */
export default function Missing() {
  notFound()
}
