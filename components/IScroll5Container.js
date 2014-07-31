/** @jsx React.DOM */ 
var IScroll5Container = React.createClass({
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

			items: [],
		};
	},
	setPullDownState: function(state) {
		if (state == 'started') {
			//set pull down props
			this.props.pullDownClassName = '';
			this.props.pullDownLabel = 'Pull down to refresh';

			//set pull up props
			this.props.isShowingPullUpControl = true ;//!this.isZeroMaxScrollY();
			this.props.pullUpLabel = '';
			this.props.pullUpClassName = '';
			
			this.setState({ pullState: 'pull-down-to-refresh' });
		} else if (state == 'flip') {
			//set pull down props
			this.props.pullDownClassName = 'flip';
			this.props.pullDownLabel = 'Release to refresh';

			//set pull up props
			this.props.isShowingPullUpControl = true ;//!this.isZeroMaxScrollY();
			this.props.pullUpLabel = '';
			this.props.pullUpClassName = '';

			this.setState({ pullState: 'pull-down-release-to-refresh' });
		} else if (state == 'loading') {
			//set pull down props
			this.props.pullDownClassName = 'loading';
			this.props.pullDownLabel = 'Loading';

			//set pull up props
			this.props.isShowingPullUpControl = true ;//!this.isZeroMaxScrollY();
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
	isZeroMaxScrollY: function() {
		return this.myScroll.maxScrollY == 0;
	},
	componentDidMount: function() {
		var self = this;

		var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		var marginFromTopToShowReleaseState = 52;
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
			startY: (parseInt(offset)*(-1)), //topOffset functionality as with iscroll4
			onScrollStart: function() {
				console.info("*********: " + this.y);
			}
		};

		this.myScroll = new IScroll(this.getDOMNode(), iScrollOptions);

		this.myScroll.on('scrollStart', function () {
			self.scroll_in_progress = true;
			console.info('---ISCROLL-SCROLL-START');
		});
		this.myScroll.on('scroll', function () {
			self.scroll_in_progress = true;
			
			if (this.y >= 5) {
				self.setPullDownState('flip');
				this.minScrollY = 0;
				console.info('-----ISCROLL-IN-PROGRESS-FLIP: ' +  this.y);
			} else if (this.y < 5 && self.state.pullState == 'pull-down-release-to-refresh') {
				console.info('-----ISCROLL-IN-PROGRESS-RELEASE-TO-REFRESH: ' +  this.y);
				this.minScrollY = -marginFromTopToShowReleaseState;
				this.scrollTo(0, -marginFromTopToShowReleaseState);
				self.setPullDownState('started');
			} 
			
			console.info('-----ISCROLL-IN-PROGRESS: ' +  this.y);
		});
		this.myScroll.on('scrollEnd', function () {
			console.info('---ISCROLL-ENDED: ' + this.y);

			self.scroll_in_progress = false;

			//simulate async call 
			if (self.state.pullState == 'pull-down-release-to-refresh') {
				self.setPullDownState('loading');
				
				setTimeout(function () {
					self.setPullDownState('started');

					// TODO: probably dont scroll to first element let the user stay at where they were right now, 
					self.myScroll.scrollToElement('li:nth-child(1)', 100);
					console.info('---ISCROLL-ENDED-SCROLL-TO-FIRST-ELEMENT: ' + self.myScroll.y);
					
					alert('fetching new data');
					//TODO: added variable here> to say "i'm just finish with pull to refresh so dont get me infinite scroll"
				}, 3000);
			} 

			console.info('ISCROLL-MAX-SCROLL-Y : ' + this.maxScrollY);
			console.info('ISCROLL-VIEWPORT-HEIGHT : ' + viewportHeight);

			// its end of list and we have scrolling area
			if (this.y == this.maxScrollY && !self.isZeroMaxScrollY()) {
				//prohibit user to do infinite scroll again, if its already in progress
				if (self.state.pullState == 'infinite-scroll-inprogress') {
					return;
				}

				console.info('ISCROLL-INFINITE-SCROLL');
				self.setInfiniteScrollState();

				//simulate ajax call for infinite scroll
				setTimeout(function() {
					self.setPullDownState('started');
					alert('getting more data');

					self.myScroll.refresh();
				}, 3000);
			}

			console.info('*********************************************************************');
		});

		this.myScroll.on('refresh', function() {
			console.info('ISCROLL-REFRESH');
		});

		this.props.isShowingPullUpControl = !this.isZeroMaxScrollY();

		console.info('ISCROLL-COMPONENT-DID-MOUNT');

		// In order to prevent seeing the "pull down to refresh" before the iScoll is trigger - 
		//the wrapper is located at left:-9999px and returned to left:0 after the iScoll is initiated
		setTimeout(function() {
			$('#wrapper').css({left:0});
		}, 100);

		//TODO: DO WE NEED THIS?????
		if (isZeroMaxScrollY()) {
			document.addEventListener('touchstart', function() {

			});

			document.addEventListener('touchend', function() {

			});
		}
	},
	componentWillUnmount: function() {
		document.removeEventListener('touchstart');
		document.removeEventListener('touchend');
	},
	render: function() {
		console.info('ISCROLL-RENDER:' + this.state.pullState);

		return (
			<div id="wrapper" className="center-container">
				<div id="scroller">
					<IScrollPullDown pullDownLabel={this.props.pullDownLabel} pullDownClassName={this.props.pullDownClassName} />
					<ScrollContent items={this.props.items} />
					<IScrollPullUp isShowingPullUpControl={this.props.isShowingPullUpControl} 
						pullUpLabel={this.props.pullUpLabel} pullUpClassName={this.props.pullUpClassName} />
				</div>
			</div>
		);
	} 
});

/*
	todo
	- refactor iscroll pull down and pull up
	- add ajax functionality to iscroll container with deferred function
	- bind items and refresh iscroll 
	- if we have only 1 page of result - we hide the pullup indicators.
*/
