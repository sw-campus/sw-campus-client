// Server response item for GET /api/v1/carts
export type CartItem = {
  lectureId: string
  title: string
  categoryName?: string
  orgName?: string
  thumbnailUrl?: string
}

// Client payload for POST /api/v1/carts?lectureId=...
export type AddToCartItem = {
  lectureId: string
}
