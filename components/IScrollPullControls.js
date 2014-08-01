/** @jsx React.DOM */ 
var IScrollPullDown = React.createClass({
	getInitialState: function() {
		return {
			pullDownClassName: '',
			pullDownLabel: '',
			pullState: 'idle'
		};
	},
	showPullDownControl: function() {
		this.state.pullDownLabel = 'Pull down to refresh';
		this.state.pullDownClassName = '';
		this.state.pullState = 'pullingDown';
		this.setState(this.state);
	},
	showPullDownReleaseToRefreshControl: function() {
		this.state.pullDownLabel = 'Release to refresh';
		this.state.pullDownClassName = 'flip';
		this.state.pullState = 'flip';
		this.setState(this.state);
	},
	showPullDownLoadingControl: function() {
		this.state.pullDownLabel = 'Loading';
		this.state.pullDownClassName = 'loading';
		this.state.pullState = 'loading';
		this.setState(this.state);
	},
	showIdleControl: function() {
		var state = this.getInitialState();
		this.setState(state);
	},
	isOnPullDownState: function() {
		return this.state.pullState === 'pullingDown';
	},
	isOnReleaseToRefreshState: function() {
		return this.state.pullState === 'flip';
	},
	isOnLoadingState: function() {
		return this.state.pullState === 'loading';
	},
	isOnIdleState: function() {
		return this.state.pullState === 'idle';
	},
	render: function() {
		return (
			<div className={"pullDown" + (!this.state.pullDownClassName ? "" : (" " + this.state.pullDownClassName)) }>
				<span className="pullDownIcon"></span>
				<span className="pullDownLabel">{this.state.pullDownLabel}</span>
			</div>
		);
	}
});

var IScrollPullUp = React.createClass({
	getInitialState: function() {
		return {
			pullUpClassName: '',
			pullUpLabel: '',
			pullState: 'idle',
			isExcededViewport: false,
		};
	},
	showIdleControl: function() {
		this.state.pullUpLabel = '';
		this.state.pullUpClassName = '';
		this.state.pullState = 'idle';
		this.setState(this.state);
	},
	showInfiniteLoadingControl: function() {
		this.state.pullUpLabel = 'Loading';
		this.state.pullUpClassName = 'loading';
		this.state.pullState = 'loading';
		this.setState(this.state);
	},
	isOnIdleState: function() {
		return this.state.pullState === 'idle';
	},
	isOnLoadingState: function() {
		return this.state.pullState === 'loading';
	},
	setExcededViewport: function(isExcedeed) {
		var state = this.getInitialState();
		state.isExcededViewport = isExcedeed;

		this.setState(state);
	},
	isExcededViewportState: function() {
		return this.state.isExcededViewport;
	},
	render: function () {
		// TODO: can combined with has more data from server data
		if (this.state.isExcededViewport /*|| this.state.hasMoreData*/) { 
			return (
				<div className={"pullUp" + (!this.state.pullUpClassName ? "" : (" " + this.state.pullUpClassName)) }>
					<span className="pullUpIcon"></span>
					<span className="pullUpLabel">{this.state.pullUpLabel}</span>
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
