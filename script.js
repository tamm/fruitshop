class Log {
	static Output() {
		console.log(...arguments);
		let line = document.createElement('li');
		line.innerText = JSON.stringify(arguments);
		document.querySelector('#log').append(line);
	}
}

class Stock {
	constructor(){
		this.stockItems = {
			'Bananas': {
				'Id': 1,
				'Name': 'Conchita Bananas'
			},
			'Red apple': {
				'Id': 2,
				'Name': 'Red star apple'
			},
			'Green Apple': {
				'Id': 3,
				'Name': 'Green diamond'
			},
			'Melons': {
				'Id': 4,
				'Name': 'Havanna sugar melone'
			}
		};
	}

	GetById(id) {
		return this.stockItems[Object.keys(this.stockItems).filter((item) => {return this.stockItems[item].Id == id})[0]];
	}

	List() {
		return this.stockItems;
	}

	ShowList() {
		Log.Output(this.List());
	}
}
let stock = new Stock();

class Order {
	constructor(){
		this.order = {
			items: []
		};
	}

	ExistingItem(itemId) {
		return this.order.items.filter((orderItem) => {return orderItem.item.Id == itemId})[0];
	}

	AddToOrder(stockId = 1, quantity = 0) {
		let ExistingItem = this.ExistingItem(stockId);
		if (ExistingItem) {
			ExistingItem.quantity = ExistingItem.quantity + quantity;
		} else {
			this.order.items.push({
				item: stock.GetById(stockId),
				quantity
			});
		}
		orders.DrawOrderButtons();
		Log.Output(`Added ${stock.GetById(stockId).Name} order`);
	}

	RemoveFromOrder(stockId, quantity) {
		let ExistingItem = this.ExistingItem(stockId);
		if (ExistingItem) {
			ExistingItem.quantity = ExistingItem.quantity - quantity;
			if (ExistingItem.quantity < 1) {
				this.order.items = this.order.items.filter((orderItem) => {return orderItem.item.Id != stockId});
			}
			orders.DrawOrderButtons();
			Log.Output(`Removed ${stock.GetById(stockId).Name} from order`);
		} else {
			Log.Output(`${stock.GetById(stockId).Name} does not exist on order`);
		}
	}

	List() {
		return this.order;
	}

	ShowList() {
		Log.Output(this.List());
	}
}

class Orders {
	constructor() {
		this.orders = [];
	}

	AddOrder() {
		this.orders.push(new Order());

		this.DrawOrderButtons();
		Log.Output(`Added order`);
		this.ShowList();
	}

	RemoveOrder(orderId = this.orders.length - 1) {
		if (this.orders.length > 0) {
			this.orders.splice(orderId, 1);
			this.DrawOrderButtons();
			Log.Output(`Removed order`);
		} else {
			Log.Output('No orders to Remove', this.List());
		}
	}

	DrawOrderButtons() {
		document.querySelector('#orders').innerHTML = "";

		this.orders.forEach((order, index) => {
			const orderId = index;
			let orderActions = document.createElement('section');
			orderActions.id = `order-actions-${orderId}`;
			orderActions.className = `order`;
			document.querySelector('#orders').append(orderActions);

			Object.keys(stock.List()).forEach((key) => {
				const item = stock.List()[key];

				let stockItem = document.createElement('div');
				stockItem.className = 'order-item';
				let itemName = document.createElement('span');
				itemName.innerText = item.Name;
				stockItem.append(itemName);
				let quantity = document.createElement('span');
				let orderItem = order.List().items.filter((orderItem) => {return item.Id == orderItem.item.Id})[0];

				quantity.innerText = orderItem ? orderItem.quantity : 0;
				stockItem.append(quantity);
				orderActions.append(stockItem);

				let addButton = document.createElement('button');
				addButton.innerText = `Add`;
				addButton.className = 'add-button';
				addButton.onclick = () => orders.List()[orderId].AddToOrder(item.Id, 1);
				stockItem.append(addButton);

				let removeButton = document.createElement('button');
				removeButton.innerText = `Remove`;
				removeButton.className = 'remove-button';
				removeButton.onclick = () => orders.List()[orderId].RemoveFromOrder(item.Id, 1);
				stockItem.append(removeButton);
			});

			let removeOrderButton = document.createElement('button');
			removeOrderButton.innerText = `Remove order`;
			removeOrderButton.onclick = () => orders.RemoveOrder(orderId);
			orderActions.append(removeOrderButton);
		});
	}

	List() {
		return this.orders;
	}

	ShowList() {
		this.orders.forEach((order, index) => {
			Log.Output(`Order ${index}`);

			order.List().items.forEach((item) => {
				Log.Output(`${item.item.Name}, ${item.quantity}`);
			});
		});
	}
}
let orders = new Orders();

let test = function() {
	Log.Output('stock.ShowList()');
	stock.ShowList();


	Log.Output('Orders.ShowList()');
	orders.ShowList();

	orders.AddOrder();
	let order = orders.List()[0];

	order.AddToOrder(3,3);
	order.AddToOrder(3,3);
	order.RemoveFromOrder(3,3);

	Log.Output('orders.ShowList()');
	orders.ShowList();
};