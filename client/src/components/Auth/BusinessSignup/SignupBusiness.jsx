import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userSignup } from '../../../actions/signupUsersActions.js';
import { getUserInfo } from '../../../actions/usersInformationAction.js';
import './BusinessSignup.scss';

const API_SERVER = process.env.API_SERVER;
const GOOGLE = process.env.GOOGLE;

class SignupBusiness extends Component {
  constructor() {
    super();
    this.state = {
      businessname: '',
      address: '',
      contactname: '',
      phone: '',
      email: '',
      password: '',
      foodcategory: '',
      type: 1,
      agree: false,
      latitude: 0,
      longitude: 0,
      foodcategory: 'type of cuisine',
    };
  }

  handleForm(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSignUpClick = async e => {
    e.preventDefault();
    const locations = this.state.address;
    const geoCode = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: locations,
          key: GOOGLE,
        },
      }
    );
    this.setState({
      latitude: geoCode.data.results[0].geometry.location.lat,
      longitude: geoCode.data.results[0].geometry.location.lng,
    });
    const {
      businessname,
      address,
      contactname,
      phone,
      email,
      password,
      foodcategory,
      type,
      latitude,
      longitude,
    } = this.state;
    const body = {
      businessname,
      address,
      contactname,
      phone,
      email,
      password,
      foodcategory,
      type,
      latitude,
      longitude,
      foodcategory,
    };
    try {
      const { data } = await axios.post(
        `${process.env.DOMAIN}/api/auth/signup`,
        body
      );

      localStorage.setItem(
        'storage',
        JSON.stringify({
          id: data.id,
          name: data.businessname,
          email: data.email,
          type: data.type,
          phone: data.phone,
          token: data.token.accessToken,
        })
      );
      this.props.getUserInfo({
        id: data.id,
        businessname: data.businessname,
        address: data.address,
        contactname: data.contactname,
        phone: data.phone,
        email: data.email,
        foodcategory: data.foodcategory,
        type: data.type,
      });
      data
        ? this.props.history.push('/dashboard')
        : alert('Request failed try again');
    } catch (err) {
      console.log(err);
    }
  };

  typeOfCuisineClickHandler(e) {
    e.preventDefault();
    this.setState({
      foodcategory: e.target.value.toLowerCase(),
    });
  }

  agreeToTerms() {
    this.setState(
      {
        agree: !this.state.agree,
      },
      () => {
        alert('I agree with the terms and conditions: ', this.state.agree);
      }
    );
  }

  render() {
    return (
      <div className="loginContainer">
        <div className="formContainer">
          <img className="logo" src="/foodie-logo2.png" />
          <form
            className="formStyle"
            onSubmit={this.handleSignUpClick.bind(this)}
          >
            <input
              name="businessname"
              placeholder="business name"
              onChange={this.handleForm.bind(this)}
            />
            <input
              name="address"
              placeholder="address"
              onChange={this.handleForm.bind(this)}
            />
            <input
              name="contactname"
              placeholder="contact name"
              onChange={this.handleForm.bind(this)}
            />
            <input
              name="phone"
              placeholder="phone"
              onChange={this.handleForm.bind(this)}
            />
            <input
              name="email"
              placeholder="email"
              onChange={this.handleForm.bind(this)}
            />
            <input
              name="password"
              type="password"
              placeholder="password"
              onChange={this.handleForm.bind(this)}
            />

            <div className="typeFoodCategoryBtn">
              <select
                value={this.state.value}
                onChange={this.typeOfCuisineClickHandler.bind(this)}
              >
                <option selected disable hidden value="">
                  type of cuisine
                </option>
                <option value="American">American</option>
                <option value="Asian">Asian</option>
                <option value="Bakery">Bakery</option>
                <option value="BBQ">BBQ</option>
                <option value="Cajun">Cajun</option>
                <option value="Caribbean">Caribbean</option>
                <option value="Chinese">Chinese</option>
                <option value="Halal">Halal</option>
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Mediterrean">Mediterrean</option>
                <option value="Mexican">Mexican</option>
                <option value="Russian">Russian</option>
                <option value="Vegetarian">Vegetarian</option>
              </select>
            </div>
            <input
              className="checkTerms"
              type="checkBox"
              name="agree"
              onChange={this.agreeToTerms.bind(this)}
            />
            <label>I agree to the terms and conditions</label>
            <input className="signupButton" type="submit" value="signup" />
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  //Still working in making the post request as an action for signup
  usersData: state.usersData,
  // getUsersInformation gets the users information name, email, id etc
  getUsersInformation: state.getUsersInformation,
});
const matchDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getUserInfo: getUserInfo,
      userSignup: userSignup,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  matchDispatchToProps
)(SignupBusiness);
