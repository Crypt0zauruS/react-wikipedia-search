import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FlipMove from "react-flip-move";
import wikimage from "./wikipedia.png";

function App() {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lang, setLang] = useState(false);
  const [loading, setLoading] = useState(false);

  const langEn = {
    button: "FR 🇫🇷",
    language: "en",
    search: "Search",
    placeholder: "Enter your search term",
    random: "Random Article",
    clear: "Clear results",
    results: "Search results",
    noResults: "No results found",
    more: "More about",
  };

  const langFr = {
    button: "EN 🇺🇸",
    language: "fr",
    search: "Recherche",
    placeholder: "Entrez votre recherche",
    random: "Article aléatoire",
    clear: "Effacer",
    results: "Votre recherche",
    noResults: "Aucun résultat",
    more: "Plus d'informations sur",
  };

  const langChoice = lang ? langFr : langEn;

  const baseUrl = `https://${langChoice.language}.wikipedia.org/w/api.php?action=query&format=json&exintro&explaintext`;

  const handleLanguage = () => {
    setLang(!lang);
    setResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.length > 0) {
      mediaWikiSearch(searchTerm);
      setSearchTerm("");
    }
  };

  const handleRandom = () => {
    setSearchTerm("");
    setResults([]);
    setLoading(true);
    axios
      .get(
        `${baseUrl}&generator=random&grnnamespace=0&prop=extracts&exchars=500&origin=*`
      )
      .then((response) => {
        setLoading(false);
        setResults([
          response.data.query.pages[Object.keys(response.data.query.pages)],
        ]);
      })
      .catch(() => {
        console.log("error");
      });
  };

  const mediaWikiSearch = (searchTerm) => {
    setResults([]);
    setLoading(true);
    const url = `${baseUrl}&list=search&utf8=1&srsearch=${searchTerm}&origin=*`;

    axios
      .get(url)
      .then((response) => {
        setLoading(false);
        response.data.query.search.length > 0
          ? setResults(response.data.query.search)
          : setResults([langChoice.noResults]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      <div className="container">
        <img className="logo" src={wikimage} alt="wikipedia logo" />
        <div>
          <h1 className="text-center display-4 wiki" style={{ margin: "20px" }}>
            Wikipedia <i className="fa-solid fa-magnifying-glass"></i>
          </h1>

          <button
            className="btn btn-primary lang"
            onClick={handleLanguage}
            type="button"
          >
            {langChoice.button}
          </button>
        </div>
        <form>
          <div className="input-group mb-3 mx-auto" style={{ width: "60%" }}>
            <input
              style={{ fontSize: "1em" }}
              className="form-control"
              type="text"
              placeholder={langChoice.placeholder}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              autoFocus
            />

            <button
              style={{ minWidth: "60px", fontSize: "1em" }}
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleSubmit}
            >
              {langChoice.search}
            </button>
          </div>
        </form>

        <button
          style={{ minWidth: "150px", fontSize: "1em" }}
          className="btn btn-outline-secondary"
          onClick={handleRandom}
          type="button"
        >
          {langChoice.random}
        </button>
        <button
          style={{ minWidth: "150px", fontSize: "1em" }}
          className="btn btn-outline-secondary ms-5"
          onClick={() => setResults([])}
          type="button"
        >
          {langChoice.clear}
        </button>

        <div id="articles">
          {loading && (
            <div>
              <hr />
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
              <hr />
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <hr />
              <h3>{langChoice.results}</h3>
              <hr />
            </div>
          )}

          <ul className="list-group">
            <FlipMove>
              {results.map((result, index) => {
                const url = result.pageid
                  ? `https://${langChoice.language}.wikipedia.org/w/index.php?curid=${result.pageid}`
                  : null;
                return (
                  <li className="list-group-item bg-light" key={index}>
                    <h5>{result.title ? result.title : results[0]}</h5>
                    {result.snippet ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: result.snippet }}
                      />
                    ) : (
                      <div> {result.extract && result.extract} </div>
                    )}
                    <a
                      className="link-success text-decoration-none"
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result.title && langChoice.more}{" "}
                      {result.title && result.title}
                    </a>
                  </li>
                );
              })}
            </FlipMove>
          </ul>
        </div>
      </div>

      <div className="footer">
        &copy; Copyright by Crypt0zauruS
        <h1>
          Follow me on{" "}
          <a
            className="github"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/Crypt0zauruS"
          >
            <i className="fab fa-github"></i>
          </a>
        </h1>
      </div>
    </div>
  );
}

export default App;
