import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import * as project from "./project.js";

const url =
  "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pokedex: [] };
  }

  componentDidMount() {
    let fetched = fetchData(url);
    let processed = fetched.then(data => project.process(data));

    processed.then(data => {
      this.setState({
        pokedex: data,
        selected: project.selected(data)
      });
    });
  }

  render() {
    let { pokedex, selected } = this.state;
    return <Page pokedex={pokedex} selected={selected} />;
  }
}

const Page = props => {
  return (
    <div className="App">
      <h1>
        <img
          className="logo"
          alt="logo"
          src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"
        />
      </h1>

      <SelectedIfDefined selected={props.selected} />
      <CardsIfDefined pokedex={props.pokedex} />
    </div>
  );
};

const SelectedIfDefined = props => {
  const selectedCard = () => (
    <div className="selected">
      <Card item={props.selected} />
      <caption className="text">❤️ {props.selected.name_en}</caption>
    </div>
  );

  return props.selected ? selectedCard() : null;
};

const CardsIfDefined = props => {
  return props.pokedex ? (
    <Cards pokedex={props.pokedex} />
  ) : (
    <p>Start the project by beginning with project.js...</p>
  );
};

const Cards = props => {
  let cards = props.pokedex.map(item => <Card key={item.code} item={item} />);
  return <div className="cards">{cards}</div>;
};

const Card = ({ item }) => {
  let code = item.code || "???";
  let name_en = item.name_en || "[Missing]";
  let name_jp = item.name_jp || "行方不明";
  let kind = item.kind || "none";
  let stats = item.stats || {};
  let url = item.code
    ? `http://kwfiles.blob.core.windows.net/pokemon/${code}.png`
    : "missing.png";
  // Original: `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${code}.png`

  return (
    <div className={["card", kind].join(" ")}>
      <div className="name">
        <span className="name-en">{name_en}</span>
        <span className="name-jp">{name_jp}</span>
      </div>
      <div className="image">
        <span className="code">{code}</span>
        <img alt="pokemon" src={url} />
      </div>
      <table>
        <tbody>
          <Stat name="Health" kind={kind} value={stats.health} />
          <Stat name="Attack" kind={kind} value={stats.attack} />
          <Stat name="Defense" kind={kind} value={stats.defense} />
          <Stat name="Speed" kind={kind} value={stats.speed} />
        </tbody>
      </table>
    </div>
  );
};

const Stat = props => {
  let { name, kind, value } = props;
  return (
    <tr className={kind}>
      <td>{name}</td>
      <td>{value || "?"}</td>
    </tr>
  );
};

const fetchData = url => {
  console.log(`Fetching data: ${url}`);

  return fetch(url, {
    headers: { Accept: "application/json" }
  })
    .then(response => {
      if (response.ok) {
        console.log("...fetched data");
        return response.json();
      } else {
        throw new Error("Could not fetch from URL");
      }
    })
    .catch(error => console.log(error));
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
