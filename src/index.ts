import { EventEmitter } from './components/base/events';
import { AppState } from './components/data/AppState';
import { Product } from './components/data/Product';
import { ShopApi } from './components/data/ShopAPI';
import { Basket } from './components/view/Basket';
import { BasketCard, MainPageCard, PreviewCard } from './components/view/Card';
import { Contacts, Delivery } from './components/view/Form';
import { Modal } from './components/view/Modal';
import { Page } from './components/view/Page';
import { Success } from './components/view/Success';
import './scss/styles.scss';
import { Id, IDeliveryForm, IProduct, PayMethod } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const api = new ShopApi(API_URL, CDN_URL, settings);
const events = new EventEmitter();

const appData = new AppState({}, events);
const page = new Page(ensureElement('body'), events);
const modal = new Modal(ensureElement('.modal'), events);

events.onAll((event) => console.log(event.eventName));

api.getProducts().then((result) => {
	appData.catalog = result.map((item) => new Product(item, events));
	page.render({
		counter: appData.basket.length,
		locked: false,
	});
});

events.on('catalog:changed', () => {
	let card = new MainPageCard(cloneTemplate('#card-catalog'), () =>
		events.emit('preview:open', { item: appData.catalog[0] })
	);
	const cards = appData.catalog.map((item) => {
		card = new MainPageCard(cloneTemplate('#card-catalog'), () =>
			events.emit('preview:open', { item })
		);
		return card.render({
			title: item.title,
			price: item.price,
			image: item.image,
			category: item.category,
		});
	});
	page.render({
		catalog: cards,
	});
});

events.on('modal:open', () => (page.locked = true));

events.on('modal:close', () => (page.locked = false));

events.on('preview:open', (data: { item: IProduct }) => {
	const card = new PreviewCard(cloneTemplate('#card-preview'), () => {
		data.item.togglePurchasedStatus();
		card.render({
			isPurchased: data.item.isPurchased,
		});
	});
	modal.render({
		content: card.render({
			title: data.item.title,
			price: data.item.price,
			image: data.item.image,
			category: data.item.category,
			description: data.item.description,
			isPurchased: data.item.isPurchased,
		}),
	});
});

events.on('basket:add', (data: { id: Id }) => {
	appData.basket.push(data.id);
	page.counter = appData.basket.length;
});

events.on('basket:remove', (data: { id: Id }) => {
	appData.basket = appData.basket.filter((item) => item !== data.id);
	page.counter = appData.basket.length;
});

events.on('basket:open', () => {
	const basket = new Basket(cloneTemplate('#basket'), events);
	const basketElements = appData.basket.map((itemId, index) => {
		const item = appData.catalog.find((it) => it.id === itemId);
		const card = new BasketCard(
			index + 1,
			cloneTemplate('#card-basket'),
			() => {
				events.emit('basket:remove', item);
				events.emit('basket:open');
			}
		);
		return card.render({
			title: item.title,
			price: item.price,
		});
	});

	modal.render({
		content: basket.render({
			basketContainer: basketElements,
			price: appData.total,
		}),
	});
});

events.on('basket:submit', () => {
	events.emit('delivery:open');
});

events.on('delivery:open', () => {
	const deliveryForm = new Delivery(cloneTemplate('#delivery'), events);

	events.on('formErrors:changed', () => {
		deliveryForm.render({
			valid: appData.formErrors.delivery.length === 0,
			errors: appData.formErrors.delivery,
			address: appData._delivery.address,
		});
	});

	modal.render({
		content: deliveryForm.render({
			valid: true,
			errors: '',
			address: appData._delivery.address,
		}),
	});
});

events.on(
	'delivery:changed',
	(data: { field: keyof IDeliveryForm; value: string | PayMethod }) => {
		appData.delivery = { [data.field]: data.value };
	}
);

events.on('delivery:submit', () => {
	console.log(appData.validateDelivery());
	if (appData.validateDelivery()) {
		events.off('formErrors:changed');
		events.emit('contacts:open');
	}
});

events.on('contacts:open', () => {
	const contactsForm = new Contacts(cloneTemplate('#contacts'), events);

	events.on('formErrors:changed', () => {
		console.log('jopa');
		console.log(appData.formErrors);
		contactsForm.render({
			valid: appData.formErrors.contacts.length === 0,
			errors: appData.formErrors.contacts,
			phone: appData._contacts.phone,
			email: appData._contacts.email,
		});
	});

	modal.render({
		content: contactsForm.render({
			valid: true,
			errors: '',
			phone: appData._contacts.phone,
			email: appData._contacts.email,
		}),
	});
});

events.on(
	'contacts:changed',
	(data: { field: keyof IDeliveryForm; value: string | PayMethod }) => {
		appData.contacts = { [data.field]: data.value };
	}
);

events.on('contacts:submit', () => {
	if (appData.validateContacts()) {
		api
			.postOrder({
				payment: appData._delivery.payMethod,
				address: appData._delivery.address,
				phone: appData._contacts.phone,
				email: appData._contacts.email,
				total: appData.total,
				items: appData.basket,
			})
			.then((result) => {
				if (result.id && result.total) {
					events.off('formErrors:changed');
					events.emit('success:open');
				}
			});
	}
});

events.on('success:open', () => {
	const success = new Success(cloneTemplate('#success'), events);
	modal.render({ content: success.render({ total: appData.total }) });
	appData.clearBasket();
	api.getProducts().then((result) => {
		appData.catalog = result.map((item) => new Product(item, events));
	});
});

events.on('success:close', () => {
	modal.close();
});
