import React from "react";
const bcrypt = require('bcryptjs');

export default class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      input1: "",
      input2: "",
      output: "",
      password: "",
      error: false,
      loggedIn: false
    };
    
    this.handleInput1Change = this.handleInput1Change.bind(this);
    this.handleInput2Change = this.handleInput2Change.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  handleInput1Change(event) {
    this.setState({ input1: event.target.value.toUpperCase() });
  }

  handleInput2Change(event) {
    this.setState({ input2: event.target.value.toUpperCase() });
  }

  hexXOR(hex1, hex2) {
    var temp = 0;
    let xor = "";
    let bytes = []
    for (let i = 0; i < hex1.length; i += 2) {
      temp = parseInt(hex1.substr(i, 2), 16);
      for(let j = 0; j < hex2.length; j += 2) {
        temp ^= parseInt(hex2.substr(j, 2), 16);        
      }      
      console.log(temp);
      bytes.push(temp);      
    }

    for(let counter = 0; counter < 4; counter++){
      var operatorA = (Math.floor(bytes[counter] / 10)) > 0 ? Math.floor((bytes[counter] / 10)) : 1;
		  var operatorB = (Math.floor(bytes[3 - counter] % 10)) > 0 ? Math.floor((bytes[3 - counter] % 10)) : 1;
      bytes[counter] = operatorA * operatorB;
      console.log(temp);
      xor += bytes[counter] < 10 ? "0" + bytes[counter].toString() : bytes[counter].toString();
    }    

    return xor;
  }


  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      output: this.hexXOR(this.state.input1, this.state.input2)
    });
  }

  onLogin(event) {
    event.preventDefault();

    const result = bcrypt.compareSync(this.state.password, "$2a$12$eBEYrzERmt6iMVFOpb0pkONLW6xFHIMqt8U00wtJTATqzU3CVYVqS");
    
    if(result){
      this.setState({
        loggedIn: true
      });
    }else{
      this.setState({
        error: true
      });
    }

    this.setState({
      password: ""
    })
  }

  render() {
      return (
        this.state.loggedIn ?
          <div>
            <form onSubmit={this.handleSubmit}>
              <label>
                Token:
                <input
                  type="text"
                  value={this.state.input1}
                  onChange={this.handleInput1Change}
                />
              </label>
              <label>
                Código NAV:
                <input
                  type="text"
                  value={this.state.input2}
                  onChange={this.handleInput2Change}
                />
              </label>
              <label>
                Chave:
                <output>{this.state.output}</output>
              </label>
              <input type="submit" value="Calcular" />
            </form>
          </div>
         : 
          <div>
            <form onSubmit={this.onLogin}>
              <label>
                Senha de acesso:
                <input
                  type="password"
                  value={this.state.password}
                  onChange={e => {
                    this.setState({ password: e.target.value });
                  }}
                />
              </label>
              {
                this.state.error ?
                  <label>
                    Aviso:
                    <output>{"Senha Incorreta!"}</output>
                  </label>
                  :
                  ""
              }              
              <input type="submit" value="Entrar" />
            </form>
          </div>
        
      );
  }
}
