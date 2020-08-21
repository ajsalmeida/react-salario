import React from 'react';
import ReadOnlyInput from './components/ReadOnlyInput';
import Bar from './components/Bar';
import './index.css';


function formatCurrency(number) {
  return (new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number));
}

function getCalculationsFrom(value) {
  let baseINSS = value;
  let discountINSS = 0;
  let baseIRPF = 0;
  let discountIRPF = 0;
  let liquid = 0;
  let restante = 0;
  let percentINSS = 0;
  let percentIRPF = 0;
  let percentLiquid = 0;

  //calculo INSS (Calculo progressivo)
  if (value === 1045) {//Salário mínimo: R$ 1.045,00-7,5%
    discountINSS = value * 0.075;
  }

  if (value > 1045 && value <= 2089.60) {//De R$ 1.045,01 a R$ 2.089,60-9%
    discountINSS = 1045 * 0.075;
    restante = value - 1045;
    discountINSS += restante * 0.09;
  }

  if (value > 2089.60 && value <= 3134.40) {//De R$ 2.089,61 a R$ 3.134,40-12%
    discountINSS = 1045 * 0.075;
    discountINSS += (2089.60 - 1045) * 0.09;
    restante = value - 2089.60;
    discountINSS += restante * 0.12;
  }

  if (value > 3134.40 && value <= 6101.06) {//De R$ 3.134,41 a R$ 6.101,06-14% 
    discountINSS = 1045 * 0.075;
    discountINSS += (2089.60 - 1045) * 0.09;
    discountINSS += (3134.40 - 2089.60) * 0.12;
    restante = value - 3134.40;
    discountINSS += restante * 0.14;

  }
  if (value > 6101.06) {//acima dos 6101,06 = tira 713.10
    discountINSS = 713.10;

  }
  liquid = value - discountINSS;//valor do salário líquido parcial é o total + desconto INSS acumulado
  baseIRPF = value - discountINSS;// e a base para o IRPF é o que sobrou depois do desconto do INSS
  //calculo IRPF

  //Até 1.903,98	              0%	          0,00 - nao precisa calcular

  // De 1.903,99 até 2.826,65	  7,5%	        142,80
  if (baseIRPF >= 1903.99 && baseIRPF <= 2826.65) {
    discountIRPF = (baseIRPF * 0.075) - 142.80;
  }

  // De 2.826, 66 até 3.751, 05	  15 % 354, 80
  if (baseIRPF >= 2826.66 && baseIRPF <= 3751.05) {
    discountIRPF = ((baseIRPF * 0.15) - 354.80);
  }
  //  De 3.751, 06 até 4.664, 68	  22, 5 % 636, 13
  if (baseIRPF >= 3751.06 && baseIRPF <= 4664.68) {
    discountIRPF = (baseIRPF * 0.225) - 636.13;
  }

  //Acima de 4.664, 69	          27, 5 % 869, 36
  if (baseIRPF >= 4644.69) {
    discountIRPF = (baseIRPF * 0.275) - 869.36;
  }

  liquid = liquid - discountIRPF; // calcula o liquido final apos 

  //calculando as porcentagens dos descontos e do liquido com relação ao valor digitado
  percentINSS = ((discountINSS / value) * 100);
  percentIRPF = ((discountIRPF / value) * 100);
  percentLiquid = ((liquid / value) * 100);

  baseINSS = formatCurrency(baseINSS);
  discountINSS = formatCurrency(discountINSS);
  if (!isNaN(percentINSS)) {
    discountINSS += "(" + percentINSS.toFixed(2) + "%)";
  }

  baseIRPF = formatCurrency(baseIRPF);
  discountIRPF = formatCurrency(discountIRPF);
  if (!isNaN(percentIRPF)) {
    discountIRPF += "(" + percentIRPF.toFixed(2) + "%)";
  }

  liquid = formatCurrency(liquid);
  if (!isNaN(percentLiquid)) {
    liquid += "(" + percentLiquid.toFixed(2) + "%)";
  }

  return { baseINSS, discountINSS, baseIRPF, discountIRPF, liquid, percentINSS, percentIRPF, percentLiquid };
}
export default class App extends React.Component {
  constructor() {
    super();
    //cria variaveis de numeros e inputs
    this.state = {
      number: 0,
      calculations: {
        baseINSS: 0,
        discountINSS: 0,
        baseIRPF: 0,
        discountIRPF: 0,
        liquid: 0,
        percentINSS: 0,
        percentIRPF: 0,
        percentLiquid: 0
      }
    }
  }

  handleInputChange = (event) => {
    const newNumber = Number(event.target.value);
    this.setState({ number: newNumber });
  }
  componentDidUpdate(_, previousState) {
    const { number: oldNumber } = previousState;
    const { number: newNumber } = this.state;
    if (oldNumber !== newNumber) {
      const calculations = getCalculationsFrom(this.state.number);
      this.setState({ calculations });
    }

  }

  render() {
    const { number, calculations } = this.state;
    const { baseINSS, discountINSS, baseIRPF, discountIRPF, liquid, percentINSS, percentIRPF, percentLiquid } = calculations;
    return (
      <div className="all" >
        <h1>React Salário</h1>
        <label>
          <h3>Salário Bruto</h3>
          <input className="inputSalary" type='number'
            value={number}
            onChange={this.handleInputChange}
            placeholder="Salário Bruto" />
        </label>
        <div className="inputsData">
          <ReadOnlyInput label='Base INSS:' value={baseINSS} />
          <ReadOnlyInput label='Desconto INSS:' value={discountINSS} color="#ffd166" />
          <ReadOnlyInput label='Base IRPF:' value={baseIRPF} />
          <ReadOnlyInput label='Desconto IRPF:' value={discountIRPF} color="#ef476f" />
          <ReadOnlyInput label='Líquido:' value={liquid} color="#06d6a0" />
        </div>
        <div className="bars">
          <Bar value={percentINSS.toFixed(2)} color="#ffd166"></Bar>
          <Bar value={percentIRPF.toFixed(2)} color="#ef476f"></Bar>
          <Bar value={percentLiquid.toFixed(2)} color="#06d6a0"></Bar>
        </div>
      </div>

    );
  }
}

