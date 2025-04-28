import { APIOrderPost, APIOrderPostResponse, APIProductResponse, IProduct } from "../../types";
import { Api } from "../base/api";

export class ShopApi extends Api {
  readonly cdn: string;

  constructor(baseUrl: string, cdn: string, options: RequestInit = {}) {
    super(baseUrl, options)
    this.cdn = cdn
  }

  getProducts(): Promise<IProduct[]> {
    return this.get('/product').then(result => {
      const items = (result as APIProductResponse).items.map(item => {
        item.image = this.cdn + item.image
        return item as IProduct
      })
      return items
    })
  }

  postOrder(data: APIOrderPost): Promise<APIOrderPostResponse> {
    return this.post('/order', data).then(result => result as APIOrderPostResponse)
  }
}