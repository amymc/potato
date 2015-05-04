var React = require('react'),
    moment = require('moment');


var ProductRow = React.createClass({displayName: "ProductRow",

    handleClick: function() {
        var selectedImg = this.props.image,
            selectedAuthor = this.refs.author.props.children,
            selectedDate = this.refs.date.props.children.join('');

        this.props.onUserClick(selectedImg, selectedAuthor, selectedDate);
    },

    render: function() {

        var date = moment(this.props.image.published).format("Do MMM YYYY, HH:mm");
        var splitDate =date.split(',');

        //split the author info at '(' and ')'
        var author = (this.props.image.author).split(/[()]/);
        
        return (
            React.createElement("tr", {className: "image-row"}, 
                React.createElement("td", null, React.createElement("img", {className: "image z-depth-1", src: this.props.image.media.m, onClick: this.handleClick.bind(this, this.refs)})), 
                React.createElement("td", {className: "image-details"}, 
                    React.createElement("span", {className: "image-title truncate", onClick: this.handleClick.bind(this, this.refs)}, this.props.image.title), 
                    React.createElement("span", {ref: "date", className: "published-date"}, "Published: ", splitDate[0], " at ", splitDate[1]), 
                    React.createElement("a", {ref: "author", className: "img-author-link", href: "http://www.flickr.com/photos/"+ this.props.image.author_id}, author[1]), 
                    React.createElement("a", {className: "img-detail-link", href: this.props.image.link}, "View on Flickr")
                )
            )
        );
    }
});

var ProductTable = React.createClass({displayName: "ProductTable",

    getInitialState: function() {
        return {
            selectedImg: '',
        };
    },

   handleUserClick: function(selectedImg, selectedAuthor, selectedDate) {
        this.props.receiveSelectedImg(selectedImg, selectedAuthor, selectedDate);
    },

    render: function() {
        var rows = [];
        this.props.images.forEach(function(image) {
            if (image.tags.indexOf(this.props.filterText) == -1) {
                return;
            }
            rows.push(React.createElement(ProductRow, {image: image, key: image.title, onUserClick: this.handleUserClick}));
        }.bind(this));
        //if rows array is empty show no-results-msg, else show table
        return ( rows.length < 1 ? React.createElement("div", {className: "no-results-msg"}, "There were no matches for your search. Try again! ") :
            React.createElement("table", {className: "responsive-table hoverable"}, 
                React.createElement("tbody", null, rows)
            )
        );
    }
});

var SearchBar = React.createClass({displayName: "SearchBar",

    handleChange: function() {
        this.props.onUserInput(
            this.refs.filterTextInput.getDOMNode().value
        );
    },
    render: function() {
        return (
            React.createElement("form", null, 
                React.createElement("div", {className: "input-field"}, 
                    React.createElement("i", {className: "mdi-action-search prefix"}), 
                    React.createElement("input", {
                        type: "text", 
                        id: "search", 
                        ref: "filterTextInput", 
                        //calls handleChange when it detects user input
                        onChange: this.handleChange}
                    ), 
                    React.createElement("label", {htmlFor: "search"}, "Search")
                )
            )
        );
    }
});

var ImageDetail = React.createClass({displayName: "ImageDetail",

    handleBackBtn: function(){
        this.props.goBack();
    },
    
    render: function() {
        return (
            React.createElement("div", {className: "image-detail"}, 
                React.createElement("button", {className: "waves-light btn", onClick: this.handleBackBtn}, "Back"), 
                React.createElement("img", {className: "z-depth-1", src: this.props.selectedImg.media.m}), 
                React.createElement("div", {className: "image-details"}, 
                    React.createElement("a", {className: "image-title", href: this.props.selectedImg.link}, this.props.selectedImg.title), 
                    React.createElement("span", {className: "published-date"}, this.props.selectedDate), 
                    React.createElement("a", {href: "http://www.flickr.com/photos/"+ this.props.selectedImg.author_id}, this.props.selectedAuthor), 
                    React.createElement("span", {className: "tags"}, "Tags: ", this.props.selectedImg.tags), 
                    React.createElement("p", {className: "description"}, 
                        "Hey, relax man, I'm a brother shamus. Dolor sit amet, consectetur adipiscing elit praesent. Can we just rent it from you? Ac magna justo pellentesque ac lectus quis elit blandit. Yeah. Roadie for Metallica. Speed of Sound Tour. Fringilla a ut turpis praesent felis ligula, malesuada suscipit malesuada non, ultrices. D'ya have a good sarsaparilla? Non urna sed orci ipsum, placerat id. That is our most modestly priced receptacle. Condimentum rutrum, rhoncus ac lorem aliquam placerat posuere neque, at." + ' ' +

"You're going to enter a world of pain, son. We know that this is your homework. We know you stole a car. Dignissim magna ullamcorper in aliquam sagittis. I know how he likes to present himself; Father's weakness is vanity. Hence the slut. Massa ac tortor ultrices faucibus. Mr. Lebowski asked me to repeat that: Her life is in your hands. Curabitur eu mi sapien, ut ultricies ipsum morbi eget risus."
                    ), 
                    React.createElement("div", {className: "g-plusone", "data-href": this.props.selectedImg.media.m})
                )
            )
        );
    }

});

var App = React.createClass({displayName: "App",

    getInitialState: function() {
        return {
            filterText: '',
            selectedImg: '',
            selectedDate: '',
            selectedAuthor: '',
            data: []
        };
    },

    loadImages: function() {
        $.ajax({
            url: "https://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json&jsoncallback=?",
            dataType: 'jsonp',
            jsonp: "callback",
            data: {
                format: "json"
            },
            success: function(data) {
                this.setState({data: data.items});
                console.log(data);
                }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
                }.bind(this)
        });
    },

      // Invoked once after the first render
    componentDidMount: function() {
        this.loadImages();
    },

    handleUserInput: function(filterText) {
        //setState method indicates that a change has been made 
        //and that it's time for the UI to redraw.
        //redefines filterText to be what user has just typed in
        this.setState({
            filterText: filterText
        });
    },

   handleSelectedImg: function(selectedImg, selectedAuthor, selectedDate) {
        this.setState({
            selectedImg: selectedImg,
            selectedAuthor: selectedAuthor,
            selectedDate: selectedDate
        });
    },

    returnHome: function(selectedImg) {
        this.setState({
            selectedImg: ''
        });
    },

    render: function() {
        //if state.selectedImg is not null show ImageDetail, else show SearchBar and ProductTable
        return ( this.state.selectedImg ? 
            React.createElement(ImageDetail, {
                selectedImg: this.state.selectedImg, 
                selectedAuthor: this.state.selectedAuthor, 
                selectedDate: this.state.selectedDate, 
                goBack: this.returnHome})
                :
            React.createElement("div", null, 
                React.createElement(SearchBar, {
                    filterText: this.state.filterText, 
                    onUserInput: this.handleUserInput}
                ), 
                React.createElement(ProductTable, {
                    images: this.state.data, 
                    filterText: this.state.filterText, 
                    receiveSelectedImg: this.handleSelectedImg}
                )
            )
        );
    }
});


React.render(React.createElement(App, null), document.getElementById('app'));

