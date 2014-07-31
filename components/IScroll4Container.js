/** @jsx React.DOM */ 
var IScroll4Container = React.createClass({
	myScroll: {},
	scroll_in_progress: false,
	getInitialState: function() {
		return { 
			pullState: 'pull-down-to-refresh',
			isOnePage: false,
		};
	},
	getDefaultProps: function() {
		return {
			pullDownLabel: 'Pull down to refresh',
			pullDownClassName: '',

			pullUpLabel: '',
			pullUpClassName: '',

			items: [],
			user: {},

			// event handlers props
			onPullDown: function() {

			}, 
			onPullUp: function() {

			}
		};
	},
	setPullDownState: function(state, singlePage) {
		if (state == 'pull-down-to-refresh') {
			//set pull down props
			this.props.pullDownClassName = '';
			this.props.pullDownLabel = 'Pull down to refresh';

			//set pull up props
			this.props.pullUpLabel = '';
			this.props.pullUpClassName = '';
			
			this.setState({ pullState: 'pull-down-to-refresh', isOnePage: singlePage });
		} else if (state == 'pull-down-release-to-refresh') {
			//set pull down props
			this.props.pullDownClassName = 'flip';
			this.props.pullDownLabel = 'Release to refresh';

			//set pull up props
			this.props.pullUpLabel = '';
			this.props.pullUpClassName = '';

			this.setState({ pullState: 'pull-down-release-to-refresh', isOnePage: singlePage });
		} else if (state == 'pull-down-loading') {
			//set pull down props
			this.props.pullDownClassName = 'loading';
			this.props.pullDownLabel = 'Loading';

			//set pull up props
			this.props.pullUpLabel = '';
			this.props.pullUpClassName = '';

			this.setState({ pullState: 'pull-down-loading', isOnePage: singlePage });
		}
	},
	setInfiniteScrollState: function() {
		this.props.pullUpLabel = 'Loading';
		this.props.pullUpClassName = 'loading';

		this.setState({ pullState: 'infinite-scroll-inprogress' });
	},
	componentDidMount: function() {
		var self = this;

		var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		var marginFromTopToShowReleaseState = 59;
		var offset = marginFromTopToShowReleaseState;
		var isOnePage = false;

		var iScrollOptions = {
			snap: false,
            momentum: true,
            hScrollbar: false,
			useTransition: true,
			bindToWrapper: true,
			topOffset: offset,
			hideScrollbar: true,
			fadeScrollbar: false,
			onRefresh: function () {
				isOnePage = $('#scroller').height() <= (viewportHeight - (2*marginFromTopToShowReleaseState));
				console.info('ISCROLL-ON-REFRESH: ' + this.y + ', isOnePage:' + isOnePage);
				self.setPullDownState(self.state.pullState, isOnePage);
			},
			onScrollStart: function() {

			},
			onScrollMove: function () {
				self.scroll_in_progress = true;
			
				if (this.y >= 5 && self.state.pullState == 'pull-down-to-refresh') {
					self.setPullDownState('pull-down-release-to-refresh', self.state.isOnePage);
					this.minScrollY = 0;
					console.info('-----ISCROLL-IN-PROGRESS-FLIP: ' +  this.y);
				} else if (this.y < 5 && self.state.pullState == 'pull-down-release-to-refresh') {
					self.setPullDownState('pull-down-to-refresh', self.state.isOnePage);
					this.minScrollY = -marginFromTopToShowReleaseState;
					console.info('-----ISCROLL-IN-PROGRESS-RELEASE-TO-REFRESH: ' +  this.y);
				} else if (this.y > (this.maxScrollY + 5)) {
					// console.info('-----ISCROLL-ENTERING-INFINITE-SCROLL: ' +  this.y);
				}

				console.info('-----ISCROLL-IN-PROGRESS: ' +  this.y);
			},
			onScrollEnd: function () {
				console.info('---ISCROLL-ENDED: ' + this.y);

				self.scroll_in_progress = false;

				//simulate async call 
				if (self.state.pullState == 'pull-down-release-to-refresh') {
					self.setPullDownState('pull-down-loading', self.state.isOnePage);

					self.props.onPullDown().then(function(success) {
						console.info('---ISCROLL-ENDED-SCROLL-TO-FIRST-ELEMENT: ' + self.myScroll.y);
						alert('fetching new data');

						self.myScroll.refresh();
						self.setPullDownState('pull-down-to-refresh', self.state.isOnePage);

						// 	// TODO: probably dont scroll to first element let the user stay at where they were right now, 
						// 	// TODO: added variable here> to say "i'm just finish with pull to refresh so dont get me infinite scroll"
					}, function (error) {
						// TODO: show error, broadcast event to angular world
					});
					
					// setTimeout(function () {
					// }, 1500);
				} 

				if (!self.state.isOnePage) {
					//detect scrolling to end of list and see if this page are still on one page
					if (this.y == this.maxScrollY) {
						//prohibit user to do infinite scroll again, if its already in progress
						if (self.state.pullState == 'infinite-scroll-inprogress') {
							return;
						}

						console.info('ISCROLL-INFINITE-SCROLL');
						self.setInfiniteScrollState();

						//simulate ajax call for infinite scroll

						self.props.onPullUp().then(function(success) {
							self.setPullDownState('pull-down-to-refresh', self.state.isOnePage);
							alert('getting more data');

							self.myScroll.refresh();
						}, function (error) {
							// TODO: show error, broadcast event to angular world
						});

						// setTimeout(function() {
						// }, 1500);
					}
				}
				
				console.info('ISCROLL-MAX-SCROLL-Y : ' + this.maxScrollY);
				console.info('ISCROLL-VIEWPORT-HEIGHT : ' + viewportHeight);
			}
		};

		this.myScroll = new iScroll(this.getDOMNode(), iScrollOptions);
		console.info('ISCROLL-COMPONENT-DID-MOUNT');

		// In order to prevent seeing the "pull down to refresh" before the iScoll is trigger - 
		// the wrapper is located at left:-9999px and returned to left:0 after the iScoll is initiated
		setTimeout(function() {
			$('#wrapper').css({ left:0 });
		}, 100);
	},
	componentWillUnmount: function() {
		// document.removeEventListener('touchstart');
		// document.removeEventListener('touchend');
	},
	render: function() {
		console.info('ISCROLL-RENDER:' + this.state.pullState);

		/*if (this.props.items.length) {

		}*/

		return (
			<div id="wrapper" className="center-container">
				<div id="scroller">
					<IScrollPullDown pullDownLabel={this.props.pullDownLabel} pullDownClassName={this.props.pullDownClassName} />
					<ScrollContent items={this.props.items} user={this.props.user} />
					<IScrollPullUp isShowingPullUpControl={!this.state.isOnePage} 
						pullUpLabel={this.props.pullUpLabel} pullUpClassName={this.props.pullUpClassName} />
				</div>
			</div>
		);
	} 
});
