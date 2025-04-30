# Проектная работа "Веб-ларек"

#### Ссылка на готовый проект https://jenyakrol.github.io/web-larek-frontend/ 
Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных

Базовые типы данных

```
export type Id = string
export type Url = string
export type Price = number | null
export type PayMethod = 'online' | 'cash'
```
Тип данных получаемых при запрсое каталога товаров с сервера

```
export type APIProductResponse = {
  items: IProduct[]
  total: number
}
```
Данные отправляемые на сервер для обработки заказа
```
export type APIOrderPost = {
  payment: PayMethod
  email: string
  phone: string
  address: string
  total: Price
  items: Id[]
}
```
Данные получаемые с сервера после обработки заказа
```
export type APIOrderPostResponse = {
  id: Id
  total: number
}
```

Данные продукта приходящие с сервера

```
export interface IProduct {
   id: Id
   title: string
   price: Price
   image: Url
   descrtiption: string
   category: string
   isPurchased: boolean
   togglePurchasedStatus(): void
}
```
Данные вводимы в форма при оформлении заказа
```
export interface IDeliveryForm {
    payMethod: PayMethod
    address: string
}

export interface IContactsForm {
    email: string
    phone: string
}
```
Данные об ошибках в формах
```
export type FormErrors = {
  delivery: string
  contacts: string
}
```
Данные приложения
```
export interface IAppState {
    delivery: IDeliveryForm
    contacts: IContactsForm
    basket: string[]
    formErrors: FormErrors
    catalog: IProduct[]
}
```
Данные для отображения данных на главной странице
```
export interface IPage {
  counter: number
  catalog: HTMLElement[]
  locked: boolean
}
```
Данные для отображения контента внутри модального окна
```
export interface IModal {
  content: HTMLElement
}
```
Данные для отображения контента внутри окна корзины
```
export interface IBasket {
  basketContainer: HTMLElement[],
  price: number
}
```
Данные для отображения ошибок валидации в формах
```
export interface IFormState {
  valid: boolean
  errors: string
}
```
Данные для отображения в карточках с товарами
```
export type ICard = Pick<IProduct, 'title' | 'descrtiption' | 'price' | 'image' | 'id' | 'category' | 'isPurchased'>
```
Данные для отображения в окне с оповещением об оформлении заказа
```
export interface ISuccess {
  total: number
}
```
## Архитектура приложения

Код приложения разделен  на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице
- слой данных, отвечает за  хранение и извлечение данных
- презентер, отвечает за связь представления и данных

### Базовый код

#### Класс `EventEmitter`

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.

Класс имеет методы `on` ,  `off` ,  `emit`  — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно.

Дополнительно реализованы методы  `onAll` и  `offAll`  — для подписки на все события и сброса всех подписчиков.

Интересным дополнением является метод  `trigger` , генерирующий заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса  `EventEmitter` .

#### Класс `Api`

Содержит базовую логику для отправки запросов. В конструктор передаётся базовый URL сервера и опциональный объект с заголовками запросов.

Методы:
- `get` — выполняет GET-запрос по переданному URL-адресу (эндпоинту) и возвращает ответ от сервера в виде объекта.
- `post` — принимает объект с данными, которые будут переданы в теле запроса в формате JSON. Данные отправляются на указанный эндпоинт. По умолчанию выполняется `POST`-запрос, но метод можно изменить, передав третий параметр при вызове метода.

### Слой данных

Классы отвечающие за хранение о работу с данными.

#### Класс `ShopApi`
Расширяет класс `Api`. В конструктор дополнительно принимает `cdn` для правильного отображения изображений продуктов.

Добавляет методы:
- `getProducts(): Promise<IProduct[]>` - Метод для запроса каталога товаров с сервера.
- `postOrder(data: APIOrderPost): Promise<APIOrderPostResponse>` - Метод для отправки данных заказа на сервер.

#### Абстрактный класс `Model<T>`
Класс нужный для записи данных, типы данных передаются через дженерик.\
В конструктор принимает данные с типом `Partial<T>` и эвент эмиттер.
Методы:
- `emitChanges(event: string, payload?: object)` - Сообщить всем что модель поменялась

#### Класс `Product`
Расширяет класс `Model<IProduct>`. Имеет поля соответствующие интерфейсу `IProduct`.\
Добавляет поле:
- `isPurchased: boolean` - для хранения информации о том куплен/добавлен в корзину или нет.

Предоставляет метод `togglePurchasedStatus()` для переключения состояния покупки

#### Класс `AppState`
Расширяет класс `Model<IAppState>`. Нужен для глобального описания работы с данными приложения.\
Имеет поля соответствующие интерфейсу `IAppState`:

Методы:
- `clearBasket()` - для полной очистки корзины
- `get total(): number` - для подсчета общей суммы товаров в корзине
- `set catalog(items: IProduct[])` - для установки значения каталога товаров на главной странице
- `set delivery(data: Partial<IDeliveryForm>)`
- `set contacts(data: Partial<IContactsForm>)`

- `validateDelivery(): boolean`
- `validateContacts(): boolean`

### Слой представления

Все классы представления отвечают за отображение внутри контейнера(DOM-элемент) передаваемых в них данных

#### Абстрактный класс `Component<T>`
Создает класс для работы элементами разметки. В дженерике получает тип данных которые содержит. В конструктор принимает `HTMLElement`

Методы:
- `toggleClass(element: HTMLElement, className: string, force?: boolean): void` - Переключает класс у переданного внутрь элемента.
- `protected setText(element: HTMLElement, value: string): void` - Метод переключающий текст у переданного элемента
- `setDisabled(element: HTMLElement, state: boolean): void` - Меняет статус блокировки элемента
- `protected setHidden(element: HTMLElement)` - Скрывает элемент на странице
- `protected setVisible(element: HTMLElement)` - Показывает элемент на странице
- `protected setImage(element: HTMLImageElement, src: string, alt?: string)` - Устанавливает изображение с альтернативным текстом в элемент
- `render(data?: Partial<T>): HTMLElement` - Добавляет к объекту переданные данные и возвращает корневой `HTMLElement`

#### Класс `Page`
Расширяет класс `Component<IPage>`. Описывает отображение главной страницы. В конструктор дополнительно принимает эвент эмиттер.

- `basket: HTMLButtonElement` - Кнопка при нажатии на которую вызывается события
- `_counter: HTMLSpanElement` - Счетчик товаров в корзине
- `_catalog: HTMLElement` - Элемент содержащий каталог товаров
- `wrapper: HTMLElement` - Элемент обертки страницы

Методы:
- `set counter(value: number)`
- `set catalog(items: HTMLElement[])`
- `set locked(value: boolean)`


#### Класс `Modal`
Расширяет класс `Component<IModal>`. Нужен для описания работы модального окна. В конструктор дополнительно принимает эвент эмиттер.

- `closeButton: HTMLButtonElement` - кнопка закрытия модального окна
- `_content: HTMLElement` - контент внутри модального окна

Методы:
- `set content(value: HTMLElement)`
- `open()`
- `close()`
- `render()` - расширяет родительский метод, дополнительно открывая модальное окно

#### Класс `Basket`
Расширяет класс `Component<IBasket>`. Нужен для описания вида корзины с товарами.

- `set basketContainer(items: HTMLElements[])` - для установки продуктов в контейнер корзины

#### Класс `Card`
Расширяет класс `Component<ICard>`. Нужен для работы с представлением карточки товара. В конструктор дополнительно функцию-коллбэк для кнопки внутри карточки.
- `button: HTMLButtonElement` - Кнопка взаимодействия внутри карточки
- `_title: HTMLElement` - Название товара
- `_price: HTMLSpanElement` - Цена товара

Методы:
- `set title(value: string)`
- `set price(value: Price)`

#### Класс `MainPageCard`
Расширяет класс `Card`. Нужен для описания отображения карточек продуктов на главной странице.
Добавляет поля:
-	`_image: HTMLImageElement`
-	`_category: HTMLSpanElement`

Добавляет методы:
- `set image(value: Url)`
- `set category(value: string)`

#### Класс `PreviewCard`
Расширяет класс `Card`. Нужен для описания отображения карточек продуктов внутри окна предпросмотра.
Добавляет поля:
-	`_image: HTMLImageElement`
-	`_category: HTMLSpanElement`
-	`_description: HTMLParagraphElement`

Добавляет методы:
- `set image(value: Url)`
- `set category(value: string)`
- `set description(value: string)`
- `set isPurchased(state: boolean)` - Нужен для установки состояния кнопки внутри карточки в зависимости от состояния покупки
- `set price(value: Price)` - Расширяет родительсий метод, отключает кнопку покупки у бесценных товараов

#### Класс `BasketCard`
Расширяет класс `Card`. Нужен для описания отображения карточек продуктов внутри окна корзины. В конструктор дополнительно принимает индекс товара в корзине, который установит внутрь специального элемента.

#### Класс `Form<T>`
Расширяет класс `Component<IFormState>`. В конструктор дополнительно принимает эвент эмиттер. В дженерик получает типы данных вводимые в форму.

Поля:
- `protected _submit: HTMLButtonElement` - кнопка отправки формы
- `protected _errors: HTMLElement` - элемент для вывода ошибок валидации

Методы:
- `protected onInputChange(field: keyof T, value: string)` - срабатывает при инпуте формы, вызывает события в эвент эмиттере
- `set valid(value: boolean)`
- `set errors(value: string)`
- `render(state: Partial<T> & IFormState)` - расширяет родтельский метод, дополнительно принимает значения инпутов в форме

#### Класс `Delivery`
Расширяет класс `Form<IDeliveryForm>`. Добавляет сеттеры для установки дефолтных значений при открытии формы.

#### Класс `Contacts`
Расширяет класс `Form<IContactsForm>`. Добавляет сеттеры для установки дефолтных значений при открытии формы.

#### Класс `Success`
Расширяет класс `Component<ISuccess>`. Нужен для отображения окна с оповещением об успешном оформлении заказа.
- `button: HTMLButtonElement` - кнопка "За новыми покупками!"
- `_total: HTMLParagraphElement` - сумма оформленного заказа

Добавляет метод `set total(value: number)` для установки значения в описании заказа

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

### События изменения данных (генерируются классами моделями данных)
- `catalog:changed` - изменение массива доступных товаров
- `deliveryFormErrors:changed`
- `contactsFormErrors:changed` - изменения ошибок валидации форм

### События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)

#### События открытия различных модальных окон
- `modal:open`
- `modal:close`
- `productPreview:open`
- `basketModal:open`

#### События связанные с взимодействиями в модальных окнах
- `basket:add` - добавление товара в корзину
- `basket:delete` - удаление из корзины
- `basket:submit` - подтверждение набора в корзине и начало оформления заказа
- `delivery:submit`
- `contacts:submit`