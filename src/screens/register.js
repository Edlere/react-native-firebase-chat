import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native'
import PhoneInput from 'react-native-phone-input'
import { inject } from 'mobx-react'
import * as Animatable from 'react-native-animatable'

import style from '../theme/index'
import colors from '../theme/colors'
@inject('User')
export default class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countryCode: '+51',
      phoneNumber: ''
    }
    this.screenWidth = Dimensions.get('window').width
  }

  componentDidMount() {
    this.setState({ countryCode: this.phone.getCountryCode() })
    // this.phone.focus()
  }

  render() {
    return (
      <View style={style.container}>
        <Image
          source={require('../img/register-bg.png')}
          style={{
            width: this.screenWidth,
            position: 'absolute',
            bottom: 0
          }}
        />
        <Animatable.View
          ref={inst => (this.content = inst)}
          style={style.content}
          animation={'flipInX'}
        >
          <Text style={style.verifyText}>Verifica tu número</Text>
          <Text style={style.smsText}>{"Recibirás un código vía SMS"}</Text>
          <PhoneInput
            ref={instance => (this.phone = instance)}
            style={{
              backgroundColor: colors.white,
              marginTop: 32,
              padding: 8,
              borderColor: colors.border,
              borderWidth: 0.5,
              elevation: 8
            }}
            initialCountry={'pe'}
            textStyle={{ fontSize: 18, color: colors.text }}
            flagStyle={{ height: 32, width: 42 }}
            onChangePhoneNumber={phoneNumber =>
              this.setState({ phoneNumber: phoneNumber })
            }
            textProps={{
              value: this.state.phoneNumber
            }}
            onSelectCountry={() =>
              this.setState({ countryCode: this.phone.getCountryCode() })
            }
          />
          <Text style={style.signinText}>
            Registrandote aceptas los términos del curso :D{' '}
            {<Text style={style.termsText}>Términos &amp; Condiciones</Text>}
          </Text>
          <TouchableOpacity
            style={style.nextButton}
            onPress={() => this.sendOTP()}
          >
            <Text style={style.footerButtonText}>Enviar código</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    )
  }

  sendOTP() {
    this.content.flipOutX(400).then(async () => {
      const _phoneNumber = '+' + this.state.countryCode + this.state.phoneNumber
      const isConfirm = await this.props.User.auth(_phoneNumber)
      if (isConfirm) {
        this.props.navigation.replace('Verify')
      }
    })
  }
}
