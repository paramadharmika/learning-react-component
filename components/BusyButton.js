/** @jsx React.DOM */
var BusyButton = React.createClass({
    propTypes: {
        onClickHandler: React.PropTypes.func,
    },
    getInitialState: function () {
        return { isBusy: false };
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({isBusy: nextProps.busyState});
    },
    onClickHandler: function (e) {
        e.preventDefault();

        if (this.props.onClickHandler) {
            this.setState({ isBusy: true });
            this.props.onClickHandler();
        }
    },
    render: function() {
        if (this.state.isBusy) {
            return (
                <button className={this.props.className}>
                    <BusyMessage message={this.props.busyMessage} />
                </button>
            );
        } 

        return this.transferPropsTo (
            <button onClick={this.onClickHandler}>{this.props.labelCaption}</button>
        );
    }
});

var BusyMessage = React.createClass({
    render: function() {
        if (this.props.message) {
            return (
                <span><i className="fa fa-refresh fa-spin"></i>&nbsp;{this.props.message}</span>
            );
        } 

        return (
            <i className="fa fa-refresh fa-spin"></i>
        );
    }
});
