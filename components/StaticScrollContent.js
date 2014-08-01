/** @jsx React.DOM */ 
var ScrollContent = React.createClass({
	render: function() {
		var user = this.props.user;
		var renderedItems = this.props.items.map(function(item) {
			return (<li key={item.ProductName}>{item.ProductName}</li>);
		});

		return (
			<ul>
				{renderedItems}
			</ul>
		);
	}
});