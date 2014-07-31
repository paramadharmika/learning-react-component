/** @jsx React.DOM */ 
var IScrollPullDown = React.createClass({
	render: function() {
		return (
			<div className={"pullDown" + (!this.props.pullDownClassName ? "" : (" " + this.props.pullDownClassName)) }>
				<span className="pullDownIcon"></span>
				<span className="pullDownLabel">{this.props.pullDownLabel}</span>
			</div>
		);
	}
});

var IScrollPullUp = React.createClass({
	render: function () {
		console.info('ON ISCROLL PULL UP: ' + this.props.isShowingPullUpControl);
		
		if (this.props.isShowingPullUpControl) {
			return (
				<div className={"pullUp" + (!this.props.pullUpClassName ? "" : (" " + this.props.pullUpClassName)) }>
					<span className="pullUpIcon"></span>
					<span className="pullUpLabel">{this.props.pullUpLabel}</span>
				</div>
			);
		 }

		 return (
		 	<div className="center">
				<span>DOT</span>
			</div>
		 );
	}
});
