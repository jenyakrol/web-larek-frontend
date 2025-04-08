# Проектная работа "Веб-ларек"

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

#### Одна единица продукта

```
export interface IProduct {
   id: Id
   title: string
   price: Price
   image: Url
   description: string
   category: string
}
```
#### Пользователь
```
export interface IUser {
    basket: IProductsData
    basketTotalPrice: Price
    address: string
    email: string
    payMethod: PayMethod
    phoneNumber: string
}
```
#### Модель для хранения данных нескольких продуктов
```
export interface IProductsData {
    items: IProduct[]
    add(item: IProduct): void
    remove(item: IProduct): void
    getItem(id: Id): IProduct
}
```
#### Данные продукта на главной странице
```
export type TProductInfo = Pick<IProduct, 'title' | 'price' | 'image' | 'category'>
```
#### Данные продукта при открытии в модальном окне
```
export type TProductDetailedInfo = Pick<IProduct, 'title' | 'price' | 'image' | 'category' | 'description'>
```
#### Данные продукта при показе в корзине
```
export type TProductShortInfo = Pick<IProduct, 'title' | 'price'>
```
#### Данные пользователя в форме оформления доставки
```
export type TUserDeliverySettings = Pick<IUser, 'payMethod' | 'address'>
```
#### Данные пользователя в форме контактной информации
```
export type TUserContactInfo = Pick<IUser, 'phoneNumber'| 'email'>
```

#### Базовые типы данных
```
export type Id = string // Идентификатор продукта
export type Url = string // Ссылка на картинку
export type Price = number // Цена продуктов
export type PayMethod = 'online' | 'cash' // Способ оплаты заказа
```

## Типы отображений
#### Карточки товаров отображаемые на странице

```
export interface IProductCard {
    container: HTMLElement
    title: HTMLHeadingElement
    price: HTMLSpanElement
    category?: HTMLSpanElement
    description?: HTMLParagraphElement
    image?: HTMLImageElement
    deleteButton?: HTMLButtonElement
    render(item: TProductInfo | TProductDetailedInfo | TProductShortInfo): HTMLElement
    deleteCard(cardsContainer: IProductsData): void
}
```
#### Модальное окно на странице
```
export interface IModalWindow {
    modal: HTMLElement
    events: IEvents
    open(template: HTMLElement): void
    close(): void
}
```

#### Контент отображаемый внутри модального окна
```
export interface IModalContent {
    content: HTMLElement
    modalWindow: IModalWindow
    events: IEvents
    open(): void
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

#### Класс `ProductsData`

Класс отвечает за хранение и логику работы с данными продуктов.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- `_items: IProduct[]` - массив объектов товаров.
- `events: IEvents` - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными:

- `add(item: IProduct): void` - добавляет товар в массив
- `remove(item: IProduct): void` - убирает товар из массива
- `getItem(id: Id): IProduct` - возвращает товар по идентификатору
- а так-же геттеры и сеттеры для получения и сохранения данных из полей класса

#### Класс `Basket`

Расширяет класс `ProductsData` добавляет к нему метод:
- `getTotalPrice(): Price` - находит сумму всех товаров в корзине

#### Класс `UserData`

Класс отвечает за хранение и логику работы с данными пользователя.\
Конструктор класса принимает инстант брокра событий.\
В полях класса хранятся следующие данные:
- `basket: IProductsData` - корзина хранящая товары добавленные пользователем
- `basketTotalPrice: Price` - общая стоимость товаров в корзине
- `address: string` - адрес введенный пользователем при оформлении заказа
- `email: string` - адрес электронной почты пользователя
- `payMethod: PayMethod` - способ оплаты выбранный пользователем
- `phoneNumber: string` - телефонный номер пользователя

Так же класс предоставляет набор методов для работы с этими данными:
- `setUserInfo(userData: IUser): void` - сохраняет данные пользователя
- `checkUserValidation(data: Record<keyof TUserDeliverySettings, string> | Record<keyof TUserContactInfo, string>): boolean` - проверяет валидность введенных данных

### Слой представления

Все классы представления отвечают за отображение внутри контейнера(DOM-элемент) передаваемых в них данных

#### Класс ProductCard
Класс карточки товара. В конструкторе принимает дом элемент темплейта карточки и объект селекторов внутренних элементов.

- `container: HTMLElement` - элемент карточки
- `title: HTMLHeadingElement` - элемент названия внутри темплейта
- `price: HTMLSpanElement` - элемент стоимости товара внутри темплейта
- `category?: HTMLSpanElement` - элемент категории внутри темплейта
- `description?: HTMLParagraphElement` - элемент описания внутри темплейта
- `image?: HTMLImageElement` - элемент картинки внутри темплейта
- `deleteButton?: HTMLButtonElement` - элемент кнопки удаления карточки


Обладает методом:
- `render(item: TProductInfo | TProductDetailedInfo | TProductShortInfo): HTMLElement` - создает и возвращает элемент карточки с данными переданными в качестве аргумента
- `deleteCard(cardsContainer: IProductsData): void` - удаляет карточку из DOM-древа и из переданного контейнера с данными карточек


#### Класс ModalWindow
Реализует модальное окно.
Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.
- `constructor(modal: HTMLElement, events: IEvents)` Конструктор принимает элемент модального окна и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса
- `modal: HTMLElement` - элемент модального окна
- `events: IEvents` - брокер событий

Так же предоставляет методы:
- `open(template: HTMLElement): void` - для открытия модального окна и замены внутреннего контента
- `close(): void` для закрытия модального окна.

#### Класс ModalContent
Предназначен для реализации внутреннего контента модального окна. В конструкторе принимает темплейт внутреннего контента, экземпляр класса `ModalWindow` и экземпляр класса `EventEmitter`.
- `content: HTMLElement` - внутренний контент модального окна
- `modalWindow: IModalWindow` - модальное окно
- `events: IEvents` - брокер событий

Имеет метод: `open(): void` - открывает модальное окно переданное при инициализации объекта и передает ему в качестве аргумента контент

#### Класс ModalSuccess
Расширяет класс `ModalContent`. Предназначен для реализации окна с оповещением пользователя о покупке

Имеет поля:

- `submitButton: HTMLButtonElement` - кнопка нажатие на которую должно инициализировать событие закрытия окна
- `totalPurchasePrice: HTMLParagraphElement` - элемент выводящий полную сумму потраченную при покупке

Имеет метод:
- `open(basket: Basket): void` - расширяет родительский метод, выводит сумму переданной корзины в контенте окна и очищает коризну от товаров.

#### Класс ModalProductPreview
Расширяет класс `Modal`. Предназначен для реализации окна с превью товара перед добавлением в корзину. 

- `buyButton: HTMLButtonElement` - кнопка добавления товара в корзину

Методы: 
- `open(item: IProduct, basket: Basket, card: IProductCard): void` - расширение родительского метода с созданием карточки с переданными данными и заменой данных внутри модального окна

#### Класс ModalBasket
Расширяет класс `ModalContent`. Предназначен для реализации модального окна с видом корзины пользователя. При сабмите инициирует событие передавая в него свойство корзины.

- `basket: Basket` - активная корзина пользователя
- `basketList: HTMLUListElement` - элемент списка товаров в корзине
- `submitButton: HTMLButtonElement` - элемент кнопки оформления заказа
- `totalPrice: HTMLSpanElement` - элемент отображающий суммарную стоимость товаров корзины

Метод:
- `open(card: IProductCard, basket: Basket): void` - расширяет родительский метод, добавляет элементы класса кард на основе товаров содержащихся в корзине в элемент списка товаров и выводит общую сумму товаров.

#### Класс ModalWithForm
Расширяет класс `ModalContent`. Предназначен для реализации модального окна с формами. При сабмите инициирует событие передавая в него объект с данными из полей ввода формы. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.

- `submitButton: HTMLButtonElement` - Кнопка подтверждения
- `form: HTMLFormElement` - элемент формы
- `formName: string` - значение атрибута name формы
- `inputs: NodeListOf<HTMLInputElement>` - коллекция всех полей ввода формы
- `errors: HTMLSpanElement` - элемент для вывода ошибок рядом с кнопкой подтверждения

Методы:

- `setValid(isValid: boolean): void` - изменяет активность кнопки подтверждения
- `getInputValues(): Record<string, string>` - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные введенные пользователем
- `showInputError (errorMessage: string): void` - отображает полученный текст ошибки
- `hideInputError (): void` - очищает текст ошибки

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

### События изменения данных (генерируются классами моделями данных)
- `user:changed` - изменение данных пользователя
- `products:changed` - изменение массива доступных товаров
- `basket:changed` - изменение массива товаров в корзине

### События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)

#### События открытия различных модальных окон
- `productPreview:open`
- `basketModal:open`
- `deliveryDetails:open`
- `contactInfo:open`
- `orderSuccess:open`

#### События связанные с взимодействиями в модальных окнах
- `basket:add` - добавление товара в корзину
- `basket:delete` - удаление из корзины
- `basket:submit` - подтверждение набора в корзине и начало оформления заказа
- `deliveryOptions:submit`
- `contacts:submit`
- `deliveryOptions:validation`
- `contacts:validation`