/** @jsx React.DOM */ 
var IScrollContainer = React.createClass({
	myScroll: {},
	scroll_in_progress: false,
	getInitialState: function() {
		return { 
			pullState: 'pull-down-to-refresh',
		};
	},
	getDefaultProps: function() {
		return {
			pullDownLabel: 'Pull down to refresh',
			pullDownClassName: '',

			isShowingPullUpControl: false,
			pullUpLabel: '',
			pullUpClassName: '',
		};
	},
	setPullDownState: function(state) {
		if (state == 'started') {
			//set pull down props
			this.props.pullDownClassName = '';
			this.props.pullDownLabel = 'Pull down to refresh';

			//set pull up props
			this.props.isShowingPullUpControl = false;
			this.props.pullUpLabel = '';
			this.props.pullUpClassName = '';
			
			this.setState({ pullState: 'pull-down-to-refresh' });
		} else if (state == 'flip') {
			//set pull down props
			this.props.pullDownClassName = 'flip';
			this.props.pullDownLabel = 'Release to refresh';

			//set pull up props
			this.props.isShowingPullUpControl = false;
			this.props.pullUpLabel = '';
			this.props.pullUpClassName = '';

			this.setState({ pullState: 'pull-down-release-to-refresh' });
		} else if (state == 'loading') {
			//set pull down props
			this.props.pullDownClassName = 'loading';
			this.props.pullDownLabel = 'Loading';

			//set pull up props
			this.props.isShowingPullUpControl = false;
			this.props.pullUpLabel = '';
			this.props.pullUpClassName = '';

			this.setState({ pullState: 'pull-down-loading' });
		}
	},
	setInfiniteScrollState: function() {
		this.props.isShowingPullUpControl = true;
		this.props.pullUpLabel = 'Loading';
		this.props.pullUpClassName = 'loading';

		this.setState({ pullState: 'infinite-scroll-inprogress' });
	},
	componentDidMount: function() {
		var self = this;

		// var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		// var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		var marginFromTopToShowReleaseState = 56;
		var offset = marginFromTopToShowReleaseState;

		var iScrollOptions = {
			snap: false,
			momentum: true,
			useTransition: true,
			bindToWrapper: true,
			probeType: 1,
			tap: true,
			click: false,
			preventDefaultException:{tagName:/.*/},
			mouseWheel: true,
			scrollbars: true,
			fadeScrollbars: true,
			interactiveScrollbars: false,
			keyBindings: false,
			deceleration: 0.0002,
			startY: (parseInt(offset)*(-1))
		};

		this.myScroll = new IScroll(this.getDOMNode(), iScrollOptions);
		
		this.myScroll.on('scrollStart', function () {
			self.scroll_in_progress = true;
		});
		this.myScroll.on('scroll', function () {
			self.scroll_in_progress = true;
			
			if (this.y >= 5) {
				self.setPullDownState('flip');
				this.minScrollY = 0;
			} else if (this.y < 5 && self.state.pullState == 'pull-down-release-to-refresh') {
				this.minScrollY = -marginFromTopToShowReleaseState;
				this.scrollTo(0, -marginFromTopToShowReleaseState);
				self.setPullDownState('started');
			} 
			
			console.info('ISCROLL-IN-PROGRESS: ' +  this.y);
		});
		this.myScroll.on('scrollEnd', function () {
			console.info('ISCROLL-ENDED: ' + this.y);

			self.scroll_in_progress = false;

			if (self.state.pullState == 'pull-down-release-to-refresh') {
				self.setPullDownState('loading');

				//simulate async call 
				setTimeout(function () {
					self.setPullDownState('started');

					// TODO: probably dont scroll to first element let the user stay at where they were right now, 
					self.myScroll.scrollToElement('li:nth-child(1)', 100);
				}, 3000);
			} 

			console.info(this.maxScrollY);

			if (this.y == this.maxScrollY) {
				console.info('infinite scroll');
				self.setInfiniteScrollState();

				//simulate ajax call for infinite scroll
				setTimeout(function() {
					self.setPullDownState('started');
					alert('getting more data');
				}, 3000);
			}
		});
		this.myScroll.on('refresh', function() {
			console.info('ISCROLL-REFRESH');
		});

		// In order to prevent seeing the "pull down to refresh" before the iScoll is trigger - 
		//the wrapper is located at left:-9999px and returned to left:0 after the iScoll is initiated
		setTimeout(function() {
			$('#wrapper').css({left:0});
		}, 100);
	},
	componentWillUnmount: function() {
	},
	render: function() {
		console.info('ISCROLL-RENDER:' + this.state.pullState);

		return (
			<div id="wrapper" className="center-container">
				<div id="scroller">
					<IScrollPullDown pullDownLabel={this.props.pullDownLabel} pullDownClassName={this.props.pullDownClassName} />
					<ScrollContent />
					<IScrollPullUp isShowingPullUpControl={this.props.isShowingPullUpControl} 
						pullUpLabel={this.props.pullUpLabel} pullUpClassName={this.props.pullUpClassName} />
				</div>
			</div>
		);
	} 
});

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
		return (
			<div className={"pullUp" + (!this.props.pullUpClassName ? "" : (" " + this.props.pullUpClassName)) }>
				<span className="pullUpIcon"></span>
				<span className="pullUpLabel">{this.props.pullUpLabel}</span>
			</div>
		);
	}
});

/*
	todo
	- refactor iscroll pull down and pull up
	- add ajax functionality to iscroll container
	- bind items and refresh iscroll 
	- if we have only 1 page of result - we hide the pullup and pulldown indicators.
*/