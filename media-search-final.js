var pageTitleStyle = {
    backgroundImage: 'url("http://jmvtestsite.com/wp-content/uploads/2016/07/texture.jpg")',
    position: "fixed",
    height: "100%",
    width: "100%",
    fontFamily: "Arial",
    fontSize: "14px",
    fontWeight: "bold",
    WebkitTransition: 'all',
    msTransition: 'all'
 };

var titleStyle = {
    border: "2px solid purple",
    display: "inline-block",
    marginTop: "50px",
    marginLeft: '50px',
    fontFamily: "Righteous",
    fontSize: "14px",
    padding: '15px',
    WebkitTransition: 'all',
    msTransition: 'all'
 };

var listStyle = {
    display: "block",
    fontSize: "18px",
    marginLeft: '75px',
    WebkitTransition: 'all',
    msTransition: 'all'
 };

var element1 = {
  display: "inline-block",
  marginRight: "25px",
 };
var element2 = {
    display: "inline-block",
    float: "right",
 };

const omdb = function omdb(query) {
  return $.ajax({
    url: "http://www.omdbapi.com/",
    // The name of the callback parameter, as specified by the YQL service
    jsonp: "callback",
    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",
    // Tell YQL what we want and that we want JSON
    data: Object.assign({}, { r: "json" }, query)
  })
};
///need onChange to get value of input
//this.handleSearchInputChange
class MediaSearchInput extends React.Component {
    render() {
      return (
        <label> Media  Search:
        <input type="text" placeholder="Enter search term" onChange={this.props.onSearchInputChange}/>
        </label>
      );
    }
  };
//need onClick or onSubmit here
//this.handleSubmitButtonClickn - create this function to handle the submit stuff
  class MediaSubmitButton extends React.Component {
      render() {
        return (
         <input type="button" onClick={this.props.onSubmitButtonClick} value="Submit" />
        );
      }
    };

class MediaItem extends React.Component {
  render() {
    var url = `http://www.imdb.com/title/${this.props.id}`
    return (
      <div>
        <span style={element1}> <a href={url}> {this.props.title} </a>  </span>
        <span style={element2}>{this.props.type}   </span>
      </div>
    );
  }
}


class MediaList extends React.Component {
  render() {
    return (
      <div style={titleStyle}>
        <h3>List of media  titles and types</h3>
        {this.props.media.map(function(item){
            return (
              <MediaItem title={item.Title} type={item.Type}  id={item.imdbID}/>
            )
        })}
      </div>
    );
  }
}

class GetMedia extends React.Component {
  //constructor only gets executed once
    constructor(props) {  //allows you to set the initial state of the component
      super(props);
      this.state={
        media: []    //this is the initial state, needs to be empty at first
      }
//      this.getOneMedia(this.props.query);  //calls once  handled by the button click
    }
  getOneMedia(query){  //put it in a function so that it only gets called once

    omdb({s: query}).then((response) => {
      if (response && response.Response === "True") {

        this.setState({media: response.Search});   ///media comes back with reponse data in an array
      } else if (response && response.Response === "False") {
        this.setState({media: null});
      } else {
        console.error('Unknown error connecting to omdbapi.');
      }
    });
}
//make sure don't keep picking up input box if it hasn't changed
// shouldComponentUpdate(nextProps, nextState) {
//   if ((this.props.query === nextProps.query) && (this.state.media.length > 0)) {
//     return false;
//   } else {
//     return true;
//   }
// }

//if the query changed, call getOneMedia
componentWillReceiveProps (nextProps){
  if (this.props.query !== nextProps.query){
    this.getOneMedia(nextProps.query);
  }
}


//react calls render over and over again by the brower when it refreshes
  render() {
    if (this.state.media !== null) {
    return (
      <div>
        <MediaList media={this.state.media}/>
      </div>
    );
    } else {
          return (
      <div>
        No results found
      </div>
    );
    }
  }
};


class App extends React.Component {
  constructor(props) {   //this handles the intital state of the query
    super(props);
    this.state = {
      query: "",
      searchQueryValue:''
    }
  }
  handleSubmitButtonClick(e) {   //method
         //go get more data e.target.value
         //set state, use bind below to insure we get the right value for this
  //set state to new query
    this.setState({query: this.state.searchQueryValue});
  }
  handleSearchInputChange(e){
    //we have a value
    console.log(e.target.value);
    //call another function which actually changes the state being sent into getMedia (fetcher)
    this.setState({searchQueryValue: e.target.value});
  }
  render() {
    return (
      <div style={pageTitleStyle}>
        <h3>Input your favorite media (movie, TV show, etc.) title. Click on title to go to the imdb page.</h3>
        <MediaSearchInput onSearchInputChange={this.handleSearchInputChange.bind(this)}/>
        <MediaSubmitButton onSubmitButtonClick={this.handleSubmitButtonClick.bind(this)}/>
        <GetMedia query={this.state.query}/>
      </div>
    );
  }
};

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
