import React, { Component } from 'react';
import axios from 'axios';
import Chat from '../Chat/index.jsx';

import io from 'socket.io-client';
const socket = io('http://localhost:4000');

import fontawesome from '@fortawesome/fontawesome';
import faShoppingCart from '@fortawesome/fontawesome-free-solid/faShoppingCart';
import faAngleDoubleLeft from '@fortawesome/fontawesome-free-solid/faAngleDoubleLeft';

fontawesome.library.add(faShoppingCart);
fontawesome.library.add(faAngleDoubleLeft);

import './Menu.scss';

const GOOGLE = process.env.GOOGLE;
//click events that grab values using classname will likely have to be switched to firstchild.innerHTML to not conflict with css
//biz ids cannot be formatted similarly to user ids or they will overwrite each other in redis
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBizId: 5 /*should be set on click of restaurant thumbnail So can biz name!! (can be grabbed off the menu if response is modified on server side)*/,
      currentBizName: null,
      currentMenu: null,
      food: null,
      foods: null,
      currentItem: null,
      currentItemQuantity: null,
      checkedOut: false,
      currentItemPrice: null,
      usersCart: null,
      userId: null,
      address: null,
      subTotal: null,
      email: JSON.parse(localStorage.storage).email,
      stripeAccount: false,
      classIsActive: true,
    };
  }

  componentDidMount() {
    socket.on('connection', () => {
      console.log('connected to server');
    });
    this.setState({
      currentBizId: location.pathname
        .split('/businessProfile/')
        .join('')
        .split('~')[1],
      currentBizName: location.pathname
        .split('/businessProfile/')
        .join('')
        .split('~')[0]
        .split('%20')
        .join(' '),
      userId: JSON.parse(localStorage.storage).id,
    });
    this.handleClick(
      location.pathname
        .split('/businessProfile/')
        .join('')
        .split('~')[1]
    );
  }

  handleClick = async bizId => {
    //biz id should be attached to image on sql query for restaurants
    try {
      const response = await axios.get(
        `http://localhost:3000/api/menu/menuGet/${bizId}`
      );
      this.setState({
        currentMenu: response.data,
      });
      this.renderFoodTypes();
    } catch (error) {
      console.error(error);
    }
  };

  renderFoodTypes = () => {
    const foodType = [];
    const { currentMenu, classIsActive } = this.state;
    for (var key in currentMenu) {
      foodType.push(
        <div
          className={classIsActive ? 'active foodType' : 'foodType'}
          key={key}
        >
          <div
            className={key}
            onClick={e => this.renderFoodItems(e.target.className)}
          >
            {key}
          </div>
        </div>
      );
    }
    this.setState({
      food: foodType,
    });
  };

  renderFoodItems = foodThing => {
    const foodItems = [];
    const { currentMenu, classIsActive } = this.state;
    let aFG = currentMenu[foodThing];
    if (aFG === undefined) {
      aFG = [];
    } else {
      foodItems.push(
        <div
          className={classIsActive ? 'x active' : 'x'}
          key={aFG}
          onClick={() => {
            this.renderFoodItems();
            this.renderFoodTypes();
          }}
        >
          <i className="fas fa-angle-double-left" />
        </div>
      );
    }
    for (var i = 0; i < aFG.length; i++) {
      foodItems.push(
        <div
          className={classIsActive ? 'foodItem active' : 'foodItem'}
          key={aFG[i].name}
        >
          <div className={aFG[i].name} onClick={this.itemClick}>
            <li className={aFG[i].name} id={aFG[i].price}>
              {aFG[i].name}
            </li>
            <li className={aFG[i].name} id={aFG[i].price}>
              {aFG[i].price}
            </li>
          </div>
        </div>
      );
    }
    this.setState(
      {
        foods: foodItems,
        classIsActive: !classIsActive,
      },
      () => this.renderFoodTypes()
    );
  };

  itemClick = e => {
    this.setState({
      currentItem: e.target.className /*the item clicked,*/,
      currentItemQuantity: 1 /*quantity incremented*/,
      currentItemPrice: e.target.id,
    });
  };

  adjustQuantity = amount => {
    const { currentItemQuantity } = this.state;
    if (currentItemQuantity === 0 && amount === -1) {
      return;
    }

    this.setState({
      currentItemQuantity: currentItemQuantity + amount,
    });
  };

  addToCart = async () => {
    const {
      currentItemPrice,
      currentItemQuantity,
      userId,
      currentItem,
    } = this.state;
    const thing = [currentItemPrice, currentItemQuantity];
    try {
      await axios.post(`http://localhost:3000/api/cart/addItem`, {
        userId: userId,
        item: currentItem,
        quantity: JSON.stringify(thing),
      });
      await this.viewCart();
    } catch (error) {
      console.error(error);
    }

    this.setState({
      currentItem: null,
      currentItemQuantity: null,
    });
  };

  deleteItem = async food => {
    const { userId } = this.state;
    try {
      await axios.delete(`http://localhost:3000/api/cart/deleteItem`, {
        data: {
          userId: userId,
          item: food,
        },
      });

      await this.viewCart();
    } catch (error) {
      console.error(error);
    }
  };

  viewCart = async () => {
    // switch to mouseover event after changing to stylized css div

    try {
      const { userId } = this.state;
      const response = await axios.get(
        `http://localhost:3000/api/cart/getCart/${userId}`
      );
      const cart = [];
      let subtotal = 0;
      for (var key in response.data) {
        let quantity = JSON.parse(response.data[key])[1];
        let price = JSON.parse(response.data[key])[0];
        subtotal += price * quantity;
        cart.push(
          <div key={key}>
            <div className={key}>
              {key} quantity: {quantity} price: ${price * quantity}
            </div>
            <div
              onClick={() => {
                this.deleteItem(key);
              }}
            >
              XX
            </div>
          </div>
        );
      }
      cart.push(<div key={subtotal}>Subtotal: {subtotal}</div>);
      cart.push(
        <button
          className="checkoutButton"
          key={'checkout'}
          onClick={this.checkout}
        >
          checkout
        </button>
      );
      this.setState({
        usersCart: cart,
        subTotal: subtotal,
        checkoutCartData: response.data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  checkout = async () => {
    //I need to send the cart also on the transactions components when they successfully create an account
    const { checkedOut } = this.state;
    this.setState({
      checkedOut: !checkedOut,
    });
  };

  handleForm = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  submitDeliveryAddress = async e => {
    e.preventDefault();
    try {
      const {
        address,
        currentBizId,
        currentBizName,
        longitude,
        latitude,
        userId,
      } = this.state;
      const geoCode = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            address: address,
            key: process.env.GOOGLE,
          },
        }
      );
      this.setState({
        latitude: geoCode.data.results[0].geometry.location.lat,
        longitude: geoCode.data.results[0].geometry.location.lng,
      });
      const createPool = await axios.post(
        `http://localhost:3000/api/pool/checkForExistingPoolThenAddUser`,
        {
          bizId: currentBizId,
          bizName: currentBizName,
          longitude: longitude,
          latitude: latitude,
          userId: userId,
          poolId: currentBizId + userId,
        }
      );

      createPool.data.addedPool === true
        ? alert('You joined an existing pool')
        : alert('You just created a pool');
      const { history } = this.props;
      const { email } = this.state;
      const body = {
        email,
      };
      const { data } = await axios.post(
        `http://localhost:3000/api/stripe/verifyStripeToken`,
        body
      );

      if (data === 'CreateAccount') {
        const { currentBizId, checkoutCartData } = this.state;
        try {
          await axios.post(`http://localhost:3000/api/cart/sendOrder`, {
            bizId: currentBizId,
            order: JSON.stringify(checkoutCartData),
            userId: JSON.parse(localStorage.storage).id,
            poolId: createPool.data.poolId,
          });
        } catch (error) {
          console.error('Error from Menu, checkout function -', error);
        }
        this.setState({
          usersCart: null,
        });
        history.push('/payment');
      } else {
        try {
          await axios.post(`http://localhost:3000/api/cart/sendOrder`, {
            bizId: currentBizId,
            order: JSON.stringify(checkoutCartData),
            userId: JSON.parse(localStorage.storage).id,
            poolId: createPool.data.poolId,
          });
        } catch (error) {
          console.error('Error from Menu, checkout function -', error);
        }
        this.setState({
          usersCart: null,
        });

        history.push('/messages');
      }
    } catch (err) {
      console.log('Error from Menu, checkout function -', err);
    }
  };

  render() {
    const {
      checkedOut,
      food,
      foods,
      usersCart,
      currentItem,
      currentItemQuantity,
    } = this.state;

    return (
      <div>
        {!checkedOut ? (
          <div>
            <ul>
              {food}
              {foods}
              <div className="defaultCart">
                {usersCart}
                {usersCart !== null ? (
                  <button
                    className="closeCartButton"
                    onClick={() => this.setState({ usersCart: null })}
                  >
                    <i className="fas fa-angle-double-left" />
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </ul>
            {currentItem === null ? (
              <div />
            ) : (
              <div className="menuCart">
                <div className="cartFoodItem">{currentItem}</div>
                <br />
                <button className="sub" onClick={() => this.adjustQuantity(-1)}>
                  -
                </button>
                <span>quantity: {currentItemQuantity}</span>
                <button className="add" onClick={() => this.adjustQuantity(1)}>
                  +
                </button>
                <br />
                <button className="addToCart" onClick={this.addToCart}>
                  add
                </button>
              </div>
            )}
            <div className="cartButton">
              <button onClick={this.viewCart}>
                <i className="fas fa-shopping-cart icon" />
              </button>
            </div>
          </div>
        ) : (
          <div className="deliveryAddContainer">
            <div className="profileHeader">
              <h3>delivery address:</h3>
            </div>
            <form onSubmit={this.submitDeliveryAddress}>
              <input
                name="address"
                placeholder="address"
                onChange={this.handleForm}
              />
              <input
                className="SubmitAddressButton"
                type="submit"
                value="submit"
              />
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default Menu;
