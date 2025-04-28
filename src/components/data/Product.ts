import { Id, IProduct, Price, Url } from '../../types';
import { IEvents } from '../base/events';
import { Model } from './Model';

export class Product extends Model<IProduct> {
	id: Id;
	title: string;
	price: Price;
	image: Url;
	description: string;
	category: string;

  isPurchased: boolean;

  constructor(data: Partial<IProduct>, events: IEvents) {
    super(data, events)
    this.isPurchased = false
  }

  togglePurchasedStatus() {
    this.isPurchased = !this.isPurchased

    if (this.isPurchased) this.emitChanges('basket:add', this)
    else this.emitChanges('basket:remove', this)
    this.emitChanges('catalog:changed')
  }
}
