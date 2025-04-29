import {
	FormErrors,
	IAppState,
	IContactsForm,
	IDeliveryForm,
	IProduct,
} from '../../types';
import { IEvents } from '../base/events';
import { Model } from './Model';

export class AppState extends Model<IAppState> {
	_delivery: Partial<IDeliveryForm>;
	_contacts: Partial<IContactsForm>;
	basket: string[];
	formErrors: FormErrors;
	protected _catalog: IProduct[];

	constructor(data: Partial<IAppState>, events: IEvents) {
		super(data, events);
    if(!this.basket) {
      this.basket = []
    }
    if(!this._delivery) {
      this._delivery = {
        address: '',
        payMethod: 'online'
      }
    }
    if(!this._contacts) {
      this._contacts = {
        phone: '',
        email: ''
      }
    }
    if(!this.formErrors) {
      this.formErrors = {
        delivery: '',
        contacts: ''
      }
    }
	}

	clearBasket() {
		this.basket = [];
	}

	get total(): number {
		return this.basket.reduce(
			(acc, item) =>
				acc + this._catalog.find((product) => product.id === item).price,
			0
		);
	}

	set catalog(items: IProduct[]) {
		this._catalog = items;
    this.emitChanges('catalog:changed')
	}

  get catalog() {
    return this._catalog
  }

	set delivery(data: Partial<IDeliveryForm>) {
		Object.assign(this._delivery, data);
    this.validateDelivery()
	}

	set contacts(data: Partial<IContactsForm>) {
		Object.assign(this._contacts, data);
    this.validateContacts()
	}

	validateDelivery(): boolean {
		if (this._delivery.address.length === 0)
			this.formErrors.delivery = 'Надо ввести адрес доставки';
    else
      this.formErrors.delivery = ''
		this.emitChanges('formErrors:changed', this.formErrors);
		return this.formErrors.delivery.length === 0;
	}

	validateContacts(): boolean {
		if (this._contacts.phone.length === 0 || this._contacts.email.length === 0)
			this.formErrors.contacts = 'Надо ввести контактную информацию';
    else
      this.formErrors.contacts = ''
		this.emitChanges('formErrors:changed', this.formErrors);
		return this.formErrors.contacts.length === 0
	}
}
