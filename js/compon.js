        function compareId(A, B) {
            return A[0] - B[0];
        }
        function comparePrice(A, B) {
            return A[2] - B[2];
        }
        function compareQuantity(A, B) {
            return A[3] - B[3];
        }
        function compareName(A, B) {
            if (A[1].toLowerCase() > B[1].toLowerCase()) {
                 return 1;
            }
            if (A[1].toLowerCase() < B[1].toLowerCase()) {
                 return -1;
             }
             return 0;
        }

        var Row = React.createClass({
            getInitialState: function () {
                return {
                    clickOnItem: false,
                    objProp: ""
                }
            },
            clickOnItem: function(e) {
                console.log(this.props);
                var objProp = JSON.stringify(this.props);
                console.log(objProp);
                this.setState({clickOnItem: !this.state.clickOnItem,
                    objProp:objProp});
            },
            render: function() {
                return (
                    <tr onClick={this.clickOnItem}>
                        <td>{this.props.id}</td>
                        <td>{this.props.name}</td>
                        <td>{this.props.price}</td>
                        <td>{this.props.quantity}</td>
                        <td className={!this.state.clickOnItem ? "hide": "absol"}>{this.state.objProp}</td>
                    </tr>
                )
            }

        })

        var App = React.createClass({
            componentWillMount: function() {
                var arrProp = [];
                for (var key in this.state.arrProp) {
                    arrProp.push(this.state.arrProp[key]);
                }
                var firstCol = arrProp[0];
                var secondCol = arrProp[1];
                var thirdCol = arrProp[2];
                var fourthCol = arrProp[3];
                this.setState({firstCol: firstCol, secondCol: secondCol, thirdCol: thirdCol, fourthCol: fourthCol});
            },
            getInitialState: function() {
                var dataArr = this.props.dataBase;

                var arrProp = dataArr.shift();
                return {
                    dataDisplayed: dataArr,
                    firstCol: "",
                    secondCol: "",
                    thirdCol: "",
                    fourthCol: "",
                    sortById: true,
                    sortByName: false,
                    sortByPrice: false,
                    sortByQuantity: false,
                    arrProp: arrProp,
                };
            },
            handleSearch: function(event) {
                var searchQuery = event.target.value.toLowerCase();
                var dataDisplayed = this.props.dataBase.filter(function(el, index) {
                    console.log(el instanceof Array);
                    if ( el instanceof Array) {
                        var searchValue = el[1].toLowerCase();
                        var searchValue1 = el[2];
                        var searchValue2 = el[3] + "";
                        var searchValue3 = el[0] + "";
                        return ((searchValue.indexOf(searchQuery) !== -1) || (searchValue1.indexOf(searchQuery) !== -1) 
                            || (searchValue2.indexOf(searchQuery) !== -1) || (searchValue3.indexOf(searchQuery) !== -1));
                    }
                    });
                console.log(dataDisplayed);
                this.setState({dataDisplayed: dataDisplayed});
            },
            btnSortById: function() {
                var dataDisplayedSortById = (dataDisplayedSortById||this.state.dataDisplayed);
                if (dataDisplayedSortById.length > 1) {
                    dataDisplayedSortById = (!this.state.sortById) ? dataDisplayedSortById.sort(compareId) : 
                    dataDisplayedSortById.sort(compareId).reverse();
                }
                this.setState({
                    displayedContacts: dataDisplayedSortById, sortById: !this.state.sortById
                });
            },
            btnSortByName: function(){
                var dataDisplayedSortByName = (dataDisplayedSortByName||this.state.dataDisplayed);
                if (dataDisplayedSortByName.length > 1) {
                    dataDisplayedSortByName = (!this.state.sortByName) ? dataDisplayedSortByName.sort(compareName).reverse() :
                        dataDisplayedSortByName.sort(compareName);
                }
                this.setState({
                    displayedContacts: dataDisplayedSortByName, sortByName: !this.state.sortByName
                });
            },
            btnSortByPrice: function() {
                var dataDisplayedSortByPrice = (dataDisplayedSortByPrice||this.state.dataDisplayed);
                if (dataDisplayedSortByPrice.length > 1) {
                    dataDisplayedSortByPrice = (!this.state.sortByPrice) ? dataDisplayedSortByPrice.sort(comparePrice).reverse() : 
                        dataDisplayedSortByPrice.sort(comparePrice);
                }
                this.setState({
                    displayedContacts: dataDisplayedSortByPrice, sortByPrice: !this.state.sortByPrice
                });
            },
            btnSortByQuantity: function() {
                var dataDisplayedSortByQuantity = (dataDisplayedSortByQuantity||this.state.dataDisplayed);
                if (dataDisplayedSortByQuantity.length > 1) {
                    dataDisplayedSortByQuantity = (!this.state.sortByQuantity) ? dataDisplayedSortByQuantity.sort(compareQuantity).reverse() : 
                        dataDisplayedSortByQuantity.sort(compareQuantity);
                }
                this.setState({
                    displayedContacts: dataDisplayedSortByQuantity, sortByQuantity: !this.state.sortByQuantity
                });
            },
            render: function() {
                return (
                    <div className="table-responsive">
                            <input type="text" onChange={this.handleSearch} className="form-control" placeholder="search"/>
                            <table className="table">
                                <thead>
                                    <tr className="sortingItem">
                                        <th onClick={this.btnSortById}>{this.state.firstCol}</th>
                                        <th onClick={this.btnSortByName}>{this.state.secondCol}</th>
                                        <th onClick={this.btnSortByPrice}>{this.state.thirdCol}</th>
                                        <th onClick={this.btnSortByQuantity}>{this.state.fourthCol}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.dataDisplayed.map(function(el, i) {
                                            if ( el instanceof Array ) {
                                                return <Row 
                                                    key={i}
                                                    id={el[0]}
                                                    name={el[1]}
                                                    price={el[2]}
                                                    quantity={el[3]}
                                                />;
                                            }
                                       })
                                    }
                                </tbody>
                            </table>
                    </div>
                );
            }
        });
        var MainApp = React.createClass({
            getInitialState: function() {
                return {
                    displayed: false,
                    database: []
                };
            },
            componentDidMount: function() {
                var th = this;
                console.log(this.props.source);
                this.serverRequest = 
                    axios.get(this.props.source)
                    .then(function(result) { 
                        console.log(result);
                        console.log(result.data);
                        console.log(typeof result.data);
                        th.setState({
                            database: result.data
                         });
                    });
            },
            componentWillUnmount: function() {
                this.serverRequest.abort();
            },
            btnClickHandler: function() {
/*                alert("click");*/
                this.setState({displayed: !this.state.displayed});
/*                alert(this.state.displayed);*/
            },
            render: function() {


                var btnShow = 
                    (<div className=" btn-wrap">

                        <button className="btn btn-success"
                        onClick={this.btnClickHandler}>show {this.props.dataName}
                        </button>
                     </div>);
                var tableBlock = 
                    (<div>
                        <App dataBase={this.state.database}/>
                    </div>);
                return ( this.state.displayed ? tableBlock : btnShow )
            }
        });
        ReactDOM.render(
            <MainApp source = "http://all-today.net/rewrite/mauris_react/dataBaseBig.json" dataName="bigBase"/>,
            document.getElementById("content")
        );
        ReactDOM.render(
            <MainApp source = "http://all-today.net/rewrite/mauris_react/dataBaseSmall.json" dataName="smallBase"/>,
            document.getElementById("innerContent")
        );